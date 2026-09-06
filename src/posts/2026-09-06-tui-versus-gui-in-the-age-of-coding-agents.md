---
title: "The Terminal Was the Gateway Drug. Now the GUI Is Making a Serious Case."
date: "2026-09-06"
category: "Tooling & Craft"
tags: ["terminal", "agentic coding", "developer experience", "macos"]
description: "Coding agents made the terminal feel like the natural place to work. Their new desktop apps are making the graphical alternative harder to dismiss. I am not done choosing."
image: "/images/tui-gui-1-bench.jpg"
---

![A brass telegraph key trailing a ribbon of paper tape beside a drafting board of blank cards pinned in a grid](/images/tui-gui-1-bench.jpg)

Earlier this year I wrote that I was [embracing the terminal](/blog/2026-01-07-embracing-the-terminal/). That was true. It still is. But it is no longer the whole story.

Claude Code was the thing that pushed me over the edge. I had spent years treating the terminal as a useful basement: Git lived down there, Docker lived down there, and the occasional awkward thing that a graphical application could not quite do lived down there. Then I started working with an agent that was most capable, most direct, and most configurable in a terminal. The basement became the front door.

That did not make me a command-line purist. It made me notice a change in the shape of the work. An agent is not merely another pane in an IDE. It can inspect a repository, run a test suite, follow a log, ask a question, edit three files, wait for a build and come back with the result. A terminal is unusually good at making all of those actions addressable: every tool has a name, arguments, standard input and standard output. The agent and I can inhabit the same vocabulary.

So I collected terminal tools with the enthusiasm of someone who has just found a better workshop.

- [Yazi](https://yazi-rs.github.io/) for navigating and previewing files.
- [tuicr](https://tuicr.dev/) for reviewing a continuous diff and exporting anchored comments back into an agent loop.
- [k9s](https://k9scli.io/) for Kubernetes, plus `lazydocker` and `lazygit` for the two things whose native CLIs are brilliant but not always relaxing.
- Codex CLI, Claude Code, Antigravity CLI and OpenCode CLI for the increasingly strange job of supervising software-making software.

None of those is a nostalgic green-screen substitute for a proper application. They are applications. The useful distinction is not _text versus graphics_; Yazi has previews, panes, a theme and mouse support, while tuicr has a diff browser and inline review state. The distinction is whether the interface's primary contract is a composable stream of text and keystrokes, or a spatial surface designed to be looked at and manipulated.

For a while, the terminal side of that distinction felt like an easy win. Then the agent products started building proper graphical homes for themselves.

## Why agents made the terminal click

![A run of brass pipes and valves joined end to end across a workbench, the last one emptying into a glass beaker](/images/tui-gui-2-pipes.jpg)

The conventional terminal pitch is speed: learn a few commands, keep your hands on the keyboard, avoid mousing around. That is true, but it is a rather small argument. The more interesting advantage is that the terminal makes a workflow **legible to automation**.

If I can do a task with `git diff`, `rg`, `jq`, `kubectl`, a shell script and a project-local instruction file, an agent can usually participate in it without a translation layer. A command produces a result that can be inspected, piped, saved, compared or handed to another command. A failure has an exit code. A setup can live in version control. A successful sequence becomes a repeatable recipe rather than a memory of where I clicked.

That matters more when the person at the keyboard is not always a person. A coding agent can invoke the same test command that CI invokes. It can reproduce the same local environment setup. It can use a repository's `AGENTS.md`, `CLAUDE.md` or scripts as durable context rather than relying entirely on a chat transcript. The terminal is not magical; it is simply already an automation interface.

On macOS, computer-use agents make the loop even tighter. I can stay in a terminal-centric workspace for the work that has a CLI and ask an agent to cross the boundary when it does not: inspect a native preferences screen, operate an application with no useful command interface, or visually verify the thing it built. That changes the old trade-off. Living in the terminal no longer means pretending the rest of the desktop does not exist.

There is a psychological advantage too. A terminal session encourages a small, explicit loop: inspect, decide, act, verify. Agents are at their best inside that loop. They can be given a bounded task, shown its output and corrected at the exact point their assumptions depart from reality. The workflow feels less like issuing a wish to a black box and more like pair programming with a colleague who happens to type very fast.

## What the terminal actually gives me

The terminal deserves its reputation for customisability, but that word can sound cosmetic. The useful kind is structural.

I choose the terminal emulator, shell, prompt, fonts, keybindings, multiplexer, editor, pager, Git presentation and the way commands compose. I can make a review command feed structured comments into an agent. I can put a project-specific bootstrap script beside the code. I can run the exact same flow locally, over SSH, in CI, or inside a worktree. The interface adapts to the workflow rather than asking the workflow to fit a product team's fixed surface.

That produces some genuine advantages:

| Terminal / TUI           | Why it matters with agents                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| Composable commands      | Outputs can become the next tool's input, or evidence in an agent conversation.                    |
| Plain-text configuration | Preferences, aliases, prompts and project instructions can be diffed, shared and versioned.        |
| Remote-native            | SSH is not a reduced experience; it is often the normal one.                                       |
| Low visual overhead      | A few panes can hold logs, a test runner, Git status and an agent without competing for attention. |
| Repeatability            | The useful command can become a script, a Make target or a CI step.                                |

There are costs, and enthusiasts tend to wave them away too quickly. A highly tuned terminal is a private language. My keybindings and aliases make _me_ faster; they can make pairing slower. Discoverability is poor because a blank prompt does not advertise its capabilities. Configuration carries maintenance cost. A tool that assumes a particular terminal protocol, font, shell, operating system or plugin manager can turn a clean installation into a small archaeological dig.

And text is not automatically the clearest representation of everything. A rich diff, a large dependency graph, an image comparison, a timeline, a browser layout and a multi-agent queue all have spatial information that the terminal can express only by borrowing conventions or sacrificing context. Anyone who has tried to understand a difficult merge conflict through a narrow terminal pane knows that keyboard efficiency has a point of diminishing return.

## The graphical counter-offer

![An antique annunciator board of small brass indicator windows, two flags standing raised among many dropped](/images/tui-gui-3-board.jpg)

This is where the new agent apps have become interesting rather than merely convenient.

Claude Code Desktop explicitly frames itself as the same coding engine in a graphical workspace. It adds side-by-side sessions, integrated terminal and editor panes, visual diff review, live previews, worktree isolation and, on macOS, computer use. Its own documentation makes the division unusually clear: Desktop is for parallel sessions and visual review; the CLI remains the choice for scripting and automation. [That is not a retreat from the terminal.](https://code.claude.com/docs/en/desktop)

The Codex app makes a similar bet from a different angle: the hard problem is increasingly not _asking an agent to change a file_ but directing several long-running agents, keeping their work isolated, seeing what changed and knowing where to look next. Its worktree support, task threads and review surface turn a folder full of terminals into a command centre. [OpenAI describes it in exactly those terms.](https://openai.com/index/introducing-the-codex-app/)

The GUI earns its keep when it makes the state of a system visible at a glance. An app preview beside the change that caused it. A graphical diff where comments sit where the reader needs them. A sidebar of concurrent tasks with their status, repository and worktree. A visual indication that one agent is waiting on an approval while another has finished. These are not decorative touches. They reduce the amount of state I have to reconstruct in my head.

That last part is the real shift. When one agent did one task, a terminal tab was enough. When several agents have separate branches, tools, context windows and runtimes, the bottleneck moves from execution to supervision. A graphical interface can make supervision humane.

| GUI / agent desktop     | What it makes easier                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Spatial layout          | Compare an implementation, its diff, its running UI and the conversation without constant pane choreography. |
| Visual review           | Notice hierarchy, design regressions, screenshots and code changes together.                                 |
| Parallel-task awareness | See which agent is running, needs attention or has a review ready.                                           |
| Lower discovery cost    | Available actions, integrations and settings can be found rather than memorised.                             |
| Cross-app work          | An agent can interact with browsers and native macOS applications that have no sensible CLI.                 |

The cost is the inverse of the terminal's strength. A GUI often hides its state behind controls, local preferences and product decisions. It is harder to pipe a click into another process. Its most convenient workflow may not be portable, scriptable or versionable. It can be richer while also being less ownable.

There is also a quiet risk of abstraction. A polished agent app can make worktrees, permissions, filesystems and command execution feel pleasantly distant. That is excellent right up until the task fails and I need to understand what the agent actually did. The terminal's lack of ceremony has a safety feature: it keeps the machinery in view.

## The awkward middle: customisation versus coherence

![A loose pile of mismatched hand tools on a leather cloth beside a fitted case of matched brass instruments in green velvet](/images/tui-gui-4-case.jpg)

This is the tension I keep returning to.

The terminal gives me a set of interchangeable parts. I can shape it until it fits almost perfectly, then change a piece when it does not. The result can feel like a bespoke instrument. But the instrument is mine to maintain, and each new feature asks me to choose, install, configure and remember another thing.

The new agent GUIs offer coherence. Sessions, worktrees, review, previews, permissions and background work have one visible place to live. That is enormously valuable when the task is no longer a linear conversation in one repository. It is also a constraint: the product decides which seams are exposed, which integrations deserve a button, which workflows can be automated, and what a "normal" project looks like.

Neither position is intellectually pure. Terminal tools have their own opinions and defaults; graphical apps increasingly expose configuration, skills, hooks and project instructions. In fact, the interesting products are blurring the boundary. Claude Desktop can share configuration with the CLI. Codex skills can travel between its app, CLI and IDE. `tuicr` can export a structured review to an agent. The practical question is not which camp wins. It is where the hand-off is clean enough that I do not have to choose once and forever.

## A workflow I am still testing

For now, my default is deliberately mixed.

I begin close to the repository: terminal, shell, agent CLI, Git status, tests, logs and the small TUI tools that make those things pleasant. It is the fastest way for me to establish what is true. If the task benefits from scripts, remote access, a custom tool chain or a tight feedback loop with an agent, I stay there.

I move to a graphical agent environment when the thing I need is broad situational awareness: parallel tasks, visual comparison, application behaviour, screenshots, a browser, a diff that deserves slow reading, or a native macOS application that must actually be operated. I do not regard that as leaving the terminal behind. I regard it as using the right representation for the part of the problem in front of me.

What I have not decided is whether that division will hold. The more capable coding agents become, the more valuable their graphical command centres look. The more those apps conceal customisation or resist composition, the more I want my terminal back. For the moment I am straddling both: a terminal full of sharply made tools on one side, richer agent workspaces on the other, and an increasingly interesting question in the gap between them.

That seems like the right place to be while the tools are still changing this quickly.
