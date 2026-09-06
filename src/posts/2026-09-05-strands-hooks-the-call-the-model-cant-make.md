---
title: "The Tool Call the Model Can't Make: Strands Hooks as Guardrails"
date: "2026-09-05"
category: "AI & Agents"
tags: ["aws", "strands", "ai agents", "python", "guardrails"]
description: "A system prompt is a request. A Strands hook is a rule. Where to put the checks your agent must never talk its way past, and how cancel_tool, interrupts and retry fit together."
image: "/images/hooks-1-bench.jpg"
---

![A locked brass turnstile in a tiled corridor with a paper note tucked into the mechanism](/images/hooks-1-bench.jpg)

Every agent I've shipped has had a paragraph in its system prompt that starts with "Never". Never delete without confirming. Never book more than ten guests. Never call `pay` before `verify_card` has returned. And every one of those paragraphs has been ignored at least once, usually on the demo, because a system prompt is a *request*. A polite, well-formatted, strongly-worded request that the model weighs against everything else in its context.

I wrote [last time](/blog/2026-09-05-agentcore-harness-or-write-the-loop/) that hooks were one of four reasons to write your own agent loop instead of letting AgentCore's harness run it. This is the post about why they're worth it.

## A hook is a rule, not a request

In [Strands](https://strandsagents.com/), a hook is a callback that the SDK itself invokes at a fixed point in the loop. Not the model. The SDK. The model never sees the hook, can't reason about it, and can't decide it doesn't apply this time.

The point in the loop that matters most is `BeforeToolCallEvent`. It fires after the model has decided to call a tool and before the tool runs, and it hands you the tool name, the input, and one property that does all the work:

```python
from strands import Agent
from strands.hooks import HookProvider, HookRegistry, BeforeToolCallEvent

class BookingRules(HookProvider):
    MAX_GUESTS = 10

    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeToolCallEvent, self.check)

    def check(self, event: BeforeToolCallEvent) -> None:
        if event.tool_use["name"] != "book_hotel":
            return
        guests = event.tool_use["input"].get("guests", 1)
        if guests > self.MAX_GUESTS:
            event.cancel_tool = (
                f"BLOCKED: {guests} guests exceeds the maximum of {self.MAX_GUESTS}."
            )

agent = Agent(tools=[book_hotel], hooks=[BookingRules()])
```

Set `cancel_tool` to a string and the tool never executes. The string is placed into the tool result with an error status and handed back to the model as if the tool had run and failed. Set it to `True` and you get a default message instead. Either way the model's next turn starts from "that was refused", and it has to plan around it.

That is the entire difference between the two mechanisms. A system prompt says *please don't*. A hook says *you didn't*.

![A red rubber stamp coming down on a paper form on a wooden desk](/images/hooks-2-stamp.jpg)

## Where the checks go

Once you accept that the SDK is the enforcement point, the question is which event to hang each check on. Strands gives you more than you'll need; these are the ones I actually reach for.

<div class="figure">
<figure>
<svg viewBox="0 0 760 410" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A single vertical spine running down the page representing one cycle of the agent loop. Seven points sit on it in order: BeforeModelCallEvent, which can cancel and carries projected input tokens; the model call itself; BeforeToolsEvent, which can cancel the whole batch at once; BeforeToolCallEvent, which can set cancel_tool, raise an interrupt, rewrite the input or swap the tool; the tool executing; AfterToolCallEvent, which can rewrite the result or retry; and AfterToolsEvent, which can end the turn. A dashed arrow returns from the bottom of the spine to the top, marking the next cycle. Filled markers are the points that can stop what happens next; hollow markers only shape what comes back.">
  <defs>
    <marker id="hk1-c" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#b26a3c"/></marker>
  </defs>
  <text class="f-label" x="8" y="16">Where your code runs in one cycle</text>
  <line x1="118" y1="46" x2="118" y2="348" stroke="#b26a3c" stroke-width="1"/>
  <circle cx="118" cy="64" r="5.5" fill="#e39b4a"/>
  <text class="f-node" x="140" y="69">BeforeModelCallEvent</text>
  <text class="f-note" x="370" y="68">cancel · projected_input_tokens</text>
  <rect x="96" y="95" width="190" height="34" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="191" y="117" text-anchor="middle">the model call</text>
  <circle cx="118" cy="162" r="5.5" fill="#e39b4a"/>
  <text class="f-node" x="140" y="167">BeforeToolsEvent</text>
  <text class="f-note" x="370" y="166">cancel the whole batch at once</text>
  <circle cx="118" cy="204" r="5.5" fill="#e39b4a"/>
  <text class="f-node" x="140" y="209">BeforeToolCallEvent</text>
  <text class="f-note" x="370" y="208">cancel_tool · interrupt() · rewrite input · swap the tool</text>
  <rect x="96" y="235" width="190" height="34" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="191" y="257" text-anchor="middle">the tool executes</text>
  <circle cx="118" cy="300" r="5" fill="#0a0705" stroke="#b26a3c" stroke-width="1.5"/>
  <text class="f-node" x="140" y="305">AfterToolCallEvent</text>
  <text class="f-note" x="370" y="304">rewrite the result · retry</text>
  <circle cx="118" cy="340" r="5" fill="#0a0705" stroke="#b26a3c" stroke-width="1.5"/>
  <text class="f-node" x="140" y="345">AfterToolsEvent</text>
  <text class="f-note" x="370" y="344">end_turn</text>
  <path d="M 118 348 V 366 H 58 V 64 H 108" fill="none" stroke="#b26a3c" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#hk1-c)"/>
  <text class="f-note" x="46" y="200" transform="rotate(-90 46 200)" text-anchor="middle">next cycle</text>
  <circle cx="124" cy="396" r="5.5" fill="#e39b4a"/>
  <text class="f-note" x="136" y="400">can stop what happens next</text>
  <circle cx="330" cy="396" r="5" fill="#0a0705" stroke="#b26a3c" stroke-width="1.5"/>
  <text class="f-note" x="342" y="400">shapes what comes back</text>
</svg>
<figcaption>Fixed points in the SDK's own loop, not instructions the model weighs. Filled markers can stop what happens next; hollow ones only shape what comes back. Where two hooks listen to the same event, the <em>before</em> ones run in registration order and the <em>after</em> ones in reverse — so the hook you registered first gets the last word on a result.</figcaption>
</figure>
</div>

**`BeforeToolCallEvent` — one call, one decision.** Parameter bounds, allow-lists, "this tool is read-only in this environment". You also get `event.tool_use["input"]` as a mutable dict, so a hook can *fix* arguments rather than refuse them — force `dry_run=True`, clamp a `limit`, inject the tenant ID the model isn't allowed to choose. And `event.selected_tool` is writable, which means you can swap the implementation entirely and the model is none the wiser.

**`BeforeToolsEvent` — the whole batch.** Models increasingly emit several tool calls in one turn. If the rule is "not while there's a `delete` anywhere in this batch", inspect `event.message["content"]` for every `toolUse` block and set `event.cancel` once. Cancelling per call would let the harmless ones through alongside the one you were worried about.

**`AfterToolCallEvent` — what came back.** `event.result` is writable, so you can redact a tool's output before the model reads it. `event.retry = True` re-runs the tool, which is the honest place for "the API timed out, try once more" instead of a retry loop buried inside the tool function.

**`BeforeModelCallEvent` — before you spend money.** It carries `projected_input_tokens`, and `cancel` is writable. A hook that refuses to call the model when the context is about to cross a budget is about six lines, and it beats finding out from the bill.

One rule of ordering that bit me: *before* hooks run in registration order, *after* hooks run in **reverse** registration order, for the same reason `finally` blocks unwind the way they do. If two hooks both touch the result, the one you registered first gets the last word.

## The one that asks a human

`cancel_tool` is a hard no. Sometimes what you want is "not without asking", and Strands has a proper mechanism for that rather than making you fake it with a tool that returns "please confirm".

Inside a hook, `event.interrupt(name, reason=...)` suspends the whole run. The agent returns with `stop_reason == "interrupt"` and a list of what it's waiting on. You do whatever the approval actually is — a prompt in a terminal, a Slack button, a ticket — and call the agent again with the answers:

```python
class DeleteApproval(HookProvider):
    def register_hooks(self, registry: HookRegistry) -> None:
        registry.add_callback(BeforeToolCallEvent, self.approve)

    def approve(self, event: BeforeToolCallEvent) -> None:
        if event.tool_use["name"] != "delete_files":
            return
        answer = event.interrupt(
            "ops-approval",
            reason={"paths": event.tool_use["input"]["paths"]},
        )
        if answer.lower() != "y":
            event.cancel_tool = "User denied permission to delete files"


result = agent("Clean up the build directory")

while result.stop_reason == "interrupt":
    responses = []
    for interrupt in result.interrupts:
        answer = input(f"Delete {interrupt.reason['paths']}? (y/N): ")
        responses.append({
            "interruptResponse": {"interruptId": interrupt.id, "response": answer}
        })
    result = agent(responses)
```

<div class="figure">
<figure>
<svg viewBox="0 0 760 372" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="One tool call emitted by the model, delete_files, arrives at a BeforeToolCallEvent gate, and three paths lead out of it. On the left, the hook returns and the tool runs, sending a real result to the model. In the middle, the hook sets cancel_tool, the tool never runs, and an error result goes to the model. Both of these are enclosed in a dashed box marked: the loop never stops, the model gets a tool result either way. On the right, the hook calls interrupt, the run suspends, and control returns to the caller with stop_reason equal to interrupt, leaving the loop entirely. A dashed arrow labelled agent(responses) returns from that box back to the gate, showing the hook runs again on resume.">
  <defs>
    <marker id="hk2-c" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#b26a3c"/></marker>
    <marker id="hk2-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#e39b4a"/></marker>
  </defs>
  <text class="f-label" x="8" y="16">Three things a hook can do with one tool call</text>
  <text class="f-note" x="380" y="36" text-anchor="middle">the model emits</text>
  <rect x="272" y="44" width="216" height="32" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="380" y="65" text-anchor="middle">delete_files(paths=…)</text>
  <line x1="380" y1="76" x2="380" y2="96" stroke="#b26a3c" stroke-width="1" marker-end="url(#hk2-c)"/>
  <rect x="90" y="100" width="580" height="32" fill="rgb(227 155 74 / 0.14)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-node f-warm" x="380" y="121" text-anchor="middle">BeforeToolCallEvent</text>
  <line x1="180" y1="132" x2="180" y2="156" stroke="#b26a3c" stroke-width="1" marker-end="url(#hk2-c)"/>
  <line x1="380" y1="132" x2="380" y2="156" stroke="#b26a3c" stroke-width="1" marker-end="url(#hk2-c)"/>
  <line x1="580" y1="132" x2="580" y2="156" stroke="#e39b4a" stroke-width="1" marker-end="url(#hk2-a)"/>
  <rect x="96" y="160" width="168" height="30" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="180" y="179" text-anchor="middle">the hook returns</text>
  <rect x="296" y="160" width="168" height="30" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="380" y="179" text-anchor="middle">cancel_tool = "…"</text>
  <rect x="490" y="160" width="180" height="30" fill="none" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note f-warm" x="580" y="179" text-anchor="middle">event.interrupt(…)</text>
  <line x1="180" y1="190" x2="180" y2="212" stroke="#b26a3c" stroke-width="1" marker-end="url(#hk2-c)"/>
  <line x1="380" y1="190" x2="380" y2="212" stroke="#b26a3c" stroke-width="1" marker-end="url(#hk2-c)"/>
  <line x1="580" y1="190" x2="580" y2="212" stroke="#e39b4a" stroke-width="1" marker-end="url(#hk2-a)"/>
  <rect x="96" y="216" width="168" height="32" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="180" y="237" text-anchor="middle">the tool runs</text>
  <rect x="296" y="216" width="168" height="32" fill="none" stroke="#b26a3c" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="f-note" x="380" y="237" text-anchor="middle">the tool never runs</text>
  <rect x="490" y="216" width="180" height="32" fill="#26180f" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-node f-warm" x="580" y="237" text-anchor="middle">the run suspends</text>
  <text class="f-note" x="180" y="276" text-anchor="middle">real result → the model</text>
  <text class="f-note" x="380" y="276" text-anchor="middle">error result → the model</text>
  <text class="f-note" x="580" y="276" text-anchor="middle">→ back to your caller</text>
  <rect x="88" y="300" width="384" height="48" rx="3" fill="none" stroke="#b26a3c" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="f-note" x="280" y="320" text-anchor="middle">the loop never stops —</text>
  <text class="f-note" x="280" y="336" text-anchor="middle">the model gets a tool result either way</text>
  <rect x="490" y="300" width="230" height="48" rx="3" fill="rgb(227 155 74 / 0.10)" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-note f-warm" x="605" y="320" text-anchor="middle">stop_reason == "interrupt"</text>
  <text class="f-note" x="605" y="336" text-anchor="middle">control leaves the loop</text>
  <path d="M 720 324 H 740 V 116 H 674" fill="none" stroke="#e39b4a" stroke-width="1" stroke-dasharray="4 4" marker-end="url(#hk2-a)"/>
  <text class="f-note f-warm" x="740" y="92" text-anchor="end">agent(responses)</text>
</svg>
<figcaption>Both <code>cancel_tool</code> and <code>interrupt()</code> refuse, but only one of them leaves the process. A cancelled call is finished inside the loop — the model gets an error result and replans. An interrupt suspends the whole run and hands it to your caller; resuming re-runs the hook, and the second time <code>interrupt()</code> returns the human's answer instead of suspending.</figcaption>
</figure>
</div>

The shape is worth noticing. The hook doesn't know how the human is asked. The caller doesn't know which tool triggered it. The interrupt's `name` is the only contract between them, which is exactly the seam you want when the approval UI changes and the agent shouldn't.

Compare that with AgentCore harness's inline functions, which I covered last time: same pause-and-resume idea, but there the *model* decides to call the approval tool. Here the *hook* decides, and the model doesn't get a vote. For anything where the whole point is that the model can't be trusted to ask, that distinction is the feature.

![A hand hovering over a brass counter bell on a dark desk](/images/hooks-3-bell.jpg)

## Give the hook something to check against

The examples above hard-code the rules. Real ones depend on who's asking. Strands passes anything you hand the agent as keyword arguments through to every hook as `event.invocation_state`, and it doesn't have to be JSON:

```python
def check(self, event: BeforeToolCallEvent) -> None:
    user = event.invocation_state.get("user")
    if event.tool_use["name"] == "refund" and not user.can_refund:
        event.cancel_tool = f"BLOCKED: {user.id} is not authorised to issue refunds."

result = agent("Refund order 4471", user=current_user, db=db_session)
```

That's the pattern I'd argue for: the model reasons about *what* to do, and a hook with access to the real principal decides *whether it may*. Authorisation stays in code that can be unit tested without a model in the loop, which is the only kind of authorisation I want to sign off on.

## When not to

Hooks are not free. Every `BeforeToolCallEvent` handler runs on every tool call, and a slow one — a database round-trip for a permission check, say — adds up quickly in a loop that makes forty calls. Cache what you can in the provider instance; it lives as long as the agent does.

And don't put *everything* here. If the rule is stylistic — cite sources, prefer metric, be brief — that's what the system prompt is for, and refusing tool calls over it will make the agent thrash. Hooks are for the rules where "the model usually complies" isn't an acceptable sentence in the incident report.

The "Never" paragraph is still in my system prompts. It just isn't load-bearing any more.
