---
title: "Read the Release Notes Before You Bump the Model"
date: "2026-10-09"
category: "AI & Agents"
tags: ["claude", "anthropic", "ai agents", "tool use", "migration"]
image: "/images/release-notes-1-reading.jpg"
description: "Opus 5 to Opus 5.5 looks like a minor version, and semver taught us minor versions are safe. Model names are not semver: this one removed forced tool use and froze the tools array mid-conversation. Here is what breaks if you skip the release notes, and how to finish a conversation deterministically without either."
---

![An engineer highlighting a printed set of release notes, with a laptop beside them showing a failed run in red](/images/release-notes-1-reading.jpg)

Here is a pull request that every team running Claude will be tempted to approve:

```diff
- MODEL = "claude-opus-5"
+ MODEL = "claude-opus-5-5"
```

It's one line. The new model is cheaper ($4/$20 per million tokens instead of $5/$25), and it's newer. The version only went up by half, so it reads like a minor upgrade. Who would block that?

Suppose your agent finishes deterministically. When the work is done, it takes every tool away except `submit_result` and forces the model to call it. You get one well-formed exit, with no chatty final message and nothing to parse. This is what happens if the PR merges and nobody reads the release notes:

- **The first request that reaches the exit fails.** Opus 5.5 rejects forced tool choice with a 400. Every run that used to finish now crashes at the last step, after paying for all the work before it.
- **The obvious fix fails too, but only for some accounts.** You stop forcing the call and trim the tools array down to `submit_result` instead. That works in a test organisation created before 31 August 2026. On a newer account, the same request is a 400. On the older one it still costs you, because every exit now misses the prompt cache.
- **Two changes never raise an error at all.** Requests that don't set `effort` now think less, because the default dropped from `high` to `medium`. Any UI that streams the model's narration between tool calls goes quiet. Your users notice before your monitoring does.

Every one of these is in the [Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide). Ten minutes of reading turns a production incident into a checklist.

## 5.5 is not a minor version

Most developers learnt to read version numbers from semantic versioning, and semver says a change in the second number is safe. `5.0.0` to `5.5.0` means new features and no breakage. Only `6.0.0` is allowed to break you. With that instinct, "Opus 5 to Opus 5.5" looks like `npm update`, not a migration.

Model names aren't semver. `claude-opus-5-5` has two numbers and no third. There will never be a `5.5.1` that fixes a regression and leaves everything else alone. The name identifies a generation of the model, and says nothing about compatibility. Judged by semver's own rule, this release is a `6.0.0`: four request shapes that Opus 5 accepted now return a 400.

The version numbers that do follow the rules don't move either. Your SDK version stays the same. The `anthropic-version: 2023-06-01` header you send on every request stays the same, because the API contract didn't change. The model behind it did. Which requests are accepted, what the defaults are, where the text comes back: all of that now belongs to the model ID, and the model ID has no compatibility promise attached.

So treat every model change as a major version, however small the number looks. The model is the largest dependency in an LLM application, and the only one you can't pin to a behaviour, just to a name.

Here is what changed between Opus 5 and Opus 5.5, checked against the migration guide on the day I wrote this:

<div class="figure">
<figure>
<svg viewBox="0 0 760 332" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A comparison of the same request against Claude Opus 5 and Claude Opus 5.5. Four settings that Opus 5 accepts now return a 400 error on Opus 5.5: forced tool choice, disabled thinking, the older computer use tool, and an edited tools array replayed with thinking blocks. Two further changes return 200 but behave differently: omitted effort now runs at medium instead of high, and text between tool calls now arrives in thinking blocks that are empty by default.">
  <text class="f-label" x="8" y="18">Same request, two models</text>
  <text class="f-label" x="370" y="18">claude-opus-5</text>
  <text class="f-label" x="560" y="18">claude-opus-5-5</text>
  <line x1="8" y1="30" x2="752" y2="30" stroke="rgb(240 231 218 / 0.14)"/>
  <text class="f-note f-hot" x="8" y="52">Fails loudly · 400 before any output</text>
  <text class="f-node" x="8" y="80">tool_choice: any / tool</text>
  <text class="f-node" x="370" y="80">accepted</text>
  <text class="f-node f-hot" x="560" y="80">400</text>
  <text class="f-node" x="8" y="108">thinking: disabled</text>
  <text class="f-node" x="370" y="108">accepted ≤ high</text>
  <text class="f-node f-hot" x="560" y="108">400 at every effort</text>
  <text class="f-node" x="8" y="136">computer_20251124 (API, Google)</text>
  <text class="f-node" x="370" y="136">accepted</text>
  <text class="f-node f-hot" x="560" y="136">400 · use the toolset</text>
  <text class="f-node" x="8" y="164">tools[] edited mid-conversation</text>
  <text class="f-node" x="370" y="164">cache rebuilt</text>
  <text class="f-node f-hot" x="560" y="164">400 on replay *</text>
  <line x1="8" y1="184" x2="752" y2="184" stroke="rgb(240 231 218 / 0.14)"/>
  <text class="f-note f-warm" x="8" y="206">Fails quietly · 200 OK, different behaviour</text>
  <text class="f-node" x="8" y="234">effort omitted</text>
  <text class="f-node" x="370" y="234">runs at high</text>
  <text class="f-node f-warm" x="560" y="234">runs at medium</text>
  <text class="f-node" x="8" y="262">text between tool calls</text>
  <text class="f-node" x="370" y="262">text block</text>
  <text class="f-node f-warm" x="560" y="262">empty thinking block</text>
  <line x1="8" y1="282" x2="752" y2="282" stroke="rgb(240 231 218 / 0.14)"/>
  <text class="f-note" x="8" y="304">* enforced by default for accounts created on or after 31 Aug 2026 (UTC).</text>
  <text class="f-note" x="8" y="322">  Older accounts are not rejected, but still lose the prompt cache.</text>
</svg>
<figcaption>The four rows at the top fail on the first request, so you find them in testing. The two at the bottom pass every request and change what your users see.</figcaption>
</figure>
</div>

The 400s are the easy part, because the first test run finds them. The quiet ones are worse. If your request omits `effort`, Opus 5.5 does less thinking than Opus 5 did. If your UI streams the model's narration between tool calls, it goes silent, because that text now arrives in `thinking` blocks whose text is empty unless you ask for it. Neither change raises an error. You only find them by reading the notes or by hearing from your users.

## The pattern that breaks: forcing the exit

This is the exit from the scenario above. It removes every tool except one, then forces the model to call that one:

```python
final = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    tools=[SUBMIT_RESULT],                                    # everything else removed
    tool_choice={"type": "tool", "name": "submit_result"},   # and this one forced
    messages=history,
)
```

On Opus 5.5 that fails twice.

**Forced tool choice is gone.** `tool_choice` of `{"type": "any"}` or `{"type": "tool", "name": ...}` returns:

```text
tool_choice: type "tool" and "any" are not supported for this model.
```

The same applies on the Batches API and the token-counting endpoint. Only `auto` and `none` remain. `disable_parallel_tool_use` still works, but it now means *at most* one call. Combined with forced choice, it used to mean *exactly* one.

**The tools array is frozen for the rest of the conversation.** Opus 5.5 always thinks; thinking can no longer be turned off. Each thinking block carries a signature that binds it to the prefix that produced it: the `system` prompt, the set of `tools` and every message before the block. When you replay the conversation, the API checks that prefix. Add, remove, rename or edit a tool and every earlier thinking block is bound to a conversation that no longer exists. For accounts created on or after 31 August 2026, that is a 400:

```text
messages.1.content.0: Invalid `signature` in `thinking` block. The block is bound to a different conversation. ...
```

Older accounts aren't rejected. They still pay for it, though: changing the tools array changes the very front of the cached prefix, so every request after the edit misses the prompt cache.

You'll hear that you can no longer remove tools on Opus 5.5. That is half right. You can't remove a tool by editing the array. You can still withdraw one, as long as the conversation stays append-only.

## Getting determinism back

`auto` never guarantees a tool call, so no single setting replaces what forced tool choice gave you. You get the guarantee back by combining several steps, each covering what the previous one can't promise.

<div class="figure">
<figure>
<svg viewBox="0 0 760 414" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A five-step flow for finishing a conversation on Claude Opus 5.5. Step one withdraws every other tool with tool_removal blocks while the tools array stays unchanged. Step two names submit_result in the same system message, with strict tool use keeping its arguments valid. Step three checks whether the response called submit_result; if yes, the conversation is done. If no, step four appends a reminder and retries, at most twice, looping back to the check. If it still fails, step five makes a fresh request with structured outputs and no tools, which always returns schema-valid JSON.">
  <rect x="150" y="12" width="420" height="52" fill="#26180f" stroke="#b26a3c"/>
  <text class="f-node" x="166" y="34">1  Withdraw every other tool</text>
  <text class="f-note" x="166" y="53">tool_removal blocks · tools[] byte-identical</text>
  <line x1="360" y1="64" x2="360" y2="86" stroke="#b26a3c" stroke-width="1.5"/>
  <path d="M355 80 L360 88 L365 80 Z" fill="#b26a3c"/>
  <rect x="150" y="88" width="420" height="52" fill="#26180f" stroke="#b26a3c"/>
  <text class="f-node" x="166" y="110">2  Name the tool in the same message</text>
  <text class="f-note" x="166" y="129">strict: true · tool_choice stays auto</text>
  <line x1="360" y1="140" x2="360" y2="162" stroke="#b26a3c" stroke-width="1.5"/>
  <path d="M355 156 L360 164 L365 156 Z" fill="#b26a3c"/>
  <rect x="150" y="164" width="420" height="52" fill="#26180f" stroke="#e39b4a"/>
  <text class="f-node" x="166" y="186">3  Did it call submit_result?</text>
  <text class="f-note" x="166" y="205">check the content blocks, not the stop reason</text>
  <line x1="570" y1="190" x2="628" y2="190" stroke="#e39b4a" stroke-width="1.5"/>
  <path d="M622 185 L630 190 L622 195 Z" fill="#e39b4a"/>
  <text class="f-note f-warm" x="584" y="182">yes</text>
  <rect x="630" y="168" width="122" height="44" fill="rgb(227 155 74 / 0.16)" stroke="#e39b4a"/>
  <text class="f-node f-warm" x="648" y="195">done</text>
  <line x1="360" y1="216" x2="360" y2="250" stroke="#b26a3c" stroke-width="1.5"/>
  <path d="M355 244 L360 252 L365 244 Z" fill="#b26a3c"/>
  <text class="f-note" x="370" y="238">no</text>
  <rect x="150" y="252" width="420" height="52" fill="#26180f" stroke="#b26a3c"/>
  <text class="f-node" x="166" y="274">4  Remind and retry</text>
  <text class="f-note" x="166" y="293">append a user turn · keep earlier copies</text>
  <path d="M150 278 L110 278 L110 190 L144 190" fill="none" stroke="#b26a3c" stroke-width="1.5" stroke-dasharray="4 3"/>
  <path d="M142 185 L150 190 L142 195 Z" fill="#b26a3c"/>
  <text class="f-note" x="40" y="238">max 2</text>
  <line x1="360" y1="304" x2="360" y2="338" stroke="#d93b2b" stroke-width="1.5"/>
  <path d="M355 332 L360 340 L365 332 Z" fill="#d93b2b"/>
  <text class="f-note f-hot" x="370" y="326">still no</text>
  <rect x="150" y="340" width="420" height="52" fill="#26180f" stroke="#d93b2b"/>
  <text class="f-node" x="166" y="362">5  Fresh call, structured outputs</text>
  <text class="f-note" x="166" y="381">output_config.format · no tools · always parses</text>
  <line x1="570" y1="366" x2="690" y2="366" stroke="#e39b4a" stroke-width="1.5"/>
  <line x1="690" y1="366" x2="690" y2="218" stroke="#e39b4a" stroke-width="1.5"/>
  <path d="M685 224 L690 214 L695 224 Z" fill="#e39b4a"/>
</svg>
<figcaption>Steps 1 and 2 make the call very likely. Step 3 checks that it happened. Step 4 handles the occasional miss, and step 5 guarantees an exit if everything else fails.</figcaption>
</figure>
</div>

### First: did you need a tool at all?

Many forced tool calls existed only to get JSON back. If nothing runs when `submit_result` is "called", and you just read its input, you don't need a tool. Use [structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs). The response is constrained to your schema, so it always parses:

```python
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=16000,
    output_config={
        "effort": "medium",
        "format": {"type": "json_schema", "schema": RESULT_SCHEMA},
    },
    messages=history,
)
```

That is the easy case. If the tool is your agent's exit, and the model still has other tools available mid-loop, you need the next steps.

### Step 1 and 2: withdraw the other tools, and say which one you want

Opus 5.5 supports [mid-conversation tool changes](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages#mid-conversation-tool-changes). Instead of editing `tools`, you append a `role: "system"` message carrying `tool_removal` blocks. The array is still sent exactly as it was on the first request, so the prefix is intact, the thinking blocks stay valid and the cache still hits. The model just can't see the withdrawn tools from that point on.

Put the instruction in the same message. A system message has operator authority, which a user turn doesn't, and it sits exactly where the decision is made:

```python
FINISH = "submit_result"

def withdraw_all_but_finish(history, tools):
    # Must come straight after a user turn (a tool_result turn counts)
    # and be the last message before Claude's next turn.
    removals = [
        {"type": "tool_removal", "tool": {"type": "tool_reference", "name": t["name"]}}
        for t in tools if t["name"] != FINISH
    ]
    history.append({"role": "system", "content": [
        *removals,
        {"type": "text", "text": (
            f"The work is complete. Call {FINISH} now with the final result. "
            "It is the only tool available for the rest of this conversation."
        )},
    ]})
```

Mark `submit_result` as `strict: true` in the original tool definition, with `additionalProperties: false` on every object in its schema. That gives back the half of the old guarantee you can keep: if the model makes the call, the arguments validate. On Amazon Bedrock, strict tool use isn't available for Opus 5.5, so validate the input in your own code there.

The beta header is `inline-tools-2026-09-15` on the Claude API. The older `mid-conversation-tool-changes-2026-07-01` still works for reference-only changes like these, and it is the one to use on Bedrock and Google Cloud.

### Step 3 and 4: check, and retry a bounded number of times

`auto` lets the model decide. With only one tool left and an explicit instruction it should call that tool, but `auto` makes no promise, and an exit needs one. So check:

```python
def finish(history, tools, attempts=3):
    withdraw_all_but_finish(history, tools)
    for _ in range(attempts):
        response = client.beta.messages.create(
            model="claude-opus-5-5",
            max_tokens=16000,
            betas=["inline-tools-2026-09-15"],
            output_config={"effort": "medium"},
            tools=tools,               # identical to the first request, every time
            messages=history,
        )
        history.append({"role": "assistant", "content": response.content})
        if response.stop_reason == "refusal":
            break
        call = next(
            (b for b in response.content if b.type == "tool_use" and b.name == FINISH),
            None,
        )
        if call:
            return call.input
        history.append({"role": "user", "content": f"Call {FINISH} now. Do not reply in text."})
    return extract_result(history)     # step 5
```

Note what the loop doesn't do. It never removes the failed reply or the reminder, and it never touches `tools`. Each retry only appends. Deleting the reply that missed would be another edit to the prefix.

### Step 5: the exit that always works

If the model still hasn't called the tool, end the conversation with a fresh request. Send no tools, set a structured-output format and give it the transcript (or a summary of it) as input:

```python
def extract_result(history):
    response = client.messages.create(
        model="claude-opus-5-5",
        max_tokens=16000,
        output_config={"format": {"type": "json_schema", "schema": RESULT_SCHEMA}},
        messages=[{"role": "user", "content": render_transcript(history)}],
    )
    return json.loads(next(b.text for b in response.content if b.type == "text"))
```

A new conversation has its own prefix, so preserved thinking has nothing to check against. You lose the reasoning in the old thinking blocks, but the transcript's text and tool results carry most of what matters for a final answer. This branch should be rare. Log it when it runs, because frequent use means steps 1–4 need work.

One principle covers all five steps: **the guarantee now lives in your code, not in a request parameter.** That was always the more honest place for it. A forced tool call only guaranteed that the API would return a `tool_use` block. Whether the result was good was always your code's problem.

## Doing the due diligence

None of these changes is hard to fix once you know about it. What matters is whether you learn about it from the release notes or from production. This is the checklist I run before changing a model string:

1. **Read three documents, not one.** The model's *migration guide* lists the breaking changes. The *what's new* page explains them. The [API release notes](https://platform.claude.com/docs/en/release-notes/overview) cover platform changes that shipped alongside the model, such as the new beta header for tool changes.
2. **Grep for every rejected parameter.** For Opus 5.5 that means `tool_choice`, `"disabled"`, `budget_tokens`, `temperature`, `top_p`, `top_k`, a trailing assistant prefill and `computer_20251124`. Each one is a 400 waiting to happen.
3. **Find every place you build `messages` yourself.** Anything that edits the system prompt, rewrites the tools array, deletes an old reminder or summarises old turns in place breaks preserved thinking. If your account is older than 31 August 2026 you won't see the error. In your test environment, set `prefix_mismatch_behavior` to `"error"` inside `thinking.block_binding` (beta `thinking-binding-controls-2026-08-01`). Any value opts that request into enforcement, so you get the errors a newer account would.
4. **Set every default you rely on explicitly.** Opus 5.5 defaults to `medium` effort where Opus 5 defaulted to `high`. If you never set `effort`, your quality and latency both changed without a diff. Set it explicitly and re-run your evals at the level you choose.
5. **Look for quiet changes in what users see.** Narration between tool calls moved into `thinking` blocks. If you stream it to users, opt into `display: "updates"` (beta `thinking-display-updates-2026-08-18`) and render those blocks.
6. **Check your fallbacks.** On the Claude API, only Fable 5.1 and Mythos 5.1 can read Opus 5.5 thinking blocks. A router or refusal fallback to Opus 5 continues without the reasoning. The request still succeeds, but you should know it happens.
7. **Make the model bump its own pull request.** Don't bundle it with a feature. Run your evals before and after, and ship it behind a flag or to a slice of traffic first.

Anthropic now ships a [`/claude-api migrate`](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/claude-api-skill#migrating-to-a-newer-claude-model) skill in Claude Code that applies the mechanical changes for you: the model ID, rejected parameters, prefill replacement and effort calibration. Use it, because it is good at the grep. It doesn't know that your agent's exit depended on forced tool choice, or that your support team reads the narration between tool calls. You only learn those things by reading the notes and then reading your own code.

The model ID is the most important dependency in an LLM application, and it is the one dependency you can't lock. Read its release notes the way you would read the changelog for a major version, because that is what a model change is.
