---
title: "The Vibe-Coding Critique Is Missing the Point"
date: "2026-09-30"
category: "Tooling & Craft"
tags: ["AI coding", "software engineering", "developer experience", "craft"]
description: "AI-generated code is not the problem. Unreviewed code is. Let the machine do the typing; bring the judgement that makes the result worth shipping."
image: "/images/ai-coding-1-supervision.jpg"
---

![An experienced developer reviewing a code change at a desk by the window](/images/ai-coding-1-supervision.jpg)

The internet is filling up with *vibe-coded* software, and the criticism is often deserved. But the problem is not that AI wrote the code. It is that nobody took responsibility for it.

If you cannot explain, test or maintain what you ship, it is a risk—whether you typed every character or delegated the whole change to an agent.

Professional developers should be AI coders. Let the machine do more of the typing. Bring the judgement that makes the result worth shipping.

## The craft is in the judgement

“Vibe coding” is a useful label for accepting generated code without checking it. It is a poor label for every workflow involving a model.

An engineer who directs an agent, reviews the diff, challenges the design and verifies the behaviour is producing code that is both AI-generated and professionally engineered.

Experience matters here. It helps you spot the race condition, question the unnecessary dependency, or notice that a tidy refactor has changed a contract. A model can draft a migration. You still need to know why it must be reversible.

I want AI to handle routine implementation, draft tests and explore approaches. My job is to supply context, catch false assumptions and decide whether the result belongs in the system.

![Two software engineers reviewing a code change and test results together](/images/ai-coding-2-quality-gates.jpg)

## Measure the gain, not the first draft

The evidence is mixed. [GitHub’s Copilot study](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) found a 55.8% speedup on a bounded JavaScript task. [METR’s early-2025 study](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) found experienced contributors took 19% longer working in familiar repositories. Different tasks and tools; neither result is a universal rule. METR’s [2026 update](https://metr.org/blog/2026-02-24-uplift-update/) suggested improvement, but could not reliably establish the size of the gain.

[DORA’s 2025 report](https://dora.dev/research/2025/dora-report/) offers a useful framing: AI amplifies existing strengths and weaknesses. Good tests and clear systems help. Fragile foundations can mean producing defects faster.

Count the whole job: instruction, generation, review, correction, testing and maintenance. A first draft in minutes is no saving if untangling it takes hours.

Sometimes a small hand-edit is quicker. Sometimes an agent invents an API or writes tests that merely confirm its own mistake. Use smaller, reviewable changes and check the assumptions that matter.

But when AI can handle routine work well, “I can type it myself” is a weak reason to spend hours doing so.

![An engineer comparing a hand-drawn system diagram with the implementation on a laptop](/images/ai-coding-3-pairing.jpg)

## Own what you ship

The standard is the same whoever wrote the first draft:

- Does it meet the requirement and fit the surrounding system?
- Can you explain the design and verify the important behaviours?
- Can the team maintain it and recover if it fails?

If you cannot answer those questions, you are shipping vibes. If you can, AI is another tool of your craft.

Being professional is not about typing every line. It is about understanding, verifying and owning the result.
