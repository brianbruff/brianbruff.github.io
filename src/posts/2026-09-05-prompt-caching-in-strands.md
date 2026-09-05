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

That's the *input* bill for one task. The system prompt was read twelve times. The first tool result was read eleven times. Nothing about it changed between readings, and you paid every time.

Because each call re-reads everything before it, the cost of a loop grows with the *square* of its length, not linearly. Double the number of steps and you roughly quadruple the input tokens. This is why long-running agents get expensive in a way that surprises people who've only priced single-shot prompts.

## The bookmark

![A paper ticker tape running through a brass reader on a workbench; the tape before the mechanism is faded punch-marks, a red wax seal sits where it exits, and after the seal the ink is still wet](/images/cache-2-tape.jpg)

Bedrock's prompt caching lets you drop a marker — a **cache point** — into the request. Everything before the marker is hashed and stored. On the next request, if the bytes before the marker are identical, the model doesn't re-read them; it picks up from the cached state.

Three rules, and everything else follows from them:

1. **It's a prefix match.** The cache covers everything from the start of the request up to the marker. Change one byte anywhere in that stretch and everything after the change is a miss.
2. **The request is assembled in a fixed order:** tools, then system prompt, then messages. Tools come first, so changing your tool list invalidates *everything*. The system prompt comes second, so changing it invalidates the whole conversation.
3. **Reads are cheap, writes are dear.** A cache read bills at roughly a tenth of the normal input price. A cache write bills at about 1.25× — you pay a premium to store it. Two reads and you're ahead. Details on the [Bedrock pricing page](https://aws.amazon.com/bedrock/pricing/).

```
 ┌─────────┬───────────────┬──────────────────────────────┬─────────┐
 │  tools  │ system prompt │ turn 1 … turn n-1            │ turn n  │
 └─────────┴───────────────┴──────────────────────────────┴─────────┘
                                                          ▲
                                                   cache point
 ◄──────────────── read from cache (~0.1×) ───────────────┤ full price
```

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

The Python SDK's `BedrockModel` takes a `cache_config`:

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
- **Doesn't cache the tools unless you ask.** In Python, `tools_ttl` defaults to `None`, which defers to the older `cache_tools` setting. If you want the tool definitions cached (and you do — they're first in the request and never change), say so.

Which means the config I'd actually ship is:

```python
model = BedrockModel(
    model_id="global.anthropic.claude-sonnet-4-6",
    cache_config=CacheConfig(strategy="auto", tools_ttl=True),
)
```

Three cache points — tools, system, last user message — out of the four Bedrock allows. The fourth is yours for anything hand-placed.

The TypeScript SDK's `cacheConfig` caches all three by default and has `toolsTTL`, `systemPromptTTL` and `messagesTTL` to switch each one off. Same idea, one less foot-gun.

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

**1. A timestamp in the system prompt.** `f"Today is {date.today()}"` at the top of the prompt changes the first hundred bytes once a day, which invalidates the system cache and the entire conversation behind it. Worse, `datetime.now()` does it on every call. Either move the dynamic bit into the first user message, or set `system_prompt_ttl=False` and stop paying to write a cache you'll never read.

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
