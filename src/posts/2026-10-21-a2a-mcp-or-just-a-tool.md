---
title: "A2A, MCP, or Just a Tool? Wiring Agents Together in Late 2026"
date: "2026-10-21"
category: "AI & Agents"
tags: ["ai agents", "a2a", "mcp", "strands", "multi-agent", "python"]
description: "A2A reached 1.0 in March and MCP went stateless in July. The two now look more alike than the slogans suggest. Here is a practical way to decide how each of your agents should be called, and what to do about the tools they share."
---

Most teams end up in the same place. There is a code-review agent that someone built in the spring. There is a research agent that reads the internal docs, a release agent that cuts tags and writes the notes, and a triage agent that lives in the ticket system. Each one works. They are mostly complementary, and a couple of them overlap: three of the four can talk to GitHub. Now someone wants a single front door, one agent you can ask "is PR 412 ready to ship?" that pulls in the others when it needs them.

Every framework offers you three ways to do that. You can pass the other agent in as a tool. You can put it behind an MCP server. Or you can talk to it over A2A, the Agent2Agent protocol. The usual advice is "MCP for tools, A2A for agents". That is true, and it doesn't help, because any agent can be made to look like a tool. The real decision is about something else.

## Where things stand in October 2026

Both protocols moved a long way this year, and a lot of what was written about them in 2025 is now out of date.

**A2A reached 1.0 in March.** It has been a Linux Foundation project since June 2025, and the [one-year announcement](https://www.linuxfoundation.org/press/a2a-protocol-surpasses-150-organizations-lands-in-major-cloud-platforms-and-sees-enterprise-production-use-in-first-year) counts more than 150 supporting organisations, with support built into Amazon Bedrock AgentCore Runtime, Azure AI Foundry and Copilot Studio. The [1.0 specification](https://a2a-protocol.org/latest/specification/) brings:

- **Three bindings:** JSON-RPC, gRPC and plain HTTP+JSON.
- **Signed Agent Cards:** the card at `/.well-known/agent-card.json` can carry a JWS signature, so a client can check who published it.
- **A full task lifecycle:** states for `INPUT_REQUIRED` and `AUTH_REQUIRED` as well as working, completed, failed and so on.
- **An explicit version header.** Clients send `A2A-Version`, and a request without it is treated as 0.3. Most of the A2A code you'll find in blog posts and old repositories is 0.3, so check which version a sample speaks before you copy it.

**MCP shipped its largest revision in July.** The [2026-07-28 specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/) made four changes that matter here:

- **The core is stateless.** The `initialize` handshake and the `Mcp-Session-Id` header are gone. Every request carries its own version and capabilities, so any request can land on any server instance.
- **Servers ask questions differently.** A server that needs something from the client mid-call, such as a confirmation, now returns `input_required` and the client retries the call with the answers. This is called Multi Round-Trip Requests, and it replaces the old server-to-client calls.
- **Long-running calls became Tasks.** Tasks moved out of the experimental core into an official extension. A tool call can return a durable task handle instead of a result; the client polls `tasks/get`, answers questions through `tasks/update`, and can `tasks/cancel`.
- **Sampling is deprecated.** [Sampling](https://modelcontextprotocol.io/specification/2026-07-28/client/sampling) let a server borrow the client's model. The spec now says new implementations should not adopt it and should call their model provider directly.

Put those side by side and something interesting has happened. On the question of long-running work, MCP and A2A now have the same shape: a durable handle, a state that means "I need input", polling or a subscription, and cancellation. "MCP can't do long-running agents" is no longer true, as long as your host supports the Tasks extension (support still varies by client; the MCP site keeps a [client matrix](https://modelcontextprotocol.io/extensions/client-matrix)). And with sampling deprecated, an MCP server that runs an agent has to bring its own model and its own API key. That's the honest version of the pattern anyway: an agent behind a tool.

So the two protocols no longer differ in what they *can* do. They differ in what the contract is for. An MCP tool is a schema-typed call that the caller's model decides to make. An A2A agent is a party with its own identity, its own published skills and its own task lifecycle, and it is built on the assumption that you don't control it.

## The question that decides it

The question isn't "is this thing an agent?" Everything in the opening example is an agent. The question is **who owns it, and who else needs to call it?**

1. **Your team owns it and only your orchestrator calls it.** Pass it in as a tool, in-process. No network, no protocol, nothing to deploy. This should be the default, and most of your agents should stay here.
2. **Your team owns it, but more than one host should be able to call it,** such as your orchestrator, Claude Code, Cursor, or a colleague's agent. Put it behind an MCP server. Every MCP host can then use it with no work on your part.
3. **Someone else owns it:** another team with its own release schedule, a vendor, a partner company. Use A2A. They publish a card, you authenticate, and their agent runs its tasks on their terms.

<div class="figure">
<figure>
<svg viewBox="0 0 760 388" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Three horizontal lanes, each showing a caller box on the left and a callee box on the right. Top lane, in-process: an orchestrator and a specialist agent inside one dashed process boundary; a string goes in through tools equals agent and a string comes back. Middle lane, MCP: any MCP host, such as an IDE, a CLI or an orchestrator, sends tools/call with schema-typed arguments to an MCP server that runs its own agent loop with its own model key; it returns a result or a task handle. Bottom lane, A2A: a client agent on your side fetches the remote agent's agent card from the well-known path, sends a message with a context ID, and receives a task that can enter input-required and returns artifacts. A dashed vertical line separates your side from their side.">
  <defs>
    <marker id="a2m-c" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#b26a3c"/></marker>
    <marker id="a2m-w" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#e39b4a"/></marker>
  </defs>
  <text class="f-label" x="8" y="20">In-process · the agent is a tool</text>
  <rect x="8" y="30" width="744" height="86" fill="none" stroke="rgb(240 231 218 / 0.22)" stroke-width="1" stroke-dasharray="4 4"/>
  <rect x="40" y="46" width="200" height="40" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="140" y="71" text-anchor="middle">orchestrator</text>
  <rect x="520" y="46" width="200" height="40" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="620" y="71" text-anchor="middle">specialist agent</text>
  <line x1="244" y1="58" x2="514" y2="58" stroke="#b26a3c" stroke-width="1" marker-end="url(#a2m-c)"/>
  <text class="f-note" x="380" y="52" text-anchor="middle">tools=[agent] · a string in</text>
  <line x1="516" y1="76" x2="246" y2="76" stroke="#b26a3c" stroke-width="1" marker-end="url(#a2m-c)"/>
  <text class="f-note" x="380" y="92" text-anchor="middle">a string back</text>
  <text class="f-note" x="20" y="108">one process · one deploy · one owner</text>
  <text class="f-label" x="8" y="152">MCP · the agent sits behind a tool</text>
  <rect x="40" y="166" width="200" height="52" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="140" y="188" text-anchor="middle">any MCP host</text>
  <text class="f-note" x="140" y="206" text-anchor="middle">IDE · CLI · orchestrator</text>
  <rect x="520" y="160" width="200" height="64" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="620" y="182" text-anchor="middle">MCP server</text>
  <text class="f-note" x="620" y="200" text-anchor="middle">runs its own agent loop</text>
  <text class="f-note" x="620" y="215" text-anchor="middle">with its own model key</text>
  <line x1="244" y1="180" x2="514" y2="180" stroke="#b26a3c" stroke-width="1" marker-end="url(#a2m-c)"/>
  <text class="f-note" x="380" y="174" text-anchor="middle">tools/call · schema-typed args</text>
  <line x1="516" y1="206" x2="246" y2="206" stroke="#b26a3c" stroke-width="1" marker-end="url(#a2m-c)"/>
  <text class="f-note" x="380" y="222" text-anchor="middle">result · or a task handle</text>
  <text class="f-label" x="8" y="272">A2A · the agent is a peer</text>
  <line x1="496" y1="282" x2="496" y2="364" stroke="rgb(240 231 218 / 0.22)" stroke-width="1" stroke-dasharray="4 4"/>
  <rect x="40" y="290" width="200" height="52" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="140" y="312" text-anchor="middle">client agent</text>
  <text class="f-note" x="140" y="330" text-anchor="middle">your stack</text>
  <rect x="520" y="284" width="200" height="64" fill="#26180f" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-node" x="620" y="306" text-anchor="middle">remote agent</text>
  <text class="f-note" x="620" y="324" text-anchor="middle">another team's stack</text>
  <text class="f-note" x="620" y="339" text-anchor="middle">signed agent card</text>
  <line x1="244" y1="296" x2="514" y2="296" stroke="#e39b4a" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#a2m-w)"/>
  <text class="f-note" x="360" y="290" text-anchor="middle">GET /.well-known/agent-card.json</text>
  <line x1="244" y1="318" x2="514" y2="318" stroke="#e39b4a" stroke-width="1" marker-end="url(#a2m-w)"/>
  <text class="f-note" x="360" y="312" text-anchor="middle">SendMessage · contextId</text>
  <line x1="516" y1="340" x2="246" y2="340" stroke="#e39b4a" stroke-width="1" marker-end="url(#a2m-w)"/>
  <text class="f-note" x="360" y="356" text-anchor="middle">task · input-required · artifacts</text>
  <text class="f-note" x="488" y="380" text-anchor="end">your side</text>
  <text class="f-note" x="504" y="380">their side</text>
</svg>
<figcaption>Three ways to put one agent behind another agent's call. In the first two, only the wire changes and you still own both ends. In the third, the agent you're calling has its own identity, its own task lifecycle, and someone else's release schedule.</figcaption>
</figure>
</div>

There's one more factor that can move an agent down this list: **does it need to talk back?** A specialist that routinely needs a back-and-forth with its caller ("which environment?", "this needs approval from someone with deploy rights") fits A2A's task model better, even inside one company. A specialist from another team that takes a request and returns an answer can be perfectly happy behind MCP.

## In-process: the default

In [Strands](https://strandsagents.com/), passing an agent to another agent's `tools` list is all it takes. Strands wraps it automatically and uses the agent's `name` and `description` as the tool spec:

```python
from strands import Agent

reviewer = Agent(
    name="reviewer",
    description="Reviews a pull request diff and reports findings.",
    system_prompt="You review diffs for correctness bugs.",
    tools=[github],          # shared GitHub MCP server, read-only credential
    callback_handler=None,   # only the orchestrator streams to the user
)

orchestrator = Agent(
    system_prompt="You decide whether a pull request is ready to ship.",
    tools=[reviewer, researcher, release_manager],
)
```

There is nothing to operate, which is the whole appeal. Each specialist gets its own context window, its own model and its own tools, and its context starts clean on every call. The orchestrator never sees the reviewer's tools. That's a feature: the orchestrator's tool list stays short, and its model chooses between outcomes rather than between forty GitHub endpoints.

The cost is that the reviewer receives a single string. It doesn't see the conversation the orchestrator has been having. If the user said "ignore the generated files" three turns ago, the reviewer will only know if the orchestrator remembers to say so. You can't rely on that, so write the wrapper yourself and give it typed arguments:

```python
from pydantic import BaseModel
from strands import tool

class Finding(BaseModel):
    path: str
    line: int
    severity: str
    summary: str

class Review(BaseModel):
    verdict: str              # "ship", "fix first" or "needs a human"
    findings: list[Finding]

@tool
def review_pull_request(repo: str, pr_number: int, exclude_paths: list[str], focus: str) -> str:
    """Review a pull request and return findings as JSON.

    Use for any request to check, review or assess a PR. Reports only: it never
    comments, approves or merges. Pass findings to release_manager for that.

    Args:
        repo: owner/name of the repository.
        pr_number: the pull request number.
        exclude_paths: globs the user asked to skip, e.g. generated code.
        focus: correctness, security or performance.
    """
    result = reviewer(
        f"Review {repo}#{pr_number}. Focus: {focus}. Skip: {exclude_paths or 'nothing'}.",
        structured_output_model=Review,
    )
    return result.structured_output.model_dump_json()
```

The arguments make the orchestrator's model fill in what the specialist needs. The structured result means the orchestrator reads a verdict instead of guessing at one. This wrapper is also what makes promotion cheap later: the same arguments become an MCP `inputSchema` or an A2A data part, and the docstring becomes a tool description or an Agent Card skill.

## MCP: when the agent has more than one caller

Promote the reviewer to an MCP server on the day someone says "I want this in my IDE too". The [Python SDK](https://py.sdk.modelcontextprotocol.io/) (v2 speaks the 2026-07-28 spec) makes the server itself small:

```python
from mcp.server import MCPServer

mcp = MCPServer("pr-reviewer")

@mcp.tool()
def review_pull_request(repo: str, pr_number: int, exclude_paths: list[str], focus: str) -> Review:
    """Review a pull request and return findings. Reports only: never comments, approves or merges."""
    result = reviewer(
        f"Review {repo}#{pr_number}. Focus: {focus}. Skip: {exclude_paths or 'nothing'}.",
        structured_output_model=Review,
    )
    return result.structured_output

mcp.run(transport="streamable-http", stateless_http=True)
```

Returning the Pydantic model gives callers structured content they can read, not prose. Running stateless means you can put three copies behind a plain load balancer. The reviewer calls its own model with its own credentials; with sampling deprecated, that was always going to be the case.

Three things change once the agent is behind MCP.

- **Time becomes your problem.** A review that takes four minutes will hit somebody's tool-call timeout. The Tasks extension is the proper answer: the server returns a handle and the host polls. But both sides have to opt in, and host support isn't universal yet. If your callers don't support Tasks, keep the call short, or do what the 2026-07-28 announcement itself suggests: have the tool return an ID that the model passes back to a second tool to collect the result.
- **Questions go through the protocol.** If the agent needs a confirmation mid-call, it can use elicitation, which now travels over Multi Round-Trip Requests. That's enough for "are you sure?". It is not enough for a real conversation, and if you find yourself chaining elicitations, the agent wants to be an A2A peer.
- **Your description is now the routing.** Every host's model picks tools from their descriptions, and you no longer know which other tools sit beside yours. That means the "never comments, approves or merges" sentence is doing real work. It tells a model that has three GitHub-shaped tools in front of it which one to use.

## A2A: when the agent belongs to someone else

Now suppose the security team runs its own agent for dependency and licence checks. They choose its model, they deploy it every Tuesday, and they want to know who is calling it. That's exactly the situation A2A was designed for. Strands supports both sides. The security team serves theirs:

```python
from strands import Agent
from strands.multiagent.a2a import A2AServer

def create_agent(context_id):
    return Agent(
        name="dependency-audit",
        description="Audits a repository's dependencies for known vulnerabilities and licence conflicts.",
        tools=[sbom, advisories],
    )

A2AServer(agent_factory=create_agent).serve()
```

The factory is the current API; passing a single shared `agent` is deprecated, because one A2A server handles many conversations. You consume it like any other agent:

```python
from strands.agent.a2a_agent import A2AAgent

audit = A2AAgent(endpoint="https://agents.security.internal")
result = audit("Audit acme/payments-api at the head of PR 412.")
```

And to give it to the orchestrator you wrap it in a `@tool`, exactly as in the in-process case. Before you do, know what the wrapping throws away. A2A gives you a task you can watch, a state where the remote agent asks you something, artifacts that arrive over time, and a context that spans several messages. A `@tool` wrapper that returns `str(result)` flattens all of that into one string. The A2A project's own [guidance on A2A and MCP](https://a2a-protocol.org/latest/topics/a2a-and-mcp/) says this is fine for well-defined skills that behave like stateless tools. If you're doing it for every A2A agent you have, though, you probably didn't need A2A.

As of this month there are also some rough edges in the Strands support to plan around. They're all in the [Strands A2A guide](https://strandsagents.com/docs/user-guide/sdk/multi-agent/agent-to-agent/):

- **`A2AAgent` can't answer the remote agent's questions.** If the remote task goes to input-required, answering it means dropping to the raw `a2a-sdk` client, and that's Python only.
- **No Swarm support.** A2A agents can be nodes in a `Graph` (Python only) but not in a `Swarm`, because swarm handoffs are tool-based and A2A doesn't support them yet.
- **`context_id` is not an authentication boundary.** It groups messages into a conversation; it doesn't tell you who sent them. Enforce identity at the transport or gateway, and verify the signature on the Agent Card rather than trusting whatever JSON the URL returned.

## Overlapping tools

This is where most multi-agent setups get messy, and none of the protocols helps you. In the opening example, the reviewer, the release agent and the triage agent all talk to GitHub. That overlap causes three different problems.

**The orchestrator does the work itself.** If the orchestrator has GitHub write tools *and* a reviewer, it will sometimes skip the reviewer and look at the diff itself, because that's the shortest path to an answer. Then you get a review that didn't use the reviewer's prompt, model or checks. The fix is simple: the orchestrator gets no tools that a specialist already has. It routes; it doesn't do.

**Two agents do the same side effect.** If the reviewer and the release agent can both comment on a pull request, sooner or later they both will, possibly with contradicting conclusions. Reads can overlap freely. **Every write needs exactly one owner.** Say so in each agent's description ("reports only; never comments"). Then enforce it with credentials, because a description is a request and a token scope is a rule. The reviewer's GitHub credential can't write. The release agent's can.

**Every agent has its own copy of the tool.** Three agents with three GitHub integrations means three tokens to rotate, three rate-limit budgets, and three places to look when something comments on a PR at 2 a.m. Put the shared tool in one MCP server, and have every agent that needs it connect as a client with its own scoped credential. The 2026-07-28 spec helps here in small but practical ways. Requests now carry `Mcp-Method` and `Mcp-Name` headers, so a gateway can meter and audit per tool without parsing request bodies. And `tools/list` results can be cached with a TTL in a deterministic order, which keeps each agent's prompt cache stable.

<div class="figure">
<figure>
<svg viewBox="0 0 760 296" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two panels. Left, overlap by copy: an orchestrator that holds its own GitHub write tool, above a reviewer and a release agent that each also hold a GitHub write tool, marked in red. Notes read: three GitHub tokens; two agents can comment on one PR; the orchestrator can skip both. Right, overlap by ownership: an orchestrator with no tools above a reviewer and a release agent. Both connect to a single GitHub MCP server below them; the reviewer's connection is labelled read and the release agent's connection is labelled write, in amber. The reviewer keeps its own search tool and the release agent its own deploy tool. Notes read: one token per scope, one audit log; every write has exactly one owner.">
  <line x1="380" y1="8" x2="380" y2="288" stroke="rgb(240 231 218 / 0.14)" stroke-width="1"/>
  <text class="f-label" x="8" y="18">Overlap by copy</text>
  <rect x="104" y="34" width="172" height="36" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="190" y="57" text-anchor="middle">orchestrator</text>
  <rect x="284" y="40" width="84" height="24" fill="none" stroke="#d93b2b" stroke-width="1"/>
  <text class="f-note f-hot" x="326" y="56" text-anchor="middle">gh · write</text>
  <line x1="160" y1="70" x2="99" y2="118" stroke="#b26a3c" stroke-width="1"/>
  <line x1="220" y1="70" x2="281" y2="118" stroke="#b26a3c" stroke-width="1"/>
  <rect x="24" y="118" width="150" height="36" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="99" y="141" text-anchor="middle">reviewer</text>
  <rect x="206" y="118" width="150" height="36" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="281" y="141" text-anchor="middle">release</text>
  <rect x="24" y="166" width="72" height="24" fill="none" stroke="#d93b2b" stroke-width="1"/>
  <text class="f-note f-hot" x="60" y="182" text-anchor="middle">gh · write</text>
  <rect x="102" y="166" width="72" height="24" fill="none" stroke="rgb(240 231 218 / 0.3)" stroke-width="1"/>
  <text class="f-note" x="138" y="182" text-anchor="middle">search</text>
  <rect x="206" y="166" width="72" height="24" fill="none" stroke="#d93b2b" stroke-width="1"/>
  <text class="f-note f-hot" x="242" y="182" text-anchor="middle">gh · write</text>
  <rect x="284" y="166" width="72" height="24" fill="none" stroke="rgb(240 231 218 / 0.3)" stroke-width="1"/>
  <text class="f-note" x="320" y="182" text-anchor="middle">deploy</text>
  <text class="f-note" x="24" y="226">three github tokens</text>
  <text class="f-note" x="24" y="244">two agents can comment on one PR</text>
  <text class="f-note" x="24" y="262">the orchestrator can skip both</text>
  <text class="f-label" x="396" y="18">Overlap by ownership</text>
  <rect x="484" y="34" width="172" height="36" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="570" y="57" text-anchor="middle">orchestrator</text>
  <text class="f-note" x="664" y="57">no tools</text>
  <line x1="540" y1="70" x2="479" y2="118" stroke="#b26a3c" stroke-width="1"/>
  <line x1="600" y1="70" x2="661" y2="118" stroke="#b26a3c" stroke-width="1"/>
  <rect x="404" y="118" width="150" height="36" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="479" y="141" text-anchor="middle">reviewer</text>
  <rect x="586" y="118" width="150" height="36" fill="#26180f" stroke="#b26a3c" stroke-width="1"/>
  <text class="f-node" x="661" y="141" text-anchor="middle">release</text>
  <rect x="404" y="166" width="56" height="22" fill="none" stroke="rgb(240 231 218 / 0.3)" stroke-width="1"/>
  <text class="f-note" x="432" y="181" text-anchor="middle">search</text>
  <rect x="680" y="166" width="56" height="22" fill="none" stroke="rgb(240 231 218 / 0.3)" stroke-width="1"/>
  <text class="f-note" x="708" y="181" text-anchor="middle">deploy</text>
  <line x1="479" y1="154" x2="530" y2="196" stroke="#b26a3c" stroke-width="1" stroke-dasharray="3 3"/>
  <text class="f-note" x="500" y="186" text-anchor="end">read</text>
  <line x1="661" y1="154" x2="610" y2="196" stroke="#e39b4a" stroke-width="1.5"/>
  <text class="f-note f-warm" x="640" y="186">write</text>
  <rect x="484" y="196" width="172" height="40" fill="#26180f" stroke="#e39b4a" stroke-width="1"/>
  <text class="f-node" x="570" y="221" text-anchor="middle">github MCP server</text>
  <text class="f-note" x="396" y="262">one token per scope · one audit log</text>
  <text class="f-note" x="396" y="280">every write has exactly one owner</text>
</svg>
<figcaption>Two agents that both need GitHub. On the left, each carries its own copy of the tool, and so does the orchestrator, so nothing stops two of them doing the same thing. On the right, the tool exists once, in a shared server. The reviewer's credential can only read, and the one agent allowed to write is the one whose job it is.</figcaption>
</figure>
</div>

One smaller overlap is worth catching too: **two agents fetching the same thing.** If the reviewer and the audit agent both pull the same 3,000-line diff, you pay for it twice. Pass identifiers between agents ("PR 412 at commit `a3f9c1e`") rather than content, and let each specialist fetch exactly what it needs from the shared server. It's cheaper, and it means they're looking at the same commit.

## What breaks first

Once agents call agents, the failures look different from single-agent failures. Here is what to expect, roughly in the order you'll hit it.

- **Timeouts.** A nested agent loop is slow, and hosts set their timeouts with ordinary tools in mind. The first production incident is usually a specialist that takes three minutes behind a call that waits for one. Measure each specialist's p95 before you wire it in, and use tasks (MCP or A2A) for anything that doesn't fit comfortably inside the timeout.
- **Cost multiplying quietly.** Every hop is a full agent loop with its own system prompt, its own tool definitions and its own conversation. A question that costs one orchestrator turn can cost four specialist loops. Log tokens per agent, not per request, or you'll never find out which one is expensive. Remember that [prompt caching](/blog/2026-09-05-prompt-caching-in-strands/) is per agent: each specialist needs a stable prefix of its own.
- **Confident failures.** A tool that fails raises an error. An agent that fails usually returns a fluent, plausible, wrong answer. This is why the `Review` model above has a `verdict` that includes "needs a human": give every specialist a way to say it couldn't do the job, and make the orchestrator check for it.
- **Lost traces.** When the answer is wrong, you need to see which hop went wrong. Put a trace ID in every call (MCP requests have `_meta`, A2A messages have `metadata`) and send each agent's spans to the same place. Without that, debugging a four-agent system means reading four logs side by side and lining up timestamps.

## A practical layout

For the situation I started with (several mostly complementary agents, a few overlapping tools, one front door), this is what I'd build today:

1. **One orchestrator with no domain tools.** Its job is routing, and its tool list is a short set of specialists.
2. **Your own specialists in-process, as tools,** each behind a hand-written `@tool` wrapper with typed arguments and a structured result. Most agents never need to leave this stage.
3. **Promote a specialist to an MCP server when it gets a second caller.** Because the wrapper already has a schema, promotion is mostly moving code.
4. **Use A2A where there's an ownership boundary:** another team, a vendor, a partner. Use it fully where the remote agent needs to ask questions or run long tasks, and accept the flattening when it's a one-shot skill.
5. **Put overlapping tools in shared MCP servers,** with a scoped credential per agent and exactly one writer for each side effect.

Notice that the protocols only come up in steps 3 and 4. Getting the boundaries right (who owns which write, what each specialist needs to be told, how it reports failure) matters more than which wire you put between them. If the boundaries are right, you can change the wire later, and you'll find that changing it is the easy part.
