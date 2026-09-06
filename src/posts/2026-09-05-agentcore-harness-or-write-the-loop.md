---
title: "Do You Still Need to Write the Agent Loop? AgentCore Harness vs. Runtime"
date: "2026-09-05"
category: "AI & Agents"
tags: ["aws", "agentcore", "strands", "ai agents", "python"]
description: "AgentCore's managed harness turns the agent loop and everything around it into configuration. Here is the one question that decides whether that's for you, and the four rows in the feature grid that answer it."
image: "/images/harness-1-bench.jpg"
---

![A clockwork mechanism sealed under a bell jar beside the same mechanism taken apart on a cloth](/images/harness-1-bench.jpg)

The loop in a [Strands](https://strandsagents.com/) agent is about five lines. `Agent(model=..., tools=[...], system_prompt=...)`, call it, done. Nobody's project has ever been late because of those five lines.

It's late because of everything *around* them. Somewhere to run it. Session isolation so one user's shell isn't another user's shell. Memory that survives the container. Credentials for the tools. Traces you can actually read. An endpoint. Auth on the endpoint. By the time all that exists, the five lines are a rounding error.

AWS has started calling that whole bundle — loop plus infrastructure — the **harness**, and in July the managed version, **AgentCore harness**, went GA. The pitch is that the bundle becomes configuration: you declare a model, instructions and tools, and AgentCore runs the loop for you inside a microVM it owns. Under the hood, it's Strands.

So the question is no longer "which framework?" It's whether you need to write the agent as code at all.

## The one question

**Do you need to change how the loop behaves, or only what it's given?**

If the answer is "what it's given" — a different model, another tool, a longer memory, a tighter token budget — that's a config field on a harness. If the answer is "how it behaves" — a graph instead of a loop, a hook that inspects every tool call, a bidirectional audio stream — you are writing code, and you are deploying it on AgentCore **Runtime**, which is the same infrastructure with your code inside it.

The docs have a [feature grid](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/harness-vs-runtime.html) with thirty-odd rows comparing the two. You can skip nearly all of it. The rows that matter are the four the harness marks ❌:

- **Choice of agent framework.** It's Strands. Not LangGraph, not the Claude Agent SDK, not your own.
- **Bidirectional streaming.** Request in, stream out. If you're doing live voice, that's not enough.
- **Non-loop patterns.** No `Graph`, no `Workflow`, no `Swarm`. If you read [my last piece](/blog/2026-09-03-strands-workflow-vs-graph-vs-swarm/) and picked anything other than a single agent, the harness is out.
- **Hooks.** No code runs between the model and the tools except the code AWS wrote.

Everything else in the grid is ✅ for the harness with "customer code required: No", and for Runtime it's "supported, but you maintain the implementation". That's the whole trade. If none of the four ❌s applies to you, you are choosing to write and maintain code that the service would otherwise own.

<div class="figure">
<figure>
<svg viewBox="0 0 760 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two columns showing the same stack of agent infrastructure. On the harness side the agent loop sits below the boundary, in the managed half. On the Runtime side every other component stays managed and only the agent loop moves above the boundary, into code you write.">
  <text class="f-label" x="8" y="16">The same stack. One piece changes side.</text>
  <text class="f-node" x="20" y="46">AgentCore harness</text>
  <text class="f-node" x="430" y="46">AgentCore Runtime</text>
  <rect x="20" y="60" width="310" height="70" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="32" y="84">configuration only</text>
  <text class="f-note" x="32" y="106">model · instructions · tools</text>
  <rect x="430" y="60" width="310" height="70" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="442" y="84">your agent code</text>
  <text class="f-note f-warm" x="442" y="106">the agent loop · hooks · graph</text>
  <line x1="20" y1="152" x2="740" y2="152" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 5"/>
  <text class="f-label" x="740" y="144" text-anchor="end">you write it</text>
  <text class="f-label" x="740" y="170" text-anchor="end">aws runs it</text>
  <rect x="20" y="184" width="310" height="116" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note f-warm" x="32" y="208">the agent loop</text>
  <text class="f-note" x="32" y="232">session isolation · memory</text>
  <text class="f-note" x="32" y="254">identity · traces · endpoint</text>
  <text class="f-note" x="32" y="276">auth · microVM · filesystem</text>
  <rect x="430" y="184" width="310" height="116" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="442" y="232">session isolation · memory</text>
  <text class="f-note" x="442" y="254">identity · traces · endpoint</text>
  <text class="f-note" x="442" y="276">auth · microVM · filesystem</text>
  <path d="M 336 204 C 380 200, 384 108, 420 104" fill="none" stroke="#e39b4a" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M 426 103 L 415 98 L 416 108 Z" fill="#e39b4a"/>
  <text class="f-note f-warm" x="380" y="164" text-anchor="middle">moves</text>
</svg>
<figcaption>Everything below the line is managed either way. Choosing Runtime does not buy you more infrastructure, it moves one component into your repository, and with it the four things the harness cannot do.</figcaption>
</figure>
</div>

## What "configuration" actually looks like

Two API calls stand a harness up. One more invokes it.

```bash
aws bedrock-agentcore-control create-harness \
  --harness-name "ReleaseNotesAgent" \
  --execution-role-arn "arn:aws:iam::123456789012:role/ReleaseNotesHarnessRole"
```

Poll `get-harness` until the status is `READY`. Then, from Python:

```python
import boto3, uuid

client = boto3.client("bedrock-agentcore", region_name="us-west-2")

response = client.invoke_harness(
    harnessArn="arn:aws:bedrock-agentcore:us-west-2:123456789012:harness/ReleaseNotesAgent-XyZ123",
    runtimeSessionId=str(uuid.uuid4()),   # must be at least 33 characters
    messages=[{
        "role": "user",
        "content": [{"text": "Summarise what merged between v2.3 and v2.4 as release notes."}],
    }],
)

for event in response["stream"]:
    if "contentBlockDelta" in event:
        text = event["contentBlockDelta"].get("delta", {}).get("text")
        if text:
            print(text, end="", flush=True)
    elif "runtimeClientError" in event:
        print("\nError:", event["runtimeClientError"]["message"])
```

There's no model in that call. Leave it out and you get Claude Sonnet 4.6 on Bedrock; name one and it can be a Bedrock model, an OpenAI one, Gemini, or anything LiteLLM speaks, and you can switch provider *mid-session* without losing the conversation. Reuse the `runtimeSessionId` and you're back in the same microVM with the same filesystem and the same history.

Tools are data too. This is the bit that took me a moment to appreciate, because in Strands a tool is a decorated Python function, and here it's a dictionary:

```python
tools = [
    {   # any remote MCP endpoint, no gateway needed
        "type": "remote_mcp",
        "name": "github",
        "config": {"remoteMcp": {"url": "https://mcp.example.com/github"}},
    },
    {   # a governed, policy-backed tool surface
        "type": "agentcore_gateway",
        "name": "internal-apis",
        "config": {"agentCoreGateway": {
            "gatewayArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/internal"
        }},
    },
    {"type": "agentcore_code_interpreter", "name": "code_interpreter"},
]

client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    tools=tools,      # accepted at create, update, or invoke time
    messages=[...],
)
```

Notice `tools=` is on the *invoke*. You can hand a harness a different tool set per request without touching the deployed thing. That's a config change in the literal sense: nothing gets rebuilt.

![A vintage switchboard with a few patch cables plugged in and one being inserted](/images/harness-2-panel.jpg)

## The tool that runs on your side of the wire

The one tool type that *isn't* fully managed is the interesting one. An `inline_function` is a schema the model can call, but the harness doesn't execute it. It pauses, returns the call to you with `stopReason: "tool_use"`, and waits.

```python
tools=[{
    "type": "inline_function",
    "name": "approve_release",
    "config": {"inlineFunction": {
        "description": "Ask a human to approve publishing the release notes.",
        "inputSchema": {
            "type": "object",
            "properties": {"summary": {"type": "string"}},
            "required": ["summary"],
        },
    }},
}]
```

You read the `toolUse` block out of the stream, do whatever the approval actually is — a Slack message, a ticket, a person — and send the result back on the same session:

```python
client.invoke_harness(
    harnessArn=HARNESS_ARN,
    runtimeSessionId=SESSION_ID,
    messages=[
        {"role": "assistant",
         "content": [{"toolUse": {"toolUseId": tool_use_id, "name": "approve_release", "input": tool_input}}]},
        {"role": "user",
         "content": [{"toolResult": {"toolUseId": tool_use_id,
                                     "content": [{"text": "approved"}],
                                     "status": "success"}}]},
    ],
)
```

Both messages, the assistant's `toolUse` *and* your `toolResult`. That's deliberate: the harness doesn't persist the inline turn to the session, because if your client died before answering, a half-turn in the history would corrupt every later call. So you replay both halves and the session stays clean whether or not you came back.

<div class="figure">
<figure>
<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A sequence between your client and the harness. You invoke, the harness pauses and returns a toolUse block, you carry out the approval outside the session, then you invoke again on the same session replaying both the assistant toolUse and your toolResult. Between the pause and the replay the harness stores nothing for that turn.">
  <text class="f-label" x="8" y="16">One inline_function round trip</text>
  <rect x="454" y="34" width="228" height="52" fill="none" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-note" x="466" y="56">the approval happens here</text>
  <text class="f-note" x="466" y="74">Slack · a ticket · a person</text>
  <line x1="568" y1="86" x2="568" y2="116" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 4"/>
  <line x1="130" y1="116" x2="744" y2="116" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="122" y="112" text-anchor="end">your client</text>
  <line x1="130" y1="286" x2="744" y2="286" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="122" y="282" text-anchor="end">the harness</text>
  <line x1="182" y1="124" x2="182" y2="276" stroke="#b26a3c" stroke-width="1.5"/>
  <path d="M182 282 L177 271 L187 271 Z" fill="#b26a3c"/>
  <text class="f-note" x="192" y="150">invoke</text>
  <text class="f-note" x="192" y="168">your message</text>
  <line x1="352" y1="276" x2="352" y2="124" stroke="#b26a3c" stroke-width="1.5"/>
  <path d="M352 118 L347 129 L357 129 Z" fill="#b26a3c"/>
  <text class="f-note" x="362" y="150">pause</text>
  <text class="f-note" x="362" y="168">stopReason: tool_use</text>
  <line x1="700" y1="124" x2="700" y2="276" stroke="#e39b4a" stroke-width="1.5"/>
  <path d="M700 282 L695 271 L705 271 Z" fill="#e39b4a"/>
  <text class="f-note" x="690" y="150" text-anchor="end">invoke again, same session</text>
  <text class="f-note f-warm" x="690" y="172" text-anchor="end">assistant toolUse</text>
  <text class="f-note f-warm" x="690" y="190" text-anchor="end">+ user toolResult</text>
  <rect x="362" y="272" width="328" height="28" fill="none" stroke="#d93b2b" stroke-width="1" stroke-dasharray="4 4"/>
  <text class="f-note f-hot" x="372" y="322">nothing is stored for the inline turn</text>
</svg>
<figcaption>The harness keeps no record of the paused turn, so the session cannot be left holding half of one. That is why the replay carries both halves: the assistant's call and your result. If your client never comes back, there is nothing to clean up.</figcaption>
</figure>
</div>

That's human-in-the-loop as a first-class pattern, without a hook. It's also the escape hatch for "call my internal thing" when you don't want to expose it as an MCP server yet.

## The exit door

The objection to any managed abstraction is the day you outgrow it. AWS's answer is `agentcore export harness`:

```bash
npm install -g @aws/agentcore
agentcore export harness --name ReleaseNotesAgent --target-agent-name ReleaseNotesRuntime
```

Out comes ordinary Python using Strands — model, tools, skills, memory, execution limits, filesystem mounts, all carried over — as a normal Runtime agent you own. It writes an `EXPORT_NOTES.md` listing what it couldn't translate cleanly, which you should read before you `agentcore deploy`. The generated agent isn't tied to Runtime either: it's Python 3.12, so Lambda, Fargate, a Kubernetes cluster or a box under the desk are all fine.

That changes the calculus. "Start with the harness" used to mean "accept a rewrite later". Now it means "start with config, export to code the day you hit one of the four ❌s, and keep going". Prototype in the cheap medium, graduate when you have a reason.

![A steel fire door wedged slightly open, daylight coming through the gap](/images/harness-3-door.jpg)

## Three things that will bite

**Every session carries ~900 tokens of tools you didn't ask for.** `shell` and `file_operations` are on by default, and their definitions go into *every* model request, not once per invocation. For a chatty agent that's real money. `allowedTools` fixes it — `["@builtin/shell"]`, `["@github/read_*"]`, or just the names you need — and it's the first thing I'd set on any harness that isn't meant to be a general coding agent.

**`allowedTools` is not a security boundary.** It scopes what the *model* may select during `InvokeHarness`. There's a separate API, `InvokeAgentRuntimeCommand`, that runs a shell command in the session directly and never passes through the model. If you don't want that possible, don't grant the IAM action. Restricting tools in config and leaving that permission in the execution role is the kind of gap that looks fine in a review.

**Session IDs are your isolation key, so treat them like one.** The harness keys the microVM, the filesystem and the memory on `runtimeSessionId`. Reusing one is how you continue a conversation; reusing one *across users* is how you leak a filesystem. Generate them, store them against the user, and never derive them from something guessable.

## Verdict

I'd default to the harness now, and I'd have said the opposite six months ago. The four ❌s are the honest list of reasons not to: another framework, bidirectional streaming, multi-agent topologies, hooks. If one of those is on your requirements list *today*, go to Runtime and write the Strands yourself. If it isn't, you are about to spend weeks re-implementing the ✅ column, and the export command means you can defer that decision until it's forced.

The five lines were never the hard part. It's nice to finally be able to say so out loud.
