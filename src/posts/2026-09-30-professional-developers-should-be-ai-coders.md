---
title: "The Vibe-Coding Critique Is Missing the Point"
date: "2026-09-30"
category: "Tooling & Craft"
tags: ["AI coding", "software engineering", "developer experience", "craft"]
description: "AI-generated code is not the problem. Unreviewed, context-free code is. Professional developers should be using AI to do more of the typing—and applying their craft to everything that makes the result software."
image: "/images/ai-coding-1-supervision.svg"
---

![A professional developer directing a capable machine through a wall of constraints, tests and architectural choices](/images/ai-coding-1-supervision.svg)

There is a familiar complaint making the rounds: the internet is filling up with *vibe-coded* software, and vibe coders have no value.

I think the complaint identifies a real failure and gives it the wrong name.

Software produced by a person who cannot explain its assumptions, test its behaviour, or maintain it is a risk. That is true whether the person typed every character, accepted every autocomplete, or delegated the whole change to an agent. The problem is not that an AI wrote code. The problem is that nobody took responsibility for the code.

And that distinction points to a more demanding standard for professional developers: in 2026, we should be AI coders. We should let the machine do most of the typing, while bringing the engineering judgement that makes the output worth shipping.

## “Vibe-coded” describes a workflow, not an authorship

The phrase is useful when it means: *I described an outcome, accepted whatever appeared, and never established whether it was correct.* It is less useful when it is shorthand for *a model was involved, therefore this work is unserious.*

We have seen this category error before. Nobody says a spreadsheet has no value because a formula filled in the cells. Nobody dismisses a building because a crane moved the steel. Tools change the economics of production. They do not remove the need to know what is being produced, for whom, and to what standard.

AI changes the cost of turning intent into a first implementation. That is a profound change—but the first implementation is only one part of software development. Someone still has to make the requirements precise, decide what belongs in the system, understand the existing code, choose the boundaries, notice dangerous edge cases, verify the behaviour, and own what happens after deployment.

If a professional developer uses an agent to implement a feature, inspects the diff, runs the relevant checks, challenges the design, and improves what fails, the code is AI-generated and professionally engineered. Those descriptions can both be true.

## The craft did not disappear. Its centre of gravity moved.

Professional development was never just the mechanical act of typing syntax. The years matter because they build a library of decisions: which abstraction will age badly, where a race condition is hiding, why this migration needs to be reversible, what a user means when the ticket is vague, and which “simple” change is going to affect three other systems.

Those are precisely the things an AI coder needs to bring to the loop.

I want the model to write the routine implementation. I want it to draft the tests, trace a call path, compare two approaches, update the documentation, and take the first pass at a refactor. I also want to be able to tell it when the proposed interface is wrong, when the test is asserting the implementation instead of the behaviour, when a dependency is not justified, and when the elegant patch has quietly changed a contract.

That is not a lesser version of development. It is a change in where a developer spends attention. The scarce input shifts from keystrokes to judgement.

![A stream of generated code passing through a human-designed sequence of review gates, tests and deployment controls](/images/ai-coding-2-quality-gates.svg)

## The productivity case is real, but it is not a magic number

There is evidence for acceleration. GitHub’s controlled Copilot study found that participants given the tool completed a bounded JavaScript HTTP-server task 55.8% faster. That is a concrete result in a particular setup, not a universal multiplier for every engineering task or codebase. ([GitHub’s study and methodology](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/))

There is evidence in the other direction too. METR’s randomized study of 16 experienced open-source developers completing 246 tasks in repositories they knew found that early-2025 AI tools made them take 19% longer on average. The study was a narrow snapshot: experienced contributors, existing large codebases, and tools from that period. It is still a useful warning against treating “AI” as a guaranteed speedup. ([METR’s study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/))

METR’s February 2026 update reported suggestive signs of improvement with later tools, but also described selection effects and measurement problems severe enough that the results were weak evidence for the size of any speedup. That uncertainty is important. It says we should measure our actual work, not repeat a vendor percentage as if it were a law of nature. ([METR’s 2026 update](https://metr.org/blog/2026-02-24-uplift-update/))

And productivity is not the only measure. DORA’s 2025 research frames AI as an amplifier: it can magnify the strengths and weaknesses already present in an organization. Clear systems, good platforms, effective tests and healthy workflows give AI somewhere useful to plug in. Fragile foundations can mean generating defects and delivery instability faster. ([DORA’s 2025 report](https://dora.dev/research/2025/dora-report/))

So the defensible argument is not “AI always makes every developer faster.” It is that AI lowers the cost of many coding tasks, increasingly handles work that used to consume a developer’s time, and is becoming a normal part of the engineering environment. The gains depend on the task, the tools, the codebase and the discipline around them.

## Why professional developers should use it anyway

If an assistant can produce a decent first draft in minutes, spending hours manually transcribing the same routine code becomes harder to justify. There will always be exceptions: a task may be faster to write by hand, a model may be a poor fit, or the work may require precise control that makes delegation more expensive. But “I can type this myself” is no longer enough to settle the economics.

The professional advantage is not that we can out-type a model. It is that we can direct one, inspect what it did, and detect when the answer is plausible but wrong.

That changes the leverage of experience. A developer who understands the system can give the model useful context, decompose a task into reviewable pieces, impose the local conventions, catch a false assumption early, and check the finished work against the real requirement. Someone without that grounding can still make a convincing demo. It is much harder to know whether they have made a system that is safe to change next month.

This is why “AI coder” and “professional developer” should not be treated as rival identities. A professional developer using AI well has more reach: more options explored, more mechanical work delegated, more time available for the decisions with consequences. The machine supplies speed and breadth. The engineer supplies context and responsibility.

## There are good reasons to slow down

Using AI by default does not mean delegating blindly. Reviewing a large patch can cost more than writing a small one. An agent can misunderstand a requirement, invent an API, miss a subtle invariant, or confidently make a broad change when a narrow one was needed. Generated code can carry security, licensing, privacy and maintenance concerns. Sensitive data must stay within the rules of the environment, and generated tests do not prove the code is correct just because they pass.

For a tiny, well-understood change, hand-editing may be the shortest path. For unfamiliar, high-consequence work, it may be sensible to constrain the agent tightly, demand an explicit plan, and verify every important assumption. For any task, the relevant comparison is total effort: instruction, generation, review, correction, testing and maintenance—not the time until the first diff appears.

This is engineering judgement applied to a new tool. It is not a case for keeping the human as a typist out of principle.

![A developer and AI working at the same bench: the machine handles repetition while the engineer examines a small critical component](/images/ai-coding-3-pairing.svg)

## The bar is not “was AI involved?”

The useful questions are more ordinary, and much harder to game:

- Does the implementation meet the requirement?
- Can the author explain the design and its trade-offs?
- Are the important behaviours covered by appropriate checks?
- Has the change been reviewed against the surrounding system?
- Can the team maintain it, operate it and recover if it fails?
- Is a person clearly accountable for the result?

Those questions should apply to every change, whatever wrote the first draft. A professional who uses AI and cannot answer them is shipping vibes. A professional who can answer them is using an efficient production tool.

The bar is not that code must have been painstakingly typed by a human. The bar is that the software is understood, verified, and owned by one.

In a world where writing code by hand is increasingly the expensive way to get a first draft, refusing the tool is not what makes us professionals. Knowing how to use it—and when its answer is not good enough—is.
