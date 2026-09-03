---
title: "Give Your Agent a Voice"
date: "2026-09-03"
category: "AI & Agents"
tags: ["elevenlabs", "strands", "ai agents", "voice", "python"]
image: "/images/speech-1-bench.jpg"
description: "Adding speech to a Strands agent with ElevenLabs Speech Engine — what it is, where the seam goes, and how little code it takes to get a voice agent running."
---

![A workshop bench with a brass ear trumpet, a ribbon microphone and a sealed black flight case, the open window behind looking onto felted green hills, a windmill, a baby-faced sun, and four antennae just cresting the nearest hill](/images/speech-1-bench.jpg)

I spent an evening giving a [Strands](https://strandsagents.com/) agent a voice using **ElevenLabs Speech Engine**. It is four Python files, runs in one process, and a good third of it is comments. The code is at <a href="https://github.com/brianbruff/speech-poc" target="_new" rel="noopener">brianbruff/speech-poc</a>.

The headline result is the thing I care about most: `agent.py` has no ElevenLabs imports. None. It doesn't import a WebSocket library, it doesn't know what a transcript is, and it has never heard of turn-taking. It is the same Strands agent I would have written for a text chat, and the voice layer bolts onto the outside of it.

That is the whole design goal, and it's worth being explicit about why it matters: the moment your agent knows it is being spoken aloud, you can no longer test it without a microphone.

## Speech Engine is not ElevenAgents

This is the distinction that decides your architecture, so get it straight first.

**ElevenAgents** is the hosted product. You give ElevenLabs a system prompt and some tools, they run the LLM, and you get a voice agent. Fast, and you own none of it.

**Speech Engine** is the unbundled version. ElevenLabs does speech-to-text, turn-taking and text-to-speech — the ears and the mouth. **The brain stays on your server.** They open a WebSocket *to you*, push transcripts down it, and speak whatever text you stream back.

That inversion is the whole point. My conversation logic, my model choice, my tools, my logs, my compliance boundary. ElevenLabs handles the part I have no interest in writing, which is a good low-latency audio pipeline with barge-in that doesn't feel awful.

The loop:

```
 browser mic  -->  ElevenLabs ASR  -->  wss://<you>/ws  -->  server.py
                                                                 |
                                                                 v
                                                             bridge.py
                                                                 |
                                                                 v
                                                   agent.py (Strands -> Bedrock)
                                                                 |
 browser speaker  <--  ElevenLabs TTS  <--  text deltas  <-------+
```

Each WebSocket connection is one conversation. The Python SDK is async-only — `AsyncElevenLabs`, no sync fallback — which is the right call for something whose entire job is streaming, but will surprise you if you were planning to drop it into a synchronous codebase.

## The test subject is a Teletubbies expert, and that isn't the joke

The agent I built is an authority on Teletubbies. It knows the four of them, Tubby Custard, the Noo-Noo, and the Tubbytronic Superdome, and it answers in two or three spoken sentences because that's what a voice agent has to do.

I picked it to be silly, and then it turned out to be the most useful thing in the POC.

![A miniature landscape of felted green hills with a windmill, rabbits and a baby-faced sun; a brass microphone stands on a tripod in the foreground with four antennae rising over the hill behind it](/images/speech-2-hills.jpg)

Here's why. Every ASR system is a language model with an acoustic front end. It doesn't hear phonemes and write them down; it hears phonemes and asks *what is the most probable English sentence that sounds like this*. Which means it is systematically, confidently wrong about any proper noun that doesn't exist in ordinary English. Out of the box:

| You say | Scribe hears |
| --- | --- |
| Laa-Laa | "la la" |
| Tinky Winky | "twinky winky" |
| Noo-Noo | "new new" |
| Tubbytronic Superdome | anything at all |

Your agent then gets a prompt containing "twinky winky", fails to match its tool argument, and you spend twenty minutes debugging a tool-calling bug that is not a tool-calling bug.

![An open card-index drawer of handwritten cards on a dark workbench, four of them tabbed in purple, green, yellow and red](/images/speech-3-index.jpg)

Speech Engine has a fix, and it is one field on the engine resource:

```python
engine = await elevenlabs.speech_engine.create(
    name="Teletubbies Strands POC",
    speech_engine={"ws_url": ws_url},
    asr={"keywords": [
        "Tinky Winky", "Dipsy", "Laa-Laa", "Po",
        "Noo-Noo", "Tubby Custard", "Tubby Toast",
        "Tubbytronic Superdome",
    ]},
    # Lets the browser send overrides.agent.firstMessage so the agent
    # greets first. Must be enabled at create time.
    overrides={"first_message": True},
)
```

`asr.keywords` biases the transcriber toward your vocabulary. It works, and the difference is not subtle.

Now substitute your own domain. Drug names. Part numbers. Irish place names. Your product's feature names. Every serious voice agent has a list of words the ASR has never seen, and if you don't register them you will misdiagnose the failure as a model problem when it is a transcription problem two layers down. A children's television show is just a cheap way to make that failure mode loud enough to notice in ten minutes rather than three weeks.

I also kept a small alias table in the agent — `"tipsy" → "dipsy"` — as a second line of defence. Belt and braces, because ASR will still occasionally hand you something creative.

## The seam: turning a Strands stream into text deltas

`session.send_response()` accepts a string, an async iterable of strings, or a native OpenAI/Anthropic/Gemini stream. It does not understand Strands, and it shouldn't have to. So you write the adapter, and it is genuinely small:

```python
async def strands_to_chunks(agent, prompt) -> AsyncIterator[str]:
    async with aclosing(agent.stream_async(prompt)) as events:
        async for event in events:
            if not isinstance(event, dict) or event.get("reasoning"):
                continue
            delta = event.get("data")
            if isinstance(delta, str) and delta:
                yield delta
```

`Agent.stream_async()` yields event dicts. Text deltas arrive under `data`. Everything else — `current_tool_use`, `tool_stream`, reasoning blocks, the final `AgentResultEvent` — has no `data` key and gets dropped on the floor. That's it. That is the entire Strands-to-ElevenLabs translation.

The `aclosing` earns its place: when the user talks over the agent the SDK cancels this turn mid-stream, and closing the generator deterministically is what lets the next one start cleanly.

If it looks anticlimactic, good. That is what a well-placed seam looks like.

## One process, and one line you should not delete

The docs describe three processes: WebSocket server, token server, client dev server. For a spike, collapse them. One FastAPI app on port 3001 serving `/ws`, `/api/token` and a static page, with ngrok in front so ElevenLabs can reach you.

Use `engine.create_session(ws)` — the Starlette integration path that wraps an existing ASGI WebSocket — rather than `engine.serve()`, which wants to own its own server.

The catch: `engine.serve()` also verifies the JWT that ElevenLabs signs every upgrade with. On the FastAPI path you own the handshake, so you own the check:

```python
@app.websocket("/ws")
async def speech_engine_ws(ws: WebSocket) -> None:
    if not engine.verify_request(dict(ws.headers)):
        await ws.close(code=1008)
        return
    await ws.accept()
```

`/ws` is a public URL on the open internet. Without those four lines, anyone who finds it can open conversations against your Bedrock spend. It is the easiest line in the whole thing to skip while you're getting it working, and the worst one to forget afterwards.

One genuine API oddity: the token endpoint is `conversational_ai.conversations.get_webrtc_token(agent_id=...)` and you pass it your `seng_...` Speech Engine ID. The parameter is called `agent_id`, it accepts both kinds of ID, and it resolves them to the same underlying resource. Confusing, correct, worth a comment in your code.

## Why ngrok is in the picture

![A small round felted figure with a curly antenna stands on a hill with its arms up, shouting into a brass horn whose tube runs down over the fields, in through a workshop window, and into a flight case on the bench](/images/speech-4-tunnel.jpg)

Because the connection runs the other way. ElevenLabs opens the WebSocket *to you*, which means your server needs an address on the public internet — and a FastAPI app on `localhost:3001` hasn't got one.

For a demo you don't want to deploy anything just to find that out, so ngrok stands in front of your laptop and forwards a public HTTPS hostname to port 3001:

```bash
ngrok http 3001
```

Register `wss://<that-host>/ws` on the engine resource and ElevenLabs will dial it. Two things running, nothing deployed.

**One gotcha, and it will catch you.** The engine stores that URL server-side, and free-plan ngrok issues a new hostname every restart — so the moment you restart the tunnel, the engine is pointing at one that no longer exists. The failure is silent: the browser connects, the status goes green, you talk, and nothing ever reaches your server. Re-run the setup script to re-point the engine (it updates in place when `SPEECH_ENGINE_ID` is already set, so the ID stays valid), or sidestep the whole thing with a reserved domain — `ngrok http --domain=you.ngrok-free.app 3001`.

## How little there was to it

That's the part worth taking away. ElevenLabs takes the microphone, the transcription, the turn-taking and the speech; Strands runs the agent; the piece in the middle that joins them is one small adapter function and a handful of callbacks. An evening's work, and `agent.py` never found out it had a voice.

Voice is the bit of agent work I'd always quietly filed under "later" — too much audio plumbing, too much latency to chase. Speech Engine collapses it into a single sitting, and it does that without taking the model, the tools or the data off my server, which is what makes it worth using on something real rather than just a demo.

I expect to be reaching for this a lot.
