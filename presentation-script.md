# Presentation Script — How AI Rewired My Dev Workflow

**Format:** Remote Zoom session (~30 minutes)
**Audience:** June and coworkers
**Tone:** Casual, conversational, honest

---

## Slide 1 — Title
**Time: ~30 seconds**

> Hey everyone, thanks for joining. Today I want to share how my dev workflow changed over the past year or so. The title says it all — "How AI Rewired My Dev Workflow." I started from the most basic thing — copy-pasting ChatGPT answers — and ended up building custom AI skills that actually changed how I work day to day. Let me walk you through that journey.

---

## Slide 2 — The Starting Point
**Time: ~2 minutes**

> So this is where it started. The workflow was dead simple. Open ChatGPT in a browser, type a question, copy the answer, paste it into my editor. That was it.
>
> And honestly, it worked. The tasks on the MCD project were straightforward enough — most issues could be solved with a single question. Small fixes on a mature codebase. Zero setup, zero friction.
>
> But looking back, I was the entire pipeline. I was the one reading the problem, switching to the browser, asking the question, copying the answer, pasting it back, verifying it worked. Every single step was manual.
>
> Simple. And honestly, good enough at the time. But I didn't know what I was missing.

---

## Slide 3 — My AI Journey
**Time: ~1.5 minutes**

> Here's the timeline of tools I went through. It started with ChatGPT Web — ask, copy, paste. Then I discovered avante.vim, which was the first time AI lived inside my editor. I didn't have to leave Vim anymore.
>
> Then came the full AI IDEs — Antigravity, which had plan mode and Chrome integration, and Windsurf, which was our company-provided tool. Honestly, they were both agentic IDEs and the experience was pretty similar. I used Antigravity for side projects since Windsurf was the company tool and I didn't want to use it for personal stuff.
>
> And then I landed on Claude Code CLI. Back to the terminal. That's where things really changed, and I'll explain why.

---

## Slide 4 — avante.vim
**Time: ~1.5 minutes**

> So avante.vim was tool number two for me. The subtitle says it — AI without leaving :terminal. As a long-time Vim user, I didn't want to switch to a different editor just to use AI. avante.vim meant I didn't have to. Ask a question, get a suggestion, stay in flow.
>
> No more switching to a browser tab mid-thought. For the first time, AI felt like part of my editor, not a separate tool.
>
> You can see here, the usage is simple — just type `:Avante ask` followed by what you need, like "add error handling to this API call." It runs right inside Neovim. That was a big shift from the copy-paste workflow.

---

## Slide 5 — Antigravity & Windsurf
**Time: ~1.5 minutes**

> Next were the full AI-powered IDEs. Both Antigravity and Windsurf are full AI IDEs with agentic workflows and multi-file edits.
>
> Antigravity stood out with built-in browser debugging and plan mode — the AI can actually launch your app, look at the UI, and verify its own changes. That was impressive.
>
> Windsurf was solid, similar experience. Honestly, they blur together. They both got me further than avante.vim, but I still found myself not fully satisfied with the code quality. Sometimes the output wasn't what I'd write myself.
>
> But the journey wasn't over...

---

## Slide 6 — Why Claude Code Works for Me
**Time: ~2 minutes**

> So why Claude Code? I want to be clear — this is a personal choice, not a recommendation. The disclaimer at the bottom says it: the best AI tool is whichever fits your workflow.
>
> For me, I live in the terminal. Vim is my editor. Claude Code runs right next to it — same window, zero friction. That's the terminal-native part.
>
> The agentic part is key — you tell it what you want, not how to do it. It acts like you would. It reads files, makes edits, runs tests, all autonomously.
>
> And then there's the extensible part — Skills and MCP let you teach it your domain. This is where it gets really interesting, and I'll dive deep into this in a bit.
>
> Again, Windsurf, Cursor, Antigravity — they're all great. This is just what fits how I work.

---

## Slide 7 — Typeless
**Time: ~1.5 minutes**

> Quick detour from coding tools — this is Typeless. The subtitle is "Why am I still typing?" and that's honestly what I thought when I first tried it.
>
> It's a voice input tool with three modes. Natural speech — you just talk and it cleans up filler words, fixes self-corrections, matches your tone. Ask Anything — select some text, speak a command, and it transforms it. And Translation — speak in any language, get clean text in another.
>
> I use this all the time now — for writing Jira comments, Slack messages, even for prompting Claude Code. You can see the demos playing on the left. It's one of those tools that once you start using, you can't go back.

---

## Slide 8 — What Are AI Skills?
**Time: ~1.5 minutes**

> OK, now the core concept of the talk. What are AI Skills?
>
> Skills are playbooks for AI. They teach it how to handle specific domains — your rules, your workflow. Build once, anyone on the team can use them.
>
> The equation on screen is simple: AI plus a Skill equals a Domain Expert. Without a skill, AI is general-purpose. With a skill, it knows your project's conventions, your team's processes, your specific tools.
>
> I'll show you the structure of a skill next, and then real examples from our MCD project.

---

## Slide 9 — Anatomy of a Skill
**Time: ~2 minutes**

> Here's what a skill looks like under the hood. It lives in `.claude/skills/` in your repo. Three parts:
>
> SKILL.md — this is the brain. It tells AI what to do and how. It's just markdown — write it like you're explaining the workflow to a new team member.
>
> References — your domain docs, schemas, examples. Anything the AI needs to know about your specific context.
>
> Scripts — shell scripts and tooling that the AI can actually run. This is what makes skills actionable, not just informational.
>
> On the right you can see skills.sh — there's a whole community ecosystem with over 78,000 skills. You don't have to start from scratch. For example, there's a brainstorming skill that helps you think through problems before building. And a skill-creator that helps you build your own skills.
>
> The key point: you don't need to be an expert to write one.

---

## Slide 10 — Skills vs MCP
**Time: ~1 minute**

> Quick comparison — Skills versus MCP. Levin already covered MCP in depth, so I'll keep this brief.
>
> Skills are knowledge and workflows. They teach AI what to do. They're markdown-based, easy to create and share.
>
> MCP is tools and integrations. It gives AI new abilities — connecting to external services like Jira, Figma, GitHub.
>
> They complement each other. A skill tells AI the workflow, MCP gives it the tools to execute. You'll see this in the real examples coming up.

---

## Slide 11 — MCP Tip: Figma Dev Mode
**Time: ~1.5 minutes**

> Quick practical tip before the demos. If you're using the Figma MCP server and working with third-party design files — like the MCD design system — you might hit a restriction where Dev Mode isn't available.
>
> The workaround is simple: duplicate the file, open your copy, and enable Dev Mode. Three steps. Now you have full MCP integration and AI can read the design specs directly.
>
> You can see the demo video showing the process. It's a quick win that makes the Figma-to-code workflow much smoother.

---

## Slide 12 — Design → Code
**Time: ~2 minutes**

> Here's the bigger picture — going from design to code in minutes instead of days. Manually translating designs into code is one of the most repetitive tasks in frontend work. AI handles the heavy lifting.
>
> The video on the left shows a real example — AI reading a Figma design through MCP and generating Tailwind code in real time.
>
> On the pros side: it skips repetitive layout translation, reads specs directly from Figma, and gives you working code in minutes.
>
> But I want to be honest about the cons too. AI can't actually "see" the result — you still need to eyeball it. Layout bugs may take a few rounds to fix. And positioning and spacing often need manual tweaks. It's not magic, but it cuts out a lot of tedious work.

---

## Slide 13 — i18n Management: mcd-i18n
**Time: ~2 minutes**

> Now for real examples from our project. This is mcd-i18n — a skill I built for managing translation keys. The link in the title goes to the actual code on GitHub if anyone wants to look at it later.
>
> Managing translation keys used to mean juggling Google Sheets across 5 modules. This skill does it all from the terminal.
>
> On the left you can see what it does: manages keys across 5 modules, CSV-based workflow so no Google Sheets needed, auto-generates key IDs and descriptions, one command to add or modify translations.
>
> On the right is the live workflow. Say I need to add "ご注文はこちらから / Start Your Order" for all modules. I type that one sentence. It asks which module. It generates the key — Common.StartOrder.Label — then inserts the CSV, compiles, and updates the source code.
>
> Google Sheets, 5 modules, manual updates — all replaced by one sentence.

---

## Slide 14 — Jira Ticket Task Breakdown
**Time: ~2.5 minutes**

> This is probably the most complex skill I built. Give it a Jira ticket, get back a full breakdown with subtasks, estimates, and implementation specs.
>
> On the right you can see the multi-agent pipeline. It starts by gathering the Jira ticket through Atlassian MCP. Then the Requirements Analyst breaks it down into a scope table and tasks.
>
> Then it forks — Scout and Architect run as subagents in parallel. Scout looks for reusable code in the codebase. Architect analyzes the blast radius — what files will be affected, what could break.
>
> Their findings feed into the Senior Estimator, which calibrates the hours based on actual codebase complexity, not gut feel.
>
> Finally, it outputs an OpenSpec — a full proposal with design and implementation specs.
>
> The video on the left shows this running in real time. What used to be me drafting subtasks one by one is now a pipeline that runs in a few minutes.

---

## Slide 15 — PR Generator: mcd-pr
**Time: ~2 minutes**

> Next up — the PR generator skill. Run `/mcd-pr` with a ticket number, and it writes your PR title and description for you.
>
> Under the hood, three agents run in parallel. One fetches the Jira ticket for context. One reads the git diff and commit history. And one checks Slack for any relevant discussions about the ticket.
>
> All three findings merge together, and the skill generates a PR with a proper title, summary, and test plan. You can see an example output on screen — it includes the what, the why, and the how-to-test.
>
> Before this, I'd spend time writing PR descriptions by hand, trying to remember what I changed and why. Now it's one command, and it pulls from all the right sources automatically.

---

## Slide 16 — QA Handoff: mcd-qa-handoff
**Time: ~2 minutes**

> Last skill example — automated QA handoff. After deploying to staging, I run `/mcd-qa-handoff` with the ticket number. AI reads Jira plus the git diff, writes QA instructions in plain language, then a reviewer sub-agent checks for jargon before output.
>
> The pipeline has three phases: gather context from Jira, git log, and code diff. Build the QA comment in non-technical language. And the Review phase — a sub-agent specifically catches variable names, file paths, and developer jargon. QA always gets human-readable instructions.
>
> Before this, I'd write test instructions by hand every time. Now it's one command, and the quality is actually more consistent because the reviewer sub-agent catches things I might miss.

---

## Slide 17 — Before vs After
**Time: ~2 minutes**

> This slide brings it all together. My workflow, before and after.
>
> Receiving a task: before, I'd skim the ticket and guess the scope. Now, Jira MCP gives me full context, zero guessing.
>
> Estimating: before, gut feel, pad two-x, hope for the best. Now, AI scans the codebase and gives calibrated hours.
>
> Breakdown: before, I'd draft subtasks one by one. Now, mcd-task-breakdown runs a 4-agent pipeline.
>
> Development: before, code from scratch, fix as you go. Now, OpenSpec feeds into Claude Code, which builds and tests.
>
> PR: before, write the title and description by hand. Now, mcd-pr pulls from Jira, Git, and Slack in parallel.
>
> QA handoff: before, write test instructions by hand. Now, mcd-qa-handoff generates reviewer-verified steps.
>
> And even input: before, type everything by hand. Now, Typeless — speak, don't type.
>
> Every stage of the workflow has changed.

---

## Slide 18 — Takeaways
**Time: ~2 minutes**

> If I could tell myself something on day one, it would be these four things.
>
> One — start simple, start now. ChatGPT copy-paste counts. The best AI tool is the one you actually use. Don't wait for the perfect setup.
>
> Two — find your own path. I chose the terminal because that's where I live. Match the tool to how you work. Don't force yourself into someone else's workflow.
>
> Three — skills compound. One skill saves you hours. Ten skills change how you work. Every skill I built made the next one easier to build, and made the whole team faster.
>
> Four — the IC era is here. One person with AI can now do what used to take a whole team. Skills, agents, pipelines — they multiply what a single contributor can deliver. The leverage is real.

---

## Slide 19 — Meta Moment
**Time: ~1 minute**

> One last thing before Q&A. Everything you just saw was made by AI.
>
> This presentation — the slides, the animations, the styling — was generated entirely through Claude Code. A skill called frontend-slides built the deck. Remotion produced the demo videos. No manual coding. No design tools. Just a conversation.
>
> You've been looking at the proof.
>
> [pause for a moment to let that land]

---

## Slide 20 — Q&A
**Time: remaining (~5-8 minutes)**

> That's it! The ceiling is higher than you think. When I started, I thought copy-pasting from ChatGPT was as good as it gets. I didn't know AI could plan, code across files, run multi-agent pipelines, or generate an entire presentation. Every time I thought I'd hit the limit, there was another level.
>
> You can see some podcast tiles on screen — these are great listens if you want to go deeper. Lenny's Podcast on how design is changing, 20VC on the future of coding, and Naval on AI as a motorcycle for the mind. I'd recommend all three.
>
> Happy to take any questions. About the tools, the skills, how to get started — anything.

---

**Total estimated time: ~28-30 minutes (including Q&A)**
