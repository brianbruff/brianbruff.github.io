---
title: "What Should Your Agent Remember? AgentCore Memory, Worked Through"
date: "2026-10-21"
category: "AI & Agents"
tags: ["aws", "agentcore", "strands", "ai agents", "memory", "python"]
description: "A support agent that forgets everything between conversations makes every user start from zero. Here is AgentCore Memory wired into a Strands agent, one user across two conversations and a second user who benefits from the first one's bad Monday."
# image: "/images/memory-1-overview.jpg"
---

<!-- IMAGE PLACEHOLDER (hero / social card)
alt: Two support conversations, Monday and Thursday, connected through AgentCore Memory: a short-term event log tied to the Monday session and long-term records tied to the user, which the Thursday session reads from.
prompt: Flat technical diagram, 16:9, near-black background (#0a0705), thin copper (#b26a3c) outline strokes, amber (#e39b4a) for one highlighted path, lots of empty space, no 3D, no people, no logos, no gradients, no words or letters. Left: a tall rounded rectangle holding a long vertical stack of about forty thin bars (a long chat transcript). Right: an identical rectangle holding only two short bars (a new chat). Centre: a wider block split into two layers; the top layer is a row of small square tiles (an event log) joined by a thin dashed copper line only to the left rectangle; the bottom layer is four small drawers side by side. One solid amber arrow runs from the drawers to the right rectangle.
-->

Monday, 09:40. Aoife opens the support chat for a desktop app with cloud sync. Sync has been failing since the morning. Over forty minutes the agent establishes the app version (3.2), the OS (macOS) and the network (the office). It suggests a reinstall, which does nothing. Then it reads the sync log, sees TLS handshake failures, works out that the company proxy is intercepting the traffic, and walks Aoife through pointing the app at the proxy's certificate. Sync comes back. On the way out, Aoife says: *next time just give me the terminal commands, I don't need the tour.*

Thursday, 14:15. New chat. "Sync's broken again."

A stateless agent asks which version they're on.

That's the whole problem. Every model call starts from nothing, and the conversation history is the only state there is. Close the chat and it's gone. Keep every transcript and replay it, and by the third conversation you're paying to send the model forty turns of Monday to answer one line on Thursday.

[AgentCore Memory](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html) is AWS's managed answer to that. This post wires it into a [Strands](https://strandsagents.com/) agent for exactly the scenario above and follows what happens to each sentence Aoife types: where it's stored, what it becomes, and what the agent sees on Thursday.

## Two kinds of memory, two different keys

AgentCore Memory is one resource with two layers, and the layers are keyed differently. Most of what follows comes down to that.

**Short-term memory is the event log, keyed by session.** Every turn is written as an event with `CreateEvent`, tagged with an `actorId` (who) and a `sessionId` (which conversation). It's the raw transcript. If Aoife's browser crashes on Monday and the chat reconnects with the same session ID, the agent reloads the conversation and carries on. Open a new session and short-term memory has nothing for you.

**Long-term memory is extracted records, keyed by namespace.** You attach *strategies* to the memory resource. After events land, AgentCore runs those strategies in the background: an LLM reads the new turns, **extracts** anything worth keeping, then **consolidates** it against what's already stored, deciding whether this is a new record or an update to an existing one. The result is a small set of short text records, embedded for semantic search and filed under a namespace you choose, like `/facts/aoife/`.

The session dies, the records don't. Thursday's agent is in a fresh session with an empty short-term log, and it can still search everything long-term memory knows about Aoife.

There are four built-in strategies, and each one answers a different question:

| Strategy | Answers | From Monday, it would keep |
|---|---|---|
| `semanticMemoryStrategy` | What's true about this user? | On v3.2, on macOS; office network has a TLS-intercepting proxy |
| `userPreferenceMemoryStrategy` | How do they like to be dealt with? | Wants terminal commands, not step-by-step walkthroughs |
| `summaryMemoryStrategy` | What happened in that conversation? | Sync failed with TLS errors; reinstall didn't help; fixed by trusting the proxy's certificate |
| `episodicMemoryStrategy` | What did we try, and what worked? | The episode: goal, tools used, the failed reinstall, the fix. Then, across many episodes, *reflections* |

That right-hand column is illustrative. The real records are worded by the extraction model, not by me, and they'll be a little different every time.

<div class="figure">
<figure>
<svg viewBox="0 0 760 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The write path. A turn is written with CreateEvent into the short-term log for session mon. Across a boundary marked background, four strategies (semantic, preference, summary and episodic) each extract and then consolidate, filing records under /facts/aoife/, /preferences/aoife/, /summaries/aoife/mon/ and /fixes/aoife/. The episodic lane also writes reflections across episodes to the shared /fixes/ namespace.">
  <text class="f-label" x="8" y="16">The write path: one turn, two layers</text>
  <text class="f-label" x="246" y="40" text-anchor="end">during the request</text>
  <text class="f-label" x="270" y="40">in the background</text>
  <line x1="258" y1="28" x2="258" y2="318" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 5"/>
  <rect x="20" y="60" width="210" height="60" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="32" y="84">a user or agent turn</text>
  <text class="f-note" x="32" y="104">CreateEvent(actor, session)</text>
  <line x1="125" y1="120" x2="125" y2="144" stroke="#b26a3c" stroke-width="1.5"/>
  <path d="M125 150 L120 140 L130 140 Z" fill="#b26a3c"/>
  <rect x="20" y="152" width="210" height="92" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-label" x="32" y="172">short-term</text>
  <rect x="32" y="184" width="24" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="61" y="184" width="24" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="90" y="184" width="24" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="119" y="184" width="24" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="148" y="184" width="24" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="177" y="184" width="24" height="18" fill="#e39b4a"/>
  <text class="f-note" x="32" y="228">session mon · raw turns</text>
  <path d="M230 198 L282 80" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M230 198 L282 140" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M230 198 L282 200" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M230 198 L282 260" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="290" y="85">semantic</text>
  <text class="f-node" x="290" y="145">preference</text>
  <text class="f-node" x="290" y="205">summary</text>
  <text class="f-node" x="290" y="265">episodic</text>
  <rect x="396" y="67" width="76" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="434" y="84" text-anchor="middle">extract</text>
  <rect x="396" y="127" width="76" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="434" y="144" text-anchor="middle">extract</text>
  <rect x="396" y="187" width="76" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="434" y="204" text-anchor="middle">extract</text>
  <rect x="396" y="247" width="76" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="434" y="264" text-anchor="middle">extract</text>
  <line x1="472" y1="80" x2="490" y2="80" stroke="#b26a3c" stroke-width="1"/>
  <line x1="472" y1="140" x2="490" y2="140" stroke="#b26a3c" stroke-width="1"/>
  <line x1="472" y1="200" x2="490" y2="200" stroke="#b26a3c" stroke-width="1"/>
  <line x1="472" y1="260" x2="490" y2="260" stroke="#b26a3c" stroke-width="1"/>
  <rect x="490" y="67" width="108" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="544" y="84" text-anchor="middle">consolidate</text>
  <rect x="490" y="127" width="108" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="544" y="144" text-anchor="middle">consolidate</text>
  <rect x="490" y="187" width="108" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="544" y="204" text-anchor="middle">consolidate</text>
  <rect x="490" y="247" width="108" height="26" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="544" y="264" text-anchor="middle">consolidate</text>
  <text class="f-note" x="490" y="110">new · update · nothing new</text>
  <line x1="598" y1="80" x2="616" y2="80" stroke="#e39b4a" stroke-width="1.5"/>
  <line x1="598" y1="140" x2="616" y2="140" stroke="#e39b4a" stroke-width="1.5"/>
  <line x1="598" y1="200" x2="616" y2="200" stroke="#e39b4a" stroke-width="1.5"/>
  <line x1="598" y1="260" x2="616" y2="260" stroke="#e39b4a" stroke-width="1.5"/>
  <text class="f-note f-warm" x="622" y="84">/facts/aoife/</text>
  <text class="f-note f-warm" x="622" y="144">/preferences/aoife/</text>
  <text class="f-note f-warm" x="622" y="204">/summaries/aoife/mon/</text>
  <text class="f-note f-warm" x="622" y="264">/fixes/aoife/</text>
  <path d="M544 273 L544 302 L612 302" fill="none" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 4"/>
  <path d="M618 302 L608 297 L608 307 Z" fill="#b26a3c"/>
  <text class="f-note" x="622" y="306">/fixes/  reflections</text>
  <text class="f-note" x="396" y="322">across many episodes, later</text>
</svg>
<figcaption>The request only writes the event. Everything to the right of the dashed line happens afterwards, without the user waiting for it. Each strategy runs its own extraction prompt over the same new turns and files the result under its own namespace. Consolidation is why a corrected fact replaces the old one instead of sitting next to it.</figcaption>
</figure>
</div>

## Step 1: the memory resource

This is a one-off setup, not something your agent does on every request. Run it from a script, the console, or `agentcore add memory` in the AgentCore CLI.

```python
from bedrock_agentcore.memory import MemoryClient

client = MemoryClient(region_name="us-west-2")

memory = client.create_memory_and_wait(
    name="SupportAgentMemory",
    description="What the support agent remembers about users and fixes",
    strategies=[
        {"semanticMemoryStrategy": {
            "name": "Facts",
            "namespaces": ["/facts/{actorId}/"],
        }},
        {"userPreferenceMemoryStrategy": {
            "name": "Preferences",
            "namespaces": ["/preferences/{actorId}/"],
        }},
        {"summaryMemoryStrategy": {
            "name": "SessionSummaries",
            "namespaces": ["/summaries/{actorId}/{sessionId}/"],
        }},
        {"episodicMemoryStrategy": {
            "name": "Fixes",
            "namespaces": ["/fixes/{actorId}/"],
            "reflectionConfiguration": {"namespaces": ["/fixes/"]},
        }},
    ],
)
print(memory["id"])  # goes into the agent's environment
```

The namespaces are the design. `{actorId}` and `{sessionId}` are filled in by the service at extraction time, so facts and preferences live per user, summaries live per user *per conversation*, and episodes live per user. Reflections are the one deliberate exception. `/fixes/` sits above every user's episodes, because the point of a reflection is to learn from all of them.

Namespaces start and end with `/`. The trailing slash isn't cosmetic. Without it, `/facts/ann` is a prefix of `/facts/anne`.

## Step 2: the agent

The `bedrock-agentcore` package ships a Strands session manager that does both halves for you. It writes each message as a short-term event, and before every model call it searches long-term memory and hands the results to the model.

```python
import os
from strands import Agent, tool
from bedrock_agentcore.memory import MemoryClient
from bedrock_agentcore.memory.integrations.strands.config import (
    AgentCoreMemoryConfig,
    RetrievalConfig,
)
from bedrock_agentcore.memory.integrations.strands.session_manager import (
    AgentCoreMemorySessionManager,
)

MEMORY_ID = os.environ["SUPPORT_MEMORY_ID"]
REGION = "us-west-2"
memory_client = MemoryClient(region_name=REGION)


@tool
def recall_similar_fixes(problem: str) -> str:
    """Look up lessons learned from past support cases that resemble this problem."""
    records = memory_client.retrieve_memories(
        memory_id=MEMORY_ID,
        namespace="/fixes/",  # exact match: reflections only, not every user's episodes
        query=problem,
        top_k=3,
    )
    return "\n".join(r["content"]["text"] for r in records) or "No similar cases yet."


def handle_message(user_id: str, conversation_id: str, text: str) -> str:
    config = AgentCoreMemoryConfig(
        memory_id=MEMORY_ID,
        actor_id=user_id,               # who: from your auth layer, never from the request body
        session_id=conversation_id,     # which conversation
        retrieval_config={
            "/facts/{actorId}/":       RetrievalConfig(top_k=5, relevance_score=0.4),
            "/summaries/{actorId}/":   RetrievalConfig(top_k=2, relevance_score=0.4),
            "/preferences/{actorId}/": RetrievalConfig(top_k=3, relevance_score=0.0),
        },
    )
    with AgentCoreMemorySessionManager(agentcore_memory_config=config, region_name=REGION) as memory:
        agent = Agent(
            system_prompt=SUPPORT_PROMPT,
            tools=[read_sync_log, recall_similar_fixes],
            session_manager=memory,
        )
        return str(agent(text))
```

Three choices in there are worth slowing down for, because each is the difference between memory that helps and memory that sits there.

**The summaries key is `/summaries/{actorId}/`, not `/summaries/{actorId}/{sessionId}/`.** The strategy *writes* one summary per session. The session manager *reads* with `namespacePath`, which is hierarchical: it returns every record at or below that path. Use the full session-scoped namespace as the retrieval key, which is what the setup examples show, and on Thursday you're searching for a summary of Thursday's conversation, which doesn't exist yet. Drop the last segment and you search across all of Aoife's past conversations, which is the whole reason you wanted summaries.

**Preferences get `relevance_score=0.0`.** Retrieval is a semantic search using the user's latest message as the query. "Sync's broken again" is a good match for Monday's summary and for "office network has a TLS-intercepting proxy". It is not a good match for "prefers terminal commands", so a threshold would quietly filter out exactly the preference you need on Thursday. A user's preferences are a handful of records and are relevant to every reply, so take the top few unconditionally. (The session manager skips the score filter when the threshold is falsy, so `0.0` means "no filter".)

**Reflections are a tool, not automatic context.** The session manager only does hierarchical retrieval, and a path query on `/fixes/` would also return every user's raw episodes, Monday's chat included. Reflections live *at* `/fixes/`, so an exact `namespace=` lookup returns only them. Making that a tool also lets the model decide when a past fix is worth looking up, instead of paying for a search on every "thanks!".

## What the model actually sees on Thursday

Aoife types "Sync's broken again." Strands appends the message, which fires a `MessageAddedEvent`. The session manager's hook catches it, takes that text as the search query, and fires one `RetrieveMemoryRecords` call per namespace in parallel. It drops anything under each namespace's threshold and joins what's left into a single block. That block is inserted at the front of the message:

```text
<user_context>
Sync failed with TLS handshake errors on Monday; reinstalling did not help; fixed by trusting the office proxy's certificate.
User runs version 3.2 on macOS.
User's office network uses a proxy that intercepts TLS.
User prefers terse answers with terminal commands rather than step-by-step walkthroughs.
</user_context>
Sync's broken again.
```

So the reply can skip the interview:

> Same TLS errors as Monday? If you're on the office network, the proxy's certificate may have rotated. Check with: `openssl s_client -connect sync.example.com:443 -proxy proxy.corp:8080 | head -20`

Version, OS and network never had to be asked for, there's no walkthrough, and nobody suggests the reinstall again.

<div class="figure">
<figure>
<svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The read path on one turn. The message Sync's broken again fires a MessageAddedEvent. Three searches run in parallel against /facts/aoife/, /summaries/aoife/ and /preferences/aoife/, the first two with a relevance threshold and the preferences search with none. The results merge into a user_context block that is prepended to the newest user message. In the request, tools and the system prompt are untouched; only the final message changes.">
  <text class="f-label" x="8" y="16">The read path: before every model call</text>
  <rect x="20" y="110" width="186" height="56" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="32" y="134">Sync's broken again.</text>
  <text class="f-note" x="32" y="154">MessageAddedEvent</text>
  <path d="M206 138 L240 70" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M206 138 L240 138" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M206 138 L240 206" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <rect x="240" y="48" width="208" height="44" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="252" y="66">search /facts/aoife/</text>
  <text class="f-note" x="252" y="84">top_k 5 · score ≥ 0.4</text>
  <rect x="240" y="116" width="208" height="44" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="252" y="134">search /summaries/aoife/</text>
  <text class="f-note" x="252" y="152">top_k 2 · score ≥ 0.4</text>
  <rect x="240" y="184" width="208" height="44" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="252" y="202">search /preferences/aoife/</text>
  <text class="f-note f-warm" x="252" y="220">top_k 3 · no threshold</text>
  <text class="f-label" x="240" y="252">in parallel, query = the message</text>
  <path d="M448 70 L478 138" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M448 138 L478 138" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <path d="M448 206 L478 138" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <rect x="478" y="112" width="132" height="52" fill="none" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-node f-warm" x="490" y="134">&lt;user_context&gt;</text>
  <text class="f-note" x="490" y="154">prepended</text>
  <text class="f-label" x="640" y="58">the request</text>
  <rect x="640" y="68" width="100" height="30" fill="#b26a3c"/>
  <text class="f-note" x="650" y="87" style="fill:#0a0705">tools</text>
  <rect x="640" y="102" width="100" height="30" fill="#6b3f24"/>
  <text class="f-note" x="650" y="121">system prompt</text>
  <rect x="640" y="136" width="100" height="76" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="648" y="153">earlier turns</text>
  <rect x="648" y="164" width="84" height="40" fill="rgb(227 155 74 / 0.16)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note f-warm" x="654" y="180">context</text>
  <text class="f-note f-warm" x="654" y="196">+ question</text>
  <path d="M610 138 L624 138 L624 184 L640 184" fill="none" stroke="#e39b4a" stroke-width="1.5"/>
  <path d="M646 184 L636 179 L636 189 Z" fill="#e39b4a"/>
  <text class="f-note" x="740" y="240" text-anchor="end">tools and system prompt untouched:</text>
  <text class="f-note f-warm" x="740" y="258" text-anchor="end">the cached prefix survives</text>
</svg>
<figcaption>Every user message triggers one semantic search per configured namespace, with the message itself as the query. What clears each threshold is joined into one block and put in front of the user's text. The parts of the request you want cached never change.</figcaption>
</figure>
</div>

### Why it goes in the user message

The memory block goes into the *user* turn, not the system prompt, and that matters more than it looks. If you've read [the prompt caching post](/blog/2026-09-05-prompt-caching-in-strands/), you know a cache hit needs a byte-identical prefix: tools, then system prompt, then history. Put per-turn memories in the system prompt and the prefix changes on every call, so nothing after the tools is ever a hit. Put them in the newest user message and the tools, system prompt and earlier turns stay cacheable. The memory is the new part of the request, and the new part of the request is the only part you should be paying full price for.

The other cost is plain size. Thursday's request carries four lines of context, not Monday's forty turns. That gap grows with every conversation Aoife has, because long-term memory consolidates (a changed fact *updates* the record) while a transcript only ever gets longer.

<div class="figure">
<figure>
<svg viewBox="0 0 760 206" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two request bars for the same Thursday question, on one scale. Replaying history: tools, system prompt, forty Monday turns, then the question, filling nearly the full width. With memory: the same tools and system prompt, marked as the cached prefix, then a short user_context block and the question, about a third of the length.">
  <text class="f-label" x="8" y="16">Thursday's question, two ways</text>
  <text class="f-note" x="90" y="42">tools</text>
  <text class="f-note" x="140" y="42">system</text>
  <text class="f-note" x="196" y="42">forty Monday turns →</text>
  <text class="f-node" x="8" y="64">replay</text>
  <rect x="90" y="50" width="30" height="18" fill="#b26a3c"/>
  <rect x="122" y="50" width="70" height="18" fill="#6b3f24"/>
  <rect x="194" y="50" width="520" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75" stroke-dasharray="12 1"/>
  <rect x="716" y="50" width="20" height="18" fill="#e39b4a"/>
  <text class="f-note" x="194" y="88">re-sent on every model call, and longer after every conversation</text>
  <text class="f-node" x="8" y="134">memory</text>
  <rect x="90" y="120" width="30" height="18" fill="#b26a3c"/>
  <rect x="122" y="120" width="70" height="18" fill="#6b3f24"/>
  <rect x="194" y="120" width="44" height="18" fill="rgb(227 155 74 / 0.16)" stroke="#e39b4a" stroke-width="1"/>
  <rect x="240" y="120" width="20" height="18" fill="#e39b4a"/>
  <text class="f-note f-warm" x="270" y="134">user_context + question</text>
  <path d="M90 150 L90 156 L192 156 L192 150" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="90" y="174">cached prefix</text>
  <path d="M194 150 L194 156 L260 156 L260 150" fill="none" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note f-warm" x="194" y="174">new this turn</text>
  <text class="f-note" x="740" y="198" text-anchor="end">consolidated records stay small; transcripts only grow</text>
</svg>
<figcaption>The same question, the same tools and the same system prompt. Replaying history sends all of Monday on every call. Memory sends four lines, and they sit after the cache point rather than in front of it.</figcaption>
</figure>
</div>

## Ciarán's Thursday

Same Thursday, different user. Ciarán has never contacted support. The sync log shows TLS handshake failures.

Nothing in `/facts/ciaran/` or `/summaries/ciaran/` helps, because there's nothing there. Aoife's facts are in Aoife's own namespace and Ciarán's retrieval never touches them. But by now the episodic strategy has processed Monday's chat as a completed episode: the goal, the reinstall that failed, the log read, the certificate fix. Across that episode and others like it, it has written a reflection along the lines of:

> For sync failures that show TLS handshake errors, check for a TLS-intercepting proxy before suggesting a reinstall. Reinstalling has not resolved this class of failure.

The agent sees TLS errors, calls `recall_similar_fixes("sync failing, TLS handshake errors")`, and goes straight to the proxy. Ciarán never sits through a reinstall.

This is the part I find most useful, and it's the part that's easiest to undervalue. Facts and preferences make an agent *polite*. Episodes and reflections make it *better at the job*. The agent learns which approaches work from outcomes, without anyone retraining anything or editing the system prompt.

It's also where you need to think hardest. Reflections deliberately cross user boundaries, and AWS's docs call out the privacy implications of cross-actor analysis. If a reflection could carry something personal ("the user at Acme Corp…"), either reflect at the actor level or put a guardrail on what gets stored. Lessons should travel between users. Details about a user shouldn't.

<div class="figure">
<figure>
<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Who can see what. Two dashed boundaries, one per user. Aoife's holds /facts/aoife/, /preferences/aoife/, two session summaries and /fixes/aoife/ episodes, and is never read for Ciarán. Ciarán's holds the same four paths, all empty on first contact, and is what Ciarán's session manager reads. Below both sits one shared namespace, /fixes/, holding reflections drawn from everyone's episodes. Ciarán's agent reads it through the recall_similar_fixes tool. It is outlined in red because it crosses users.">
  <text class="f-label" x="8" y="16">Who can see what, on Ciarán's Thursday</text>
  <rect x="20" y="36" width="330" height="190" fill="none" stroke="#b26a3c" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="f-node" x="34" y="60">aoife</text>
  <text class="f-note" x="34" y="88">/facts/aoife/</text>
  <text class="f-note" x="34" y="110">/preferences/aoife/</text>
  <text class="f-note" x="34" y="132">/summaries/aoife/mon/</text>
  <text class="f-note" x="34" y="154">/summaries/aoife/thu/</text>
  <text class="f-note" x="34" y="176">/fixes/aoife/   episodes</text>
  <text class="f-label" x="34" y="212">never read for ciarán</text>
  <rect x="410" y="36" width="330" height="190" fill="none" stroke="#e39b4a" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="f-node" x="424" y="60">ciarán</text>
  <text class="f-note f-warm" x="424" y="88">/facts/ciaran/</text>
  <text class="f-note f-warm" x="424" y="110">/preferences/ciaran/</text>
  <text class="f-note f-warm" x="424" y="132">/summaries/ciaran/</text>
  <text class="f-note" x="424" y="176">/fixes/ciaran/  episodes</text>
  <text class="f-label" x="424" y="212">read by the session manager · empty</text>
  <line x1="290" y1="226" x2="290" y2="262" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 4"/>
  <line x1="470" y1="226" x2="470" y2="262" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 4"/>
  <text class="f-note" x="282" y="248" text-anchor="end">episodes feed</text>
  <rect x="230" y="262" width="300" height="50" fill="none" stroke="#d93b2b" stroke-width="1"/>
  <text class="f-node" x="244" y="284">/fixes/</text>
  <text class="f-note" x="244" y="302">reflections, from everyone's episodes</text>
  <path d="M530 287 C 600 287, 650 270, 660 236" fill="none" stroke="#e39b4a" stroke-width="1.5"/>
  <path d="M662 228 L655 239 L666 240 Z" fill="#e39b4a"/>
  <text class="f-note f-warm" x="560" y="306">recall_similar_fixes</text>
  <text class="f-note f-hot" x="380" y="334" text-anchor="middle">the one node that crosses users: keep it impersonal</text>
</svg>
<figcaption>Everything inside a dashed boundary is one user's, and the namespace string is the only thing that enforces it. The red box is the deliberate exception: lessons from Aoife's Monday reach Ciarán, and nothing else about Aoife does.</figcaption>
</figure>
</div>

## Memory is not your knowledge base

The fix for "the proxy cert rotated" lives in your product docs, not in memory. Long-term memory answers *who is this user and what happened before*. Retrieval over your documentation, a Bedrock Knowledge Base or anything else, answers *what is true right now*. AWS draws the same line in [its comparison](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory-ltm-rag.html). Put manuals in memory and they get "consolidated" by an LLM. Put user history in your RAG index and every user's chat ends up in one corpus.

## Things that will bite

**Extraction is asynchronous.** Long-term records appear some time after the events that produced them. AWS doesn't publish a number. [One measurement](https://dev.to/rajmurugan/field-notes-the-agentcore-memory-write-that-returns-success-and-stores-nothing-ng8) of a direct write saw 15–30 seconds before it became searchable, and episodes wait until AgentCore decides the episode is *finished*. Within a session that's fine, because short-term memory already has the turn. It's not fine in an integration test that writes a turn and immediately asserts on retrieval. Poll with a timeout.

**Retrieval failures are silent.** If a namespace is wrong, IAM denies the call, or the service has a bad minute, the SDK logs it and returns an empty list. The session manager catches anything else that goes wrong. Your agent carries on with no `<user_context>` and no error, and it just seems a bit dim. Alarm on the logs or on the memory metrics, because no user will ever report "it forgot me".

**The namespace string *is* your tenant boundary.** Nothing checks that `actor_id` belongs to the caller. Take it from your authenticated identity, never from the request body, and back it up with IAM: the `bedrock-agentcore:namespace` and `bedrock-agentcore:namespacePath` condition keys can pin a role to its own subtree.

**Batching needs the `with` block.** `batch_size` above 1 buffers events locally. If the session manager isn't closed, by the context manager or `close()` in a `finally`, the buffered turns never reach memory, and nothing they contained is ever extracted.

**One agent per session.** Two agents writing to the same `session_id` get a warning and a confused transcript. If you have a supervisor and sub-agents, give each its own session and share knowledge through long-term namespaces.

## Verdict

Turning on memory is the easy part, and nearly free. The design work is deciding what your agent should remember and who it should share it with, and in AgentCore that design is the namespace layout. Write it down before you write the agent: per-user facts and preferences, per-conversation summaries read across conversations, per-user episodes, and one carefully considered shared node for lessons.

Get that right and the payoff isn't that Thursday's agent remembers Aoife's version number. It's that Ciarán's agent already knows not to suggest the reinstall.
