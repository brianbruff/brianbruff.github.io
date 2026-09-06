---
title: "Stop Re-Reading the Book: Prompt Caching in Strands"
date: "2026-09-05"
category: "AI & Agents"
tags: ["aws", "strands", "bedrock", "ai agents", "python"]
image: "/images/cache-1-bench.jpg"
description: "Every model call in an agent loop re-sends the whole conversation. Bedrock prompt caching is a bookmark that stops you paying full price for it — here's what Strands does with one line of config, what it doesn't, and the six ways to break it silently."
---

![An enormous leather ledger open on a workshop bench, a brass bookmark clip with a small amber lamp clamped two-thirds of the way through; the pages before it dense with faded ink, the pages after it blank](/images/cache-1-bench.jpg)

Here is the thing about an agent loop that nobody says out loud: **the model has no memory.** None. Every time your [Strands](https://strandsagents.com/) agent calls Bedrock — first turn, fifteenth tool call, doesn't matter — it sends the system prompt, every tool definition, and the entire conversation so far, and the model reads all of it from the top.

It's a book that gets re-read cover to cover every time someone adds a sentence.

Prompt caching is the bookmark. This post is about how the bookmark works, what Strands does with it when you turn it on, and the handful of ways to move the bookmark without noticing and end up paying full price anyway.

## What actually gets re-sent

Take a modest agent: a 2,500-token system prompt, four tools (say 800 tokens of JSON schema), and a task that takes twelve model calls with a tool result of about 1,500 tokens each. Nothing exotic.

| Model call | Tokens the model reads |
|---|---:|
| 1 | 3,300 |
| 6 | 10,800 |
| 12 | 19,800 |
| **Total for the run** | **~139,000** |

Drawn out, it looks like this. Each row is one model call; each row is everything the model has to read before it can say a word.

<div class="figure">
<figure>
<svg viewBox="0 0 760 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Twelve horizontal bars, one per model call, each longer than the last. Every bar begins with the same tools and system prompt segments, followed by one more conversation turn than the bar above it. The twelfth bar is six times the length of the first.">
  <text class="f-label" x="8" y="16">What the model reads, call by call</text>
  <text class="f-note" x="70" y="38">tools</text>
  <text class="f-note" x="118" y="38">system</text>
  <text class="f-note" x="183" y="38">conversation so far →</text>
  <text class="f-node" x="8" y="60">call 1</text>
  <rect x="70" y="46" width="25" height="18" fill="#b26a3c"/>
  <rect x="97" y="46" width="76" height="18" fill="#6b3f24"/>
  <text class="f-note" x="181" y="60">3,300</text>
  <text class="f-node" x="8" y="86">call 2</text>
  <rect x="70" y="72" width="25" height="18" fill="#b26a3c"/>
  <rect x="97" y="72" width="76" height="18" fill="#6b3f24"/>
  <rect x="175" y="72" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <text class="f-note" x="228" y="86">4,800</text>
  <text class="f-node" x="8" y="112">call 3</text>
  <rect x="70" y="98" width="25" height="18" fill="#b26a3c"/>
  <rect x="97" y="98" width="76" height="18" fill="#6b3f24"/>
  <rect x="175" y="98" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="222" y="98" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <text class="f-note" x="275" y="112">6,300</text>
  <text class="f-node" x="8" y="138">call 4</text>
  <rect x="70" y="124" width="25" height="18" fill="#b26a3c"/>
  <rect x="97" y="124" width="76" height="18" fill="#6b3f24"/>
  <rect x="175" y="124" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="222" y="124" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="269" y="124" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <text class="f-note" x="322" y="138">7,800</text>
  <text class="f-node" x="8" y="164">call 5</text>
  <rect x="70" y="150" width="25" height="18" fill="#b26a3c"/>
  <rect x="97" y="150" width="76" height="18" fill="#6b3f24"/>
  <rect x="175" y="150" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="222" y="150" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="269" y="150" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="316" y="150" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <text class="f-note" x="369" y="164">9,300</text>
  <circle cx="82" cy="184" r="1.5" fill="rgb(240 231 218 / 0.44)"/>
  <circle cx="82" cy="190" r="1.5" fill="rgb(240 231 218 / 0.44)"/>
  <circle cx="82" cy="196" r="1.5" fill="rgb(240 231 218 / 0.44)"/>
  <text class="f-node" x="8" y="222">call 12</text>
  <rect x="70" y="208" width="25" height="18" fill="#b26a3c"/>
  <rect x="97" y="208" width="76" height="18" fill="#6b3f24"/>
  <rect x="175" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="222" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="269" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="316" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="363" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="410" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="457" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="504" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="551" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="598" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <rect x="645" y="208" width="45" height="18" fill="rgb(240 231 218 / 0.14)" stroke="#b26a3c" stroke-width="0.75"/>
  <text class="f-note" x="698" y="222">19,800</text>
  <text class="f-note f-warm" x="70" y="248">12 calls · ~139,000 input tokens · every one of them at full price</text>
</svg>
<figcaption>The two left-hand blocks are the same system prompt and tool definitions on every row. The model reads them twelve times. Each grey block is a turn that was already read on every row above it.</figcaption>
</figure>
</div>

That's the *input* bill for one task. The system prompt was read twelve times. The first tool result was read eleven times. Nothing about it changed between readings, and you paid every time.

Because each call re-reads everything before it, the cost of a loop grows with the *square* of its length, not linearly. Double the number of steps and you roughly quadruple the input tokens. This is why long-running agents get expensive in a way that surprises people who've only priced single-shot prompts.

## The bookmark

![A paper ticker tape running through a brass reader on a workbench; the tape before the mechanism is faded punch-marks, a red wax seal sits where it exits, and after the seal the ink is still wet](/images/cache-2-tape.jpg)

Bedrock's prompt caching lets you drop a marker — a **cache point** — into the request. Everything before the marker is hashed and stored. On the next request, if the bytes before the marker are identical, the model doesn't re-read them; it picks up from the cached state.

Three rules, and everything else follows from them:

1. **It's a prefix match.** The cache covers everything from the start of the request up to the marker. Change one byte anywhere in that stretch and everything after the change is a miss.
2. **The request is assembled in a fixed order:** tools, then system prompt, then messages. Tools come first, so changing your tool list invalidates *everything*. The system prompt comes second, so changing it invalidates the whole conversation.
3. **Reads are cheap, writes are dear.** A cache read bills at roughly a tenth of the normal input price. A cache write bills at about 1.25× — you pay a premium to store it. Two reads and you're ahead. Details on the [Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/).

<div class="figure">
<figure>
<svg viewBox="0 0 760 232" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two request bars stacked vertically. The upper one, request n, has segments for tools, system, and turns one to three, with a cache point marker at the end of turn three. The lower one, request n plus one, has the same segments highlighted as read from cache, then a new turn four at full price, with the cache point moved to the end of turn four. A dashed line connects the two cache point positions to show the prefix must be byte-identical up to that point.">
  <text class="f-label" x="8" y="16">A cache point, and what a hit is</text>
  <text class="f-node" x="8" y="70">request n</text>
  <rect x="96" y="52" width="44" height="28" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="118" y="70" text-anchor="middle">tools</text>
  <rect x="140" y="52" width="112" height="28" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="196" y="70" text-anchor="middle">system prompt</text>
  <rect x="252" y="52" width="84" height="28" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="294" y="70" text-anchor="middle">turn 1</text>
  <rect x="336" y="52" width="84" height="28" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="378" y="70" text-anchor="middle">turn 2</text>
  <rect x="420" y="52" width="84" height="28" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="462" y="70" text-anchor="middle">turn 3</text>
  <line x1="504" y1="36" x2="504" y2="52" stroke="#e39b4a" stroke-width="1.5"/>
  <circle cx="504" cy="52" r="5" fill="#e39b4a"/>
  <text class="f-label f-warm" x="504" y="32" text-anchor="middle">cache point</text>
  <line x1="504" y1="58" x2="504" y2="134" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 5"/>
  <text class="f-note" x="512" y="92">bytes identical up to here</text>
  <text class="f-node" x="8" y="158">request n+1</text>
  <rect x="96" y="140" width="408" height="28" fill="rgb(227 155 74 / 0.18)" stroke="#e39b4a" stroke-width="1"/>
  <line x1="140" y1="140" x2="140" y2="168" stroke="#e39b4a" stroke-width="0.75" stroke-opacity="0.5"/>
  <line x1="252" y1="140" x2="252" y2="168" stroke="#e39b4a" stroke-width="0.75" stroke-opacity="0.5"/>
  <line x1="336" y1="140" x2="336" y2="168" stroke="#e39b4a" stroke-width="0.75" stroke-opacity="0.5"/>
  <line x1="420" y1="140" x2="420" y2="168" stroke="#e39b4a" stroke-width="0.75" stroke-opacity="0.5"/>
  <text class="f-note" x="118" y="158" text-anchor="middle">tools</text>
  <text class="f-note" x="196" y="158" text-anchor="middle">system prompt</text>
  <text class="f-note" x="294" y="158" text-anchor="middle">turn 1</text>
  <text class="f-note" x="378" y="158" text-anchor="middle">turn 2</text>
  <text class="f-note" x="462" y="158" text-anchor="middle">turn 3</text>
  <rect x="504" y="140" width="84" height="28" fill="none" stroke="rgb(240 231 218 / 0.64)" stroke-width="1"/>
  <text class="f-note" x="546" y="158" text-anchor="middle">turn 4</text>
  <line x1="588" y1="124" x2="588" y2="140" stroke="#e39b4a" stroke-width="1.5"/>
  <circle cx="588" cy="140" r="5" fill="#e39b4a"/>
  <text class="f-label f-warm" x="588" y="120" text-anchor="middle">point moves on</text>
  <line x1="96" y1="184" x2="504" y2="184" stroke="#e39b4a" stroke-width="1"/>
  <line x1="96" y1="180" x2="96" y2="188" stroke="#e39b4a" stroke-width="1"/>
  <line x1="504" y1="180" x2="504" y2="188" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note f-warm" x="300" y="204" text-anchor="middle">read from cache · ~0.1× the input price</text>
  <line x1="508" y1="184" x2="588" y2="184" stroke="rgb(240 231 218 / 0.64)" stroke-width="1"/>
  <line x1="588" y1="180" x2="588" y2="188" stroke="rgb(240 231 218 / 0.64)" stroke-width="1"/>
  <text class="f-note" x="548" y="204" text-anchor="middle">new · full price</text>
  <text class="f-note" x="752" y="226" text-anchor="end">then written to cache at ~1.25× for next time</text>
</svg>
<figcaption>Request n+1 begins with exactly the bytes request n ended with, so everything up to the old cache point is a hit. Only turn 4 is read at full price, and the point advances to cover it for request n+2.</figcaption>
</figure>
</div>

Re-run our twelve-call agent with a cache point riding along at the end of the conversation and the arithmetic changes shape. Each call now *reads* everything up to the previous marker and *writes* only the new tool result and the model's last reply.

| | Without caching | With caching |
|---|---:|---:|
| Tokens read at full price | ~139,000 | ~0 |
| Tokens read from cache (0.1×) | — | ~119,000 |
| Tokens written to cache (1.25×) | — | ~20,000 |
| **Effective input cost** | **~139,000** | **~37,000** |

About a quarter of the bill, for the same twelve calls and the same answers. Longer loops save more, because the square term is the thing you've removed.

Latency drops too. A cache hit skips the prefill for the cached portion, and on a long conversation that is most of the time-to-first-token.

## What Strands does with one line

`BedrockModel` takes a `cache_config`:

```python
from strands import Agent
from strands.models import BedrockModel, CacheConfig

model = BedrockModel(
    model_id="global.anthropic.claude-sonnet-4-6",
    cache_config=CacheConfig(strategy="auto"),
)

agent = Agent(model=model, system_prompt=SYSTEM_PROMPT, tools=[search, read_file])
```

With `strategy="auto"`, Strands looks at the model ID, sees `anthropic` or `claude` in it, and on every request:

- **Appends a cache point to the end of the system prompt.** Static system prompts are cached on the very first call and read back on every call after it — including by *other agents* that share the same prompt, since the cache is scoped to your account, not your process.
- **Puts exactly one cache point at the end of the last user message.** This is the moving bookmark. Each turn it advances to cover everything said so far, and Bedrock looks back roughly twenty content blocks from the new marker to find the previous one, so the accumulated conversation is a hit.
- **Removes stale cache points from earlier messages** so they don't pile up one per turn and blow the four-point limit.
- **Doesn't cache the tools unless you ask.** `tools_ttl` defaults to `None`, which defers to the older `cache_tools` setting. If you want the tool definitions cached (and you do — they're first in the request and never change), say so.

Which means the config I'd actually ship is:

```python
model = BedrockModel(
    model_id="global.anthropic.claude-sonnet-4-6",
    cache_config=CacheConfig(strategy="auto", tools_ttl=True),
)
```

Three cache points — tools, system, last user message — out of the four Bedrock allows. The fourth is yours for anything hand-placed.

Here is what that looks like across three calls of a single tool loop. Remember that in the Bedrock Converse API a tool result travels in a *user-role* message, so "the last user message" advances on every step of the loop, not just when a human types.

<div class="figure">
<figure>
<svg viewBox="0 0 760 292" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three request bars for calls one, two and three of an agent loop. Call one is entirely written to cache, with cache points after tools, after the system prompt, and after the user question. Call two reads everything up to the user question from cache and writes only the new assistant tool call and tool result; the point on the user question is shown removed and a new one placed after the tool result. Call three reads further and again writes only the latest two blocks.">
  <text class="f-label" x="8" y="16">Strands auto mode: the bookmark moves every call</text>
  <text class="f-node" x="8" y="64">call 1</text>
  <rect x="96" y="48" width="40" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="116" y="64" text-anchor="middle">tools</text>
  <rect x="136" y="48" width="100" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="186" y="64" text-anchor="middle">system</text>
  <rect x="236" y="48" width="64" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="268" y="64" text-anchor="middle">user</text>
  <circle cx="136" cy="48" r="4.5" fill="#e39b4a"/>
  <circle cx="236" cy="48" r="4.5" fill="#e39b4a"/>
  <circle cx="300" cy="48" r="4.5" fill="#e39b4a"/>
  <text class="f-note f-warm" x="316" y="64">first call: nothing to read, everything written</text>
  <text class="f-node" x="8" y="134">call 2</text>
  <rect x="96" y="118" width="204" height="24" fill="rgb(178 106 60 / 0.28)" stroke="#b26a3c" stroke-width="1"/>
  <line x1="136" y1="118" x2="136" y2="142" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="236" y1="118" x2="236" y2="142" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <text class="f-note" x="116" y="134" text-anchor="middle">tools</text>
  <text class="f-note" x="186" y="134" text-anchor="middle">system</text>
  <text class="f-note" x="268" y="134" text-anchor="middle">user</text>
  <rect x="300" y="118" width="56" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="328" y="134" text-anchor="middle">asst</text>
  <rect x="356" y="118" width="64" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="388" y="134" text-anchor="middle">result</text>
  <circle cx="136" cy="118" r="4.5" fill="#e39b4a"/>
  <circle cx="236" cy="118" r="4.5" fill="#e39b4a"/>
  <circle cx="300" cy="118" r="4.5" fill="none" stroke="rgb(240 231 218 / 0.44)" stroke-width="1" stroke-dasharray="2 2"/>
  <circle cx="420" cy="118" r="4.5" fill="#e39b4a"/>
  <text class="f-note" x="436" y="134">reads the prefix, writes two blocks</text>
  <text class="f-node" x="8" y="204">call 3</text>
  <rect x="96" y="188" width="324" height="24" fill="rgb(178 106 60 / 0.28)" stroke="#b26a3c" stroke-width="1"/>
  <line x1="136" y1="188" x2="136" y2="212" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="236" y1="188" x2="236" y2="212" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="300" y1="188" x2="300" y2="212" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="356" y1="188" x2="356" y2="212" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <text class="f-note" x="116" y="204" text-anchor="middle">tools</text>
  <text class="f-note" x="186" y="204" text-anchor="middle">system</text>
  <text class="f-note" x="268" y="204" text-anchor="middle">user</text>
  <text class="f-note" x="328" y="204" text-anchor="middle">asst</text>
  <text class="f-note" x="388" y="204" text-anchor="middle">result</text>
  <rect x="420" y="188" width="56" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="448" y="204" text-anchor="middle">asst</text>
  <rect x="476" y="188" width="64" height="24" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="508" y="204" text-anchor="middle">result</text>
  <circle cx="136" cy="188" r="4.5" fill="#e39b4a"/>
  <circle cx="236" cy="188" r="4.5" fill="#e39b4a"/>
  <circle cx="420" cy="188" r="4.5" fill="none" stroke="rgb(240 231 218 / 0.44)" stroke-width="1" stroke-dasharray="2 2"/>
  <circle cx="540" cy="188" r="4.5" fill="#e39b4a"/>
  <text class="f-note" x="556" y="204">reads grow, writes stay small</text>
  <rect x="96" y="248" width="14" height="10" fill="rgb(178 106 60 / 0.28)" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="116" y="257">read from cache · 0.1×</text>
  <rect x="276" y="248" width="14" height="10" fill="rgb(227 155 74 / 0.28)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note" x="296" y="257">written this call · 1.25×</text>
  <circle cx="480" cy="253" r="4.5" fill="#e39b4a"/>
  <text class="f-note" x="490" y="257">cache point</text>
  <circle cx="584" cy="253" r="4.5" fill="none" stroke="rgb(240 231 218 / 0.44)" stroke-width="1" stroke-dasharray="2 2"/>
  <text class="f-note" x="594" y="257">point Strands removed</text>
  <text class="f-note" x="96" y="284">the points on tools and system never move; only the third one walks forward</text>
</svg>
<figcaption>Bedrock only bills a write for the bytes past the furthest hit, so a healthy loop reads almost everything and writes almost nothing. The dashed circles are the previous turn's point, which Strands strips so the four-point limit is never hit.</figcaption>
</figure>
</div>

## Reading the meters

Bedrock reports what the cache did on every response, and Strands accumulates it onto the result:

```python
result = agent("Find every place we call the legacy billing API and list the callers.")

usage = result.metrics.accumulated_usage
print(usage.get("inputTokens"))            # uncached tokens, full price
print(usage.get("cacheReadInputTokens"))   # served from cache
print(usage.get("cacheWriteInputTokens"))  # written to cache this run
```

Two things to know about those numbers.

**`inputTokens` is only the uncached remainder.** When caching is on, the total prompt size is `inputTokens + cacheReadInputTokens + cacheWriteInputTokens`. If your agent ran for half an hour and `inputTokens` says 4,000, that isn't a bug — the rest was served from cache.

**The healthy signature of a loop is reads that grow and writes that stay small.** Each call should read everything accumulated so far and write only what the last turn added. If instead `cacheWriteInputTokens` is roughly the size of the whole conversation on *every* call, the prefix is being rewritten under you, and you are paying the 1.25× write premium every turn for a cache nothing ever reads. That's worse than not caching at all.

The same counters land in OpenTelemetry traces if you have telemetry on, which is where I'd actually watch them. A one-off print at setup time proves it worked once. A dashboard proves it's still working after the refactor.

## Six ways to move the bookmark without noticing

![Six near-identical handwritten pages fanned across a bench, a magnifying glass over one corner revealing a fresh red stamp that differs from its neighbour, brass bookmark clips lying loose and useless around them](/images/cache-4-stamp.jpg)

Every one of these fails *silently*. Requests succeed, answers are fine, the bill is just higher. Check the meters after each of them.

**1. A timestamp in the system prompt.** `f"Today is {date.today()}"` at the top of the prompt changes the first hundred bytes once a day, which invalidates the system cache and the entire conversation behind it. Worse, `datetime.now()` does it on every call. Either move the dynamic bit to the tail of the request, after the bookmark, or set `system_prompt_ttl=False` and stop paying to write a cache you'll never read.

<div class="figure">
<figure>
<svg viewBox="0 0 760 236" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two request bars. In the upper one the date is inside the system prompt: tools hit the cache, but the system prompt segment is marked changed and every turn after it is a miss, so the whole conversation is rewritten. In the lower one the date sits in a final block after a hand-placed cache point: tools, system and all turns hit, and only the small date block is read at full price.">
  <text class="f-label" x="8" y="16">One changed byte, and everything after it misses</text>
  <text class="f-node" x="8" y="56">date in the</text>
  <text class="f-node" x="8" y="72">system prompt</text>
  <rect x="120" y="48" width="44" height="26" fill="rgb(178 106 60 / 0.28)" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="142" y="65" text-anchor="middle">hit</text>
  <rect x="164" y="48" width="112" height="26" fill="rgb(217 59 43 / 0.30)" stroke="#d93b2b" stroke-width="1"/>
  <text class="f-note f-hot" x="220" y="65" text-anchor="middle">changed</text>
  <rect x="276" y="48" width="84" height="26" fill="rgb(217 59 43 / 0.10)" stroke="#d93b2b" stroke-width="1" stroke-dasharray="3 3"/>
  <text class="f-note f-hot" x="318" y="65" text-anchor="middle">miss</text>
  <rect x="360" y="48" width="84" height="26" fill="rgb(217 59 43 / 0.10)" stroke="#d93b2b" stroke-width="1" stroke-dasharray="3 3"/>
  <text class="f-note f-hot" x="402" y="65" text-anchor="middle">miss</text>
  <rect x="444" y="48" width="84" height="26" fill="rgb(217 59 43 / 0.10)" stroke="#d93b2b" stroke-width="1" stroke-dasharray="3 3"/>
  <text class="f-note f-hot" x="486" y="65" text-anchor="middle">miss</text>
  <text class="f-note f-hot" x="544" y="65">rewritten at 1.25×, every call</text>
  <text class="f-note" x="120" y="96">tools</text>
  <text class="f-note" x="164" y="96">system prompt</text>
  <text class="f-note" x="276" y="96">turn 1</text>
  <text class="f-note" x="360" y="96">turn 2</text>
  <text class="f-note" x="444" y="96">turn 3</text>
  <text class="f-node" x="8" y="156">date after the</text>
  <text class="f-node" x="8" y="172">bookmark</text>
  <rect x="120" y="148" width="408" height="26" fill="rgb(178 106 60 / 0.28)" stroke="#b26a3c" stroke-width="1"/>
  <line x1="164" y1="148" x2="164" y2="174" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="276" y1="148" x2="276" y2="174" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="360" y1="148" x2="360" y2="174" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <line x1="444" y1="148" x2="444" y2="174" stroke="#b26a3c" stroke-width="0.75" stroke-opacity="0.6"/>
  <text class="f-note" x="142" y="165" text-anchor="middle">hit</text>
  <text class="f-note" x="220" y="165" text-anchor="middle">hit</text>
  <text class="f-note" x="318" y="165" text-anchor="middle">hit</text>
  <text class="f-note" x="402" y="165" text-anchor="middle">hit</text>
  <text class="f-note" x="486" y="165" text-anchor="middle">hit</text>
  <line x1="528" y1="132" x2="528" y2="148" stroke="#e39b4a" stroke-width="1.5"/>
  <circle cx="528" cy="148" r="5" fill="#e39b4a"/>
  <text class="f-label f-warm" x="528" y="128" text-anchor="middle">your cache point</text>
  <rect x="528" y="148" width="72" height="26" fill="none" stroke="rgb(240 231 218 / 0.64)" stroke-width="1"/>
  <text class="f-note" x="564" y="165" text-anchor="middle">date</text>
  <text class="f-note f-warm" x="612" y="165">nothing invalidated</text>
  <text class="f-note" x="120" y="196">tools</text>
  <text class="f-note" x="164" y="196">system prompt</text>
  <text class="f-note" x="276" y="196">turn 1</text>
  <text class="f-note" x="360" y="196">turn 2</text>
  <text class="f-note" x="444" y="196">turn 3</text>
  <text class="f-note" x="528" y="196">full price, tiny</text>
  <text class="f-note" x="120" y="226">the further right the volatile byte sits, the less it costs you</text>
</svg>
<figcaption>Same conversation, same date. Placed in the system prompt it forces a full rewrite of everything behind it on every call. Placed after the last cache point it costs a few dozen tokens at full price and touches nothing else.</figcaption>
</figure>
</div>

**2. A tool list that varies.** Tools render first in the request. If different users get different tools, or you add a tool mid-conversation, or your tools come out of a `set` and serialise in a different order — nothing is ever a hit. Give every agent the same tools in the same order, and if you need "modes", express them in the prompt rather than the tool list.

**3. A conversation manager that trims the front.** The default `SlidingWindowConversationManager` keeps the last forty messages. The moment it evicts the oldest one, every message shifts and the prefix is different from the first turn onward — a full cache rewrite, and another one every time it evicts again. The `SummarizingConversationManager` does the same thing by construction; the summary replaces messages that used to be there. If you need context management on a long loop, expect a cache miss each time it fires, and tune the window so it fires rarely rather than every turn. `pin_first` keeps the opening messages fixed, which at least protects the top of the prefix.

**4. Prompts under the minimum.** Bedrock won't create a cache point unless the cumulative tokens before it clear a per-model floor, and it doesn't error when they don't — it just quietly doesn't cache. The floor moves a lot between models:

| Model | Minimum tokens per cache point |
|---|---:|
| Claude Opus 5, Claude Fable 5 / 5.1 | 512 |
| Claude Sonnet 5, Sonnet 4.6, Opus 4.8 | 1,024 |
| Claude Haiku 4.5, Opus 4.6, Opus 4.7 | 4,096 |

A 3,000-token system prompt caches fine on Sonnet and not at all on Haiku 4.5. The minimum is measured across tools, system and messages *combined*, so a short system prompt can still cache once the conversation grows past the line — but your first few turns won't. Check the [supported models table](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html#prompt-caching-models) for whatever you're running.

**5. An ARN for a model ID.** Auto-detection works by looking for `claude` or `anthropic` in the model ID string. Cross-region profiles like `global.anthropic.claude-sonnet-4-6` pass. An application inference profile ARN — `arn:aws:bedrock:...:application-inference-profile/abc123` — does not, so Strands logs a warning and caches nothing. Use `CacheConfig(strategy="anthropic")` to skip detection and cache anyway.

**6. Dynamic content in the last user message.** The automatic point goes at the *end* of the last user message. If you append retrieved documents or a "current time" block to every message, the marker lands after them and each request writes a fresh entry that the next request can't match. Put your own cache point ahead of the volatile part and Strands will honour it there instead of adding its own:

```python
agent(
    [
        {"text": STABLE_CONTEXT},
        {"cachePoint": {"type": "default"}},   # bookmark goes here …
        {"text": f"Retrieved at {now}: {fresh_results}"},  # … not after this
    ]
)
```

## TTL: five minutes or an hour

![A small brass sand timer nearly run through in the foreground, a taller hourglass behind it, and a closed ledger with a glowing brass bookmark clip beside them](/images/cache-3-timer.jpg)

A cache entry lives for five minutes by default, and every hit resets the clock. If your agent's turns land less than five minutes apart — and in a tool loop they land seconds apart — the default is all you need and it costs nothing extra to keep warm.

The one-hour option exists for gaps: a human who replies after twenty minutes, a side-agent that goes away and does something slow. It doubles the write price, so it wants at least three reads to pay for itself. Set it once on the config and it applies to every auto-injected point:

```python
CacheConfig(strategy="auto", tools_ttl=True, ttl="1h")
```

One rule Bedrock enforces hard: TTLs must be non-increasing through the request. Tools can be an hour and messages five minutes; not the other way round. Set them per section with `tools_ttl="1h"`, `system_prompt_ttl="1h"` and the top-level `ttl` for the rest, or you'll get a validation error rather than a cache.

A bonus that's easy to miss: on Bedrock, **cache reads don't count against your token rate limit**. An agent that's caching well doesn't just cost less — it gets throttled less.

## How I'd set it up

- Turn it on. `CacheConfig(strategy="auto", tools_ttl=True)` on every `BedrockModel` running Claude. There is no agent loop for which this is the wrong default.
- Freeze the system prompt. No dates, no user names, no feature flags. Anything that varies goes in the first user message, after the bookmark.
- Log `cacheReadInputTokens` and `cacheWriteInputTokens` from day one, and put an assertion in an integration test that the second identical call reads more than zero. Caching regresses quietly; the meters are the only evidence you'll get.
- If you're using a conversation manager on a long loop, know that every eviction is a full rewrite, and size the window accordingly.
- Don't reach for the one-hour TTL unless you've measured gaps longer than five minutes. It's a doubling of the write cost for a problem most loops don't have.

None of this is clever. It's a bookmark. But an agent that re-reads the book every turn will spend most of its budget on chapters it has already read, and the fix is a single argument you can add this afternoon.
