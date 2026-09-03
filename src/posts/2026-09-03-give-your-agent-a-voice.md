---
title: "Give Your Agent a Voice"
date: "2026-09-03"
category: "AI & Agents"
tags: ["elevenlabs", "strands", "ai agents", "voice", "python"]
image: "/images/speech-1-bench.jpg"
description: "Adding speech to a Strands agent with ElevenLabs Speech Engine — where the seam goes, why interruption is the hard part, and what breaks if you get the history wrong."
---

![A workshop bench with a brass ear trumpet, a ribbon microphone and a sealed black flight case, the open window behind looking onto felted green hills, a windmill, a baby-faced sun, and four antennae just cresting the nearest hill](/images/speech-1-bench.jpg)

I spent an evening giving a [Strands](https://strandsagents.com/) agent a voice using **ElevenLabs Speech Engine**. It is four Python files, runs in one process, and a good third of it is comments. The code is at [brianbruff/speech-poc](https://github.com/brianbruff/speech-poc).

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

If it looks anticlimactic, good. That is what a well-placed seam looks like.

## The part that actually took the time: interruption

![A reel-to-reel tape machine on a workbench, the tape cut clean through mid-run, scissors lying beside the cut](/images/speech-4-cut.jpg)

Barge-in — the user talking over the agent — is the feature that makes a voice agent feel alive, and it is where a naive implementation quietly breaks.

The SDK handles it by cancelling the asyncio task running your transcript handler. Which is correct, and which means a `CancelledError` is going to tear through the middle of your generator while it is parked on a `yield`.

The failure I hit: interrupt the agent once, and the *next* turn dies with a `ConcurrencyException`. Strands holds an invocation lock for the duration of a run and releases it in a `finally`. But a suspended async generator's `finally` doesn't run when the task around it is cancelled — it runs whenever the garbage collector gets around to finalising the generator. Which might be after the next turn has already started.

`contextlib.aclosing` is the fix. Unwinding the outer generator closes the inner one deterministically, the `finally` runs, the lock is released.

And then the same problem one level up, because the cancellation can also land while `send_response` is awaiting a WebSocket write:

```python
async def respond(session, agent, prompt) -> None:
    chunks = strands_to_chunks(agent, prompt)
    try:
        await session.send_response(chunks)
    finally:
        await chunks.aclose()
```

Explicit `aclose()` in a `finally`. The SDK awaits the cancelled task, so this runs before the next turn begins.

Two lines of cleanup, and both of them are the difference between "interruption works" and "interruption works once".

## Whose transcript is the truth?

![A leather-bound ledger open under a brass lamp, the right-hand page trailing off mid-line with a fountain pen abandoned across it](/images/speech-5-ledgers.jpg)

`on_transcript` hands you the **full** conversation history every turn, not just the new utterance. Strands agents also maintain their own message list. So you have two copies of the conversation and you must pick one, or you will double every turn.

I went with: **ElevenLabs' transcript is the source of truth.** Every turn, overwrite `agent.messages` with the mapped history and prompt the agent with only the newest user utterance.

Three reasons, and the third is the one that convinced me:

1. **No doubling.** The transcript is always complete, so letting the agent also accumulate guarantees duplication.
2. **Interruption leaves the agent's own state torn.** A cancelled turn has already appended the user message but may never append the assistant reply — a dangling user turn that breaks role alternation on the next Bedrock call. Rebuilding from the transcript heals that for free.
3. **The transcript is what the user actually heard.** An interrupted reply appears truncated at the point of interruption. That is the conversation the user believes they are in. The agent's own state contains the full text it never got to say — which is a *different conversation*, and answering follow-ups from it makes the agent seem to be remembering things nobody said.

Two mapping details, because both bite. ElevenLabs calls the assistant role `agent`, so map it. And Bedrock demands strict user/assistant alternation starting with a user turn — the client-side greeting shows up as a leading assistant message, so drop it and merge consecutive same-role turns.

The cost of this choice: anything the agent knows that isn't in the transcript — tool results, reasoning — is discarded between turns. For a POC that's the right trade. For production it isn't, and I'll come back to that.

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

## The ngrok tax

The engine resource stores your WebSocket URL **server-side**. Free-plan ngrok gives you a new hostname every restart. So: ngrok restarts, the engine still points at a dead tunnel, and ElevenLabs dials into nothing.

The failure mode is silence. The browser connects, the status goes green, you talk, and nothing ever reaches your server. No error anywhere.

Two mitigations. Make the setup script idempotent — if `SPEECH_ENGINE_ID` is already set it calls `update` instead of `create`, so re-pointing takes one command and the ID stays valid. And have the server compare the URL in your `.env` against what the engine is actually registered with, and warn loudly at startup when they disagree.

Or reserve a domain and skip the whole category. `ngrok http --domain=you.ngrok-free.app 3001`.

## Where this is weakest

Being honest about the seam, because a POC that doesn't tell you what it's hiding isn't much use.

**Rebuilding history from the transcript discards tool state.** It's the right call for correctness under interruption and the wrong one for any agent whose tools are expensive or stateful. Production wants server-side conversation state keyed by conversation ID, reconciled against the transcript rather than replaced by it.

**One agent per WebSocket, in memory.** Fine for one process. The moment you run two replicas behind a load balancer, a reconnect lands on the wrong box and the conversation is gone.

**Nothing sanitises what goes to TTS.** The system prompt asks for plain spoken prose with no markdown, and Claude obliges — but "asks nicely" is not a guarantee, and the first time a model emits a bulleted list your users hear "asterisk". A filter between the agent and `send_response` is a hundred lines and belongs in anything real.

**Latency is unmeasured.** I have no numbers for transcript-in to first-audio-out, and that single number is the entire user experience of a voice agent. It's the first thing I'd instrument.

None of that is Speech Engine's problem. It is the shape of the seam between a text agent and a voice pipeline, and it is exactly where I'd want to spend the effort — because the agent underneath still doesn't know it's being spoken aloud, and I intend to keep it that way.
