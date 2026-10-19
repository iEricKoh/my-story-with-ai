# 演讲稿 — How AI Rewired My Dev Workflow

**形式：** Zoom 远程会议（约30分钟）
**听众：** June 和同事们
**风格：** 轻松、对话式、真诚

---

## Slide 1 — 标题页
**时间：约30秒**

> 大家好，感谢参加。今天想跟大家分享一下过去这一年多，我的开发工作流是怎么被 AI 一步步改变的。标题写的很直接——"How AI Rewired My Dev Workflow"。从最开始的复制粘贴 ChatGPT，到后来自己动手做 AI Skills，整个过程变化挺大的。我来带大家走一遍这个过程。

---

## Slide 2 — 起点
**时间：约2分钟**

> 最开始是这样的。工作流非常简单——打开浏览器，问 ChatGPT，复制答案，粘贴到编辑器。就这样。
>
> 说实话，当时够用了。MCD 项目的任务都比较直接，大部分问题问一次就能解决。都是在一个成熟代码库上做小修小补，零配置、零门槛。
>
> 但回过头来看，整个流程里，我就是那个 pipeline。读需求是我，切浏览器是我，问问题是我，复制粘贴还是我，验证也是我。每一步都是手动的。
>
> 简单，当时确实够用。但我不知道自己错过了什么。

---

## Slide 3 — 我的 AI 之旅
**时间：约1.5分钟**

> 这是我用过的工具时间线。从 ChatGPT Web 开始——问、复制、粘贴。然后发现了 avante.vim，第一次 AI 可以直接在我的编辑器里用了，不用再离开 Vim。
>
> 再后来是完整的 AI IDE——Antigravity 有 plan mode 和 Chrome 集成，Windsurf 是公司给我们用的。说实话这两个体验很像。我用 Antigravity 做个人项目，因为 Windsurf 是公司的工具，不太想拿来做自己的东西。
>
> 最后到了 Claude Code CLI。回到终端。这才是真正改变一切的地方，后面我会详细说。

---

## Slide 4 — avante.vim
**时间：约1.5分钟**

> avante.vim 是我的第二个工具。副标题说的是——AI Without Leaving :terminal。作为一个用 Vim 很久的人，我不想为了用 AI 去换编辑器。avante.vim 让我不需要换——问个问题，拿到建议，保持在心流里。
>
> 不用再在写代码写到一半的时候切到浏览器了。这是第一次，AI 感觉像是编辑器的一部分，而不是一个独立的工具。
>
> 用法很简单，就像这里显示的——输入 `:Avante ask "add error handling to this API call"`，直接在 Neovim 里运行。相比之前的复制粘贴，这是一个很大的转变。

---

## Slide 5 — Antigravity & Windsurf
**时间：约1.5分钟**

> 接下来是完整的 AI IDE。Antigravity 和 Windsurf 都是全功能的 AI IDE，支持 agentic workflow 和多文件编辑。
>
> Antigravity 比较突出的是内置的浏览器调试和 plan mode——AI 可以启动你的应用，看 UI，自己验证改动。这一点确实厉害。
>
> Windsurf 也很好用，体验差不多。说实话，这两个工具用起来很容易混在一起。它们都比 avante.vim 更强，但我对代码质量还是不太满意。有时候输出的代码不是我自己会写的那种。
>
> 但旅程还没结束……

---

## Slide 6 — 为什么 Claude Code 适合我
**时间：约2分钟**

> 那为什么选 Claude Code？我要先说清楚——这是个人选择，不是推荐。下面的小字也写了：最好的 AI 工具就是最适合你自己工作流的那个。
>
> 对我来说，我就是住在终端里的。Vim 是我的编辑器，Claude Code 就在旁边跑——同一个窗口，零摩擦。这是 terminal-native。
>
> Agentic 这一点很关键——你告诉它要什么，不用告诉它怎么做。它会像你一样去做：读文件、改代码、跑测试，全部自主完成。
>
> 然后是可扩展性——Skills 和 MCP 让你可以教它你的业务领域。这是后面要重点讲的部分。
>
> 再说一次，Windsurf、Cursor、Antigravity 都很好。这只是最适合我的工作方式。

---

## Slide 7 — Typeless
**时间：约1.5分钟**

> 插播一个不是编码工具的东西——Typeless。副标题是 "Why Am I Still Typing?"，这确实是我第一次用的时候的想法。
>
> 它有三种模式。自然语音——你直接说话，它会去掉口头禅、修正自我纠正、匹配你的语气。Ask Anything——选中文字，说一个指令，它帮你改写、总结或重写。翻译——用任何语言说话，得到另一种语言的干净文本。
>
> 我现在一直在用——写 Jira 评论、Slack 消息，甚至用来给 Claude Code 写 prompt。左边的视频有演示。这种工具一旦开始用，就回不去了。

---

## Slide 8 — 什么是 AI Skills？
**时间：约1.5分钟**

> 好，现在进入今天的核心概念。什么是 AI Skills？
>
> Skills 就是给 AI 的 playbook。教它怎么处理特定领域——你的规则、你的工作流。做一次，团队里所有人都能用。
>
> 屏幕上的公式很简单：AI 加上 Skill 等于领域专家。没有 skill 的时候，AI 是通用的。有了 skill，它就知道你项目的规范、团队的流程、你用的工具。
>
> 接下来我会展示 skill 的结构，然后是 MCD 项目里的真实例子。

---

## Slide 9 — Skill 的结构
**时间：约2分钟**

> 一个 skill 的内部结构是这样的。它放在仓库的 `.claude/skills/` 目录下。三个部分：
>
> SKILL.md——这是大脑。告诉 AI 做什么、怎么做。就是 markdown，写起来像给新同事解释工作流一样。
>
> references/——你的业务文档、schema、示例。AI 需要知道的上下文都放这里。
>
> scripts/——AI 可以执行的 shell 脚本和工具。这是让 skill 有行动力的关键。
>
> 右边可以看到 skills.sh——一个社区生态，有超过 78,000 个 skill。不用从零开始。比如有一个 brainstorming skill，帮你在动手之前先想清楚问题。还有一个 skill-creator，帮你自己写 skill。
>
> 关键是：你不需要是专家也能写出一个 skill。

---

## Slide 10 — Skills vs MCP
**时间：约1分钟**

> 快速对比一下 Skills 和 MCP。Levin 已经详细讲过 MCP，所以我这里简单说。
>
> Skills 是知识和工作流，教 AI 做什么。基于 markdown，容易创建和分享。
>
> MCP 是工具和集成，给 AI 新的能力——连接 Jira、Figma、GitHub 这些外部服务。
>
> 它们是互补的。Skill 告诉 AI 工作流，MCP 给它执行的工具。后面的实际例子会看到这一点。

---

## Slide 11 — MCP 小技巧：Figma Dev Mode
**时间：约1.5分钟**

> 在看 demo 之前，分享一个实用小技巧。如果你用 Figma MCP 打开第三方设计文件——比如 MCD 的设计系统——可能会遇到 Dev Mode 不可用的限制。
>
> 解决办法很简单：复制文件，打开你的副本，启用 Dev Mode。三步。现在你就有了完整的 MCP 集成，AI 可以直接读取设计规格。
>
> 视频里可以看到整个流程。是个很快的小 win，让 Figma 到代码的工作流顺畅很多。

---

## Slide 12 — 设计到代码
**时间：约2分钟**

> 这里看的是更大的图景——设计到代码，从几天缩短到几分钟。手动把设计稿翻译成代码是前端工作中最重复的任务之一。AI 能扛起大部分重活。
>
> 左边的视频展示了一个真实的例子——AI 通过 MCP 读取 Figma 设计，实时生成 Tailwind 代码。
>
> 优点：跳过重复的布局翻译，直接从 Figma 读取设计规格，几分钟就有能用的代码。
>
> 但我也想诚实说说缺点。AI 看不到最终结果——你还是得自己目测。布局 bug 可能要修几轮。定位和间距经常需要手动调整。不是魔法，但确实省掉了大量重复劳动。

---

## Slide 13 — i18n 管理：mcd-i18n
**时间：约2分钟**

> 现在看项目里的真实例子。这是 mcd-i18n——我做的一个管理翻译 key 的 skill。标题里的链接指向 GitHub 上的实际代码，感兴趣的话可以之后看。
>
> 以前管理翻译 key 意味着在 5 个模块之间来回操作 Google Sheets。这个 skill 让一切都在终端完成。
>
> 左边是它的功能：跨 5 个模块管理 key，基于 CSV 的工作流不需要 Google Sheets，自动生成 key ID 和描述，一条命令就能添加或修改翻译。
>
> 右边是实际工作流。比如我需要给所有模块添加"ご注文はこちらから / Start Your Order"。我就打这一句话。它问我目标模块，生成 key——Common.StartOrder.Label——然后插入 CSV、编译、更新源代码。
>
> Google Sheets、5 个模块、手动更新——全部被一句话替代。

---

## Slide 14 — Jira 任务拆解
**时间：约2.5分钟**

> 这个可能是我做的最复杂的 skill。给它一个 Jira ticket，拿回完整的任务拆解、子任务、时间估算和实现规格。
>
> 右边可以看到多 agent pipeline。首先通过 Atlassian MCP 获取 Jira ticket。然后 Requirements Analyst 拆解出范围表和任务。
>
> 然后分叉——Scout 和 Architect 作为 subagent 并行运行。Scout 在代码库里找可复用的代码。Architect 分析影响范围——哪些文件会受影响、什么可能会出问题。
>
> 他们的发现汇入 Senior Estimator，基于实际的代码库复杂度来校准工时——不是凭感觉了。
>
> 最后输出一个 OpenSpec——完整的方案，包含设计和实现规格。
>
> 左边的视频展示了实际运行过程。以前需要我一个个手写子任务，现在是一个几分钟跑完的 pipeline。

---

## Slide 15 — PR 生成器：mcd-pr
**时间：约2分钟**

> 接下来是 PR 生成器。跑 `/mcd-pr` 加上 ticket 号，它帮你写 PR 标题和描述。
>
> 底层有三个 agent 并行运行。一个从 Jira 拉 ticket 上下文，一个读 git diff 和 commit 历史，还有一个去 Slack 查有没有相关的讨论。
>
> 三方的信息汇总之后，skill 生成一个完整的 PR——包括标题、摘要和测试计划。屏幕上可以看到一个示例输出——包含了改了什么、为什么改、怎么测试。
>
> 以前每次都要自己手写 PR 描述，还得回忆改了啥、为什么改。现在一条命令，自动从所有正确的来源拉取信息。

---

## Slide 16 — QA 交接：mcd-qa-handoff
**时间：约2分钟**

> 最后一个 skill 例子——自动化 QA 交接。部署到 staging 之后，我跑一下 `/mcd-qa-handoff` 加上 ticket 号。AI 读 Jira 加 git diff，用通俗语言写 QA 测试说明，然后一个 reviewer sub-agent 在输出前检查是否有技术术语。
>
> Pipeline 有三个阶段：从 Jira、git log 和代码 diff 收集上下文。用非技术语言写 QA 评论。Review 阶段比较有意思——专门有一个 sub-agent 去抓变量名、文件路径和开发者术语。QA 拿到的永远是人类可读的说明。
>
> 以前每次都要手写测试说明。现在一条命令搞定，而且质量其实更稳定，因为 reviewer sub-agent 会抓到我可能漏掉的东西。

---

## Slide 17 — Before vs After
**时间：约2分钟**

> 这张 slide 把所有东西串起来了。我的工作流，改变前和改变后。
>
> 接收任务：以前扫一眼 ticket 凭感觉猜范围，现在 Jira MCP 给完整上下文，不用猜。
>
> 估时：以前凭直觉，乘以二，然后祈祷。现在 AI 扫描代码库，给出校准后的工时。
>
> 任务拆解：以前一个个手写子任务，现在 mcd-task-breakdown 跑一个 4-agent pipeline。
>
> 开发：以前从头写代码，边写边修。现在 OpenSpec 输入到 Claude Code，它来构建和测试。
>
> PR：以前手写标题和描述，现在 mcd-pr 从 Jira、Git、Slack 并行拉取信息。
>
> QA 交接：以前手写测试说明，现在 mcd-qa-handoff 生成经过 reviewer 验证的步骤。
>
> 甚至输入方式：以前全部手打，现在 Typeless——说就行了。
>
> 工作流的每个阶段都变了。

---

## Slide 18 — 收获
**时间：约2分钟**

> 如果能回到第一天跟自己说几句话，会是这四条。
>
> 第一——从简单的开始，现在就开始。复制粘贴 ChatGPT 也算。最好的 AI 工具就是你真正在用的那个。不要等完美的方案。
>
> 第二——找到自己的路。我选终端是因为我就住在终端里。找到适合你自己工作方式的工具，不要硬套别人的工作流。
>
> 第三——Skills 会复利。一个 skill 帮你省几个小时，十个 skill 改变你的工作方式。我做的每一个 skill 都让下一个更容易做，也让整个团队更快。
>
> 第四——IC 时代来了。一个人加上 AI，现在能做到以前需要一整个团队才能做的事。Skills、agents、pipelines——它们成倍放大了一个人能交付的东西。这个杠杆是真实的。

---

## Slide 19 — Meta Moment
**时间：约1分钟**

> 最后在 Q&A 之前说一件事。你们刚才看到的所有内容，都是 AI 做的。
>
> 这个演示文稿——slides、动画、样式——全部通过 Claude Code 生成。一个叫 frontend-slides 的 skill 做了整个 deck，Remotion 制作了 demo 视频。没有手动写代码，没有设计工具，就是一段对话。
>
> 你们一直在看的，就是证明。
>
> [稍微停顿一下，让大家消化]

---

## Slide 20 — Q&A
**时间：剩余时间（约5-8分钟）**

> 就是这些！The ceiling is higher than you think。我一开始觉得复制粘贴 ChatGPT 就到头了。没想到 AI 可以做计划、跨文件写代码、跑多 agent pipeline、甚至生成一整个演示文稿。每次觉得到顶了，都还有下一层。
>
> 屏幕上可以看到一些播客推荐——想深入了解的话都值得听。Lenny's Podcast 聊设计的变化，20VC 聊编程的未来，Naval 聊 AI 是思维的摩托车。三个都推荐。
>
> 大家有什么问题都可以问。关于工具、关于 skills、怎么上手——都可以。

---

**预计总时间：约28-30分钟（含 Q&A）**
