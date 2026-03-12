import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// ─── Colors ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0f",
  termBg: "#0d1117",
  termBar: "#161b22",
  termBorder: "#30363d",
  accent: "#00cf83",
  accentGlow: "rgba(0, 207, 131, 0.25)",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  border: "#2a2a3a",
  white: "#ffffff",
  success: "#22c55e",
  // Discord
  discordBg: "#313338",
  discordMsg: "#2b2d31",
  discordText: "#dbdee1",
  discordMuted: "#949ba4",
  discordBlurple: "#5865f2",
  // Kanban
  kanbanBg: "#161b22",
  kanbanCol: "#0d1117",
  kanbanBorder: "#30363d",
  // Agents
  logician: "#3b82f6",
  soph0n: "#00cf83",
  wallfacer: "#f59e0b",
  // Milestones
  m1: "#3b82f6",
  m2: "#8b5cf6",
  m3: "#f59e0b",
  m4: "#ef4444",
  m5: "#00cf83",
  // GitHub
  ghGreen: "#1a7f37",
  ghMerge: "#8957e5",
};

const S = {
  mono: { fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace" },
  sans: { fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" },
};

const MILESTONE_COLORS = [null, C.m1, C.m2, C.m3, C.m4, C.m5];
const MILESTONE_NAMES = [null, "Foundation", "Catalog", "Detail & Cart", "Checkout", "Polish"];

// ─── Task Data ──────────────────────────────────────────────────────────────
const TASKS = [
  { id: "M1.1", label: "Project Setup", milestone: 1, pr: 22 },
  { id: "M1.2", label: "Product Data", milestone: 1, pr: 23 },
  { id: "M1.3", label: "Shared Layout", milestone: 1, pr: 24 },
  { id: "M1.4", label: "Cart Context", milestone: 1, pr: 25 },
  { id: "M2.1", label: "ProductCard", milestone: 2, pr: 26 },
  { id: "M2.2", label: "Home Page", milestone: 2, pr: 27 },
  { id: "M2.3", label: "Catalog Page", milestone: 2, pr: 28 },
  { id: "M3.1", label: "Product Detail", milestone: 3, pr: 29 },
  { id: "M3.2", label: "Related Products", milestone: 3, pr: 30 },
  { id: "M3.3", label: "Cart Page", milestone: 3, pr: 31 },
  { id: "M4.1", label: "Shipping Form", milestone: 4, pr: 32 },
  { id: "M4.2", label: "Order Review", milestone: 4, pr: 33 },
  { id: "M4.3", label: "Confirmation", milestone: 4, pr: 34 },
  { id: "M5.1", label: "Skeleton Loaders", milestone: 5, pr: 35 },
  { id: "M5.2", label: "Empty States", milestone: 5, pr: 36 },
  { id: "M5.3", label: "Responsive Audit", milestone: 5, pr: 37 },
];

const TEST_COUNTS = [16, 37, 49, 58, 67, 78, 87, 104, 110, 125, 135, 144, 154, 158, 162, 177];

// ─── Timing ─────────────────────────────────────────────────────────────────
const SCENE = {
  prompt: { start: 0, end: 120 },
  architect: { start: 120, end: 340 },
  assembly: { start: 340, end: 1280 },
  results: { start: 1280, end: 1560 },
  product: { start: 1560, end: 1860 },
};
const TOTAL_FRAMES = 1860;
const ASSEMBLY_START = 370; // first task begins
const TASK_INTERVAL = 55;
const TASK_DURATION = 35; // frames in "in progress" before done

// ─── Animation Helpers ──────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0, duration = 8, style = {} }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, frame - delay);
  const opacity = interpolate(p, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(p, [0, duration], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

const ScaleIn = ({ children, delay = 0, style = {} }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 110 } });
  return <div style={{ opacity: Math.min(s * 2, 1), transform: `scale(${0.85 + s * 0.15})`, ...style }}>{children}</div>;
};

const Typewriter = ({ text, delay = 0, charFrames = 1.5, color = C.accent }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const chars = Math.min(Math.floor(t / charFrames), text.length);
  const cursorBlink = Math.floor(t / 15) % 2 === 0;
  return (
    <span>
      <span style={{ color }}>{text.slice(0, chars)}</span>
      {chars < text.length && <span style={{ color: C.accent, opacity: cursorBlink ? 1 : 0.3 }}>█</span>}
    </span>
  );
};

// ─── Background ─────────────────────────────────────────────────────────────
const Background = () => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame * 0.005) * 2;
  return (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 50% at 50% 30%, #1a1040 0%, ${C.bg} 70%), ${C.bg}` }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border}15 1px, transparent 1px), linear-gradient(90deg, ${C.border}15 1px, transparent 1px)`, backgroundSize: "60px 60px", transform: `translateY(${shift}px)`, opacity: 0.4 }} />
    </div>
  );
};

const BottomProgressBar = () => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [0, TOTAL_FRAMES], [0, 100], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `${C.border}44`, zIndex: 100 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, #00ffcc)`, borderRadius: "0 2px 2px 0" }} />
    </div>
  );
};

// ─── Scene 1: The Prompt ────────────────────────────────────────────────────
const DiscordAvatar = ({ name, color, isBot }) => (
  <div style={{ width: 40, height: 40, borderRadius: 20, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...S.sans, fontSize: 18, fontWeight: 700, color: C.white }}>
    {name[0]}
  </div>
);

const DiscordMessage = ({ name, color, isBot, text, delay, charFrames = 1.2 }) => (
  <FadeIn delay={delay} duration={6} style={{ display: "flex", gap: 16, padding: "8px 48px" }}>
    <DiscordAvatar name={name} color={color} isBot={isBot} />
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ ...S.sans, fontSize: 16, fontWeight: 700, color }}>{name}</span>
        {isBot && <span style={{ ...S.sans, fontSize: 10, fontWeight: 700, color: C.white, background: C.discordBlurple, padding: "1px 5px", borderRadius: 3 }}>APP</span>}
        <span style={{ ...S.sans, fontSize: 12, color: C.discordMuted }}>Today at 4:51 PM</span>
      </div>
      <div style={{ ...S.sans, fontSize: 15, lineHeight: 1.5, color: C.discordText }}>
        <Typewriter text={text} delay={delay + 6} charFrames={charFrames} color={C.discordText} />
      </div>
    </div>
  </FadeIn>
);

const DiscordUI = ({ children }) => (
  <div style={{ background: C.discordBg, borderRadius: 12, border: `1px solid ${C.kanbanBorder}`, overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.6)", height: "100%" }}>
    {/* Header */}
    <div style={{ height: 48, background: C.discordMsg, borderBottom: `1px solid ${C.kanbanBorder}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 8 }}>
      <span style={{ color: C.discordMuted, fontSize: 20 }}>#</span>
      <span style={{ ...S.sans, fontSize: 16, fontWeight: 700, color: C.discordText }}>ideas</span>
      <div style={{ width: 1, height: 24, background: C.kanbanBorder, margin: "0 12px" }} />
      <span style={{ ...S.sans, fontSize: 13, color: C.discordMuted }}>Brainstorm and discuss ideas before they become specs</span>
    </div>
    <div style={{ padding: "16px 0" }}>{children}</div>
  </div>
);

const ScenePrompt = () => {
  const frame = useCurrentFrame();
  if (frame >= SCENE.prompt.end + 20) return null;
  const opacity = frame > SCENE.prompt.end ? interpolate(frame, [SCENE.prompt.end, SCENE.prompt.end + 20], [1, 0], { extrapolateRight: "clamp" }) : 1;

  return (
    <div style={{ position: "absolute", top: 80, left: 200, right: 200, bottom: 80, opacity }}>
      <FadeIn delay={0} duration={10}>
        <DiscordUI>
          <DiscordMessage
            name="Eric"
            color="#e2e8f0"
            isBot={false}
            text={'I want to build a shopping website called "Bean & Brew" — an online coffee shop. Built with Next.js App Router and TypeScript. Product data from a static file, cart stored in localStorage. Multi-step checkout with distinct routes.'}
            delay={15}
            charFrames={0.6}
          />
        </DiscordUI>
      </FadeIn>

      {/* Label */}
      <FadeIn delay={5} duration={10} style={{ textAlign: "center", marginTop: 32 }}>
        <span style={{ ...S.sans, fontSize: 14, fontWeight: 600, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>One message. That's all it takes.</span>
      </FadeIn>
    </div>
  );
};

// ─── Scene 2: The Architect ─────────────────────────────────────────────────
const RepoCard = ({ delay }) => (
  <ScaleIn delay={delay} style={{ display: "inline-block" }}>
    <div style={{ background: C.termBg, border: `1px solid ${C.termBorder}`, borderRadius: 10, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <svg width="20" height="20" viewBox="0 0 16 16" fill={C.textDim}><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" /></svg>
      <span style={{ ...S.mono, fontSize: 16, color: C.accent }}>iEricKoh/bean-and-brew</span>
    </div>
  </ScaleIn>
);

const MilestoneChip = ({ num, name, delay }) => (
  <ScaleIn delay={delay} style={{ display: "inline-block" }}>
    <div style={{ background: `${MILESTONE_COLORS[num]}18`, border: `1px solid ${MILESTONE_COLORS[num]}44`, borderRadius: 8, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: MILESTONE_COLORS[num] }} />
      <span style={{ ...S.sans, fontSize: 14, fontWeight: 600, color: MILESTONE_COLORS[num] }}>M{num}</span>
      <span style={{ ...S.sans, fontSize: 13, color: C.textDim }}>{name}</span>
    </div>
  </ScaleIn>
);

const SceneArchitect = () => {
  const frame = useCurrentFrame();
  if (frame < SCENE.architect.start || frame >= SCENE.architect.end + 20) return null;
  const fadeIn = interpolate(frame, [SCENE.architect.start, SCENE.architect.start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = frame > SCENE.architect.end ? interpolate(frame, [SCENE.architect.end, SCENE.architect.end + 20], [1, 0], { extrapolateRight: "clamp" }) : 1;
  const d = SCENE.architect.start;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 120px", gap: 32 }}>
      {/* Logician response */}
      <FadeIn delay={d + 5} duration={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <DiscordAvatar name="L" color={C.logician} isBot />
          <span style={{ ...S.sans, fontSize: 20, fontWeight: 700, color: C.logician }}>Logician</span>
          <span style={{ ...S.sans, fontSize: 10, fontWeight: 700, color: C.white, background: C.discordBlurple, padding: "1px 5px", borderRadius: 3 }}>APP</span>
        </div>
      </FadeIn>

      <FadeIn delay={d + 15} duration={8}>
        <div style={{ ...S.sans, fontSize: 18, color: C.text, textAlign: "center", maxWidth: 700, lineHeight: 1.6 }}>
          "Tailwind CSS, earthy palette, Unsplash placeholders, React Context for cart, distinct checkout routes. Creating repo and breaking this into 5 milestones..."
        </div>
      </FadeIn>

      {/* Repo card */}
      <div style={{ marginTop: 16 }}>
        <RepoCard delay={d + 50} />
      </div>

      {/* Milestones */}
      <FadeIn delay={d + 70} duration={8}>
        <div style={{ ...S.sans, fontSize: 14, fontWeight: 600, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>5 Milestones · 16 Sub-issues</div>
      </FadeIn>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        {[1, 2, 3, 4, 5].map(n => (
          <MilestoneChip key={n} num={n} name={MILESTONE_NAMES[n]} delay={d + 80 + n * 10} />
        ))}
      </div>

      {/* Agents */}
      <FadeIn delay={d + 150} duration={10}>
        <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
          {[
            { name: "Logician", role: "PM", color: C.logician },
            { name: "Soph0n", role: "Coder", color: C.soph0n },
            { name: "Wallfacer", role: "Reviewer", color: C.wallfacer },
          ].map(a => (
            <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: a.color, boxShadow: `0 0 8px ${a.color}66` }} />
              <span style={{ ...S.sans, fontSize: 14, fontWeight: 600, color: a.color }}>{a.name}</span>
              <span style={{ ...S.sans, fontSize: 12, color: C.textMuted }}>{a.role}</span>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
};

// ─── Scene 3: The Assembly Line ─────────────────────────────────────────────

// Compute card states for kanban
function getCardProgress(taskIndex, frame) {
  const startFrame = ASSEMBLY_START + taskIndex * TASK_INTERVAL;
  const doneFrame = startFrame + TASK_DURATION;
  return interpolate(frame, [startFrame, startFrame + 12, doneFrame, doneFrame + 12], [0, 1, 1, 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function getCardColumn(progress) {
  if (progress < 0.5) return 0;
  if (progress < 1.5) return 1;
  return 2;
}

const CARD_H = 36;
const CARD_GAP = 5;
const COL_W = 210;
const COL_GAP = 14;

const KanbanCard = ({ task, x, y, isActive, glowColor }) => (
  <div style={{
    position: "absolute",
    left: x,
    top: y,
    width: COL_W - 16,
    height: CARD_H,
    background: isActive ? `${glowColor}15` : `${C.termBg}`,
    border: `1px solid ${isActive ? glowColor + "66" : C.kanbanBorder}`,
    borderLeft: `3px solid ${glowColor}`,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
    gap: 8,
    transition: "none",
    boxShadow: isActive ? `0 0 12px ${glowColor}22` : "none",
  }}>
    <span style={{ ...S.mono, fontSize: 11, color: glowColor, fontWeight: 700, flexShrink: 0 }}>{task.id}</span>
    <span style={{ ...S.sans, fontSize: 12, color: isActive ? C.text : C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.label}</span>
  </div>
);

const KanbanColumnHeader = ({ title, count, x, color }) => (
  <div style={{ position: "absolute", left: x, top: 0, width: COL_W - 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <span style={{ ...S.sans, fontSize: 13, fontWeight: 700, color: color || C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>{title}</span>
    <span style={{ ...S.sans, fontSize: 12, color: C.textMuted, background: `${C.textMuted}15`, padding: "1px 6px", borderRadius: 8 }}>{count}</span>
  </div>
);

const KanbanBoard = () => {
  const frame = useCurrentFrame();

  // Compute all card positions
  const cards = TASKS.map((task, i) => {
    const progress = getCardProgress(i, frame);
    const column = getCardColumn(progress);
    const color = MILESTONE_COLORS[task.milestone];
    return { ...task, index: i, progress, column, color };
  });

  // Count cards per column and assign Y positions
  const columnCards = [[], [], []];
  cards.forEach(card => {
    card.row = columnCards[card.column].length;
    columnCards[card.column].push(card);
  });

  const colTitles = ["Todo", "In Progress", "Done"];
  const colColors = [C.textMuted, C.wallfacer, C.success];

  return (
    <div style={{ position: "relative", width: COL_W * 3 + COL_GAP * 2, height: "100%" }}>
      {/* Column backgrounds */}
      {[0, 1, 2].map(col => (
        <div key={col} style={{
          position: "absolute",
          left: col * (COL_W + COL_GAP),
          top: 0,
          width: COL_W,
          bottom: 0,
          background: `${C.kanbanCol}88`,
          borderRadius: 8,
          border: `1px solid ${C.kanbanBorder}44`,
        }} />
      ))}

      {/* Column headers */}
      {[0, 1, 2].map(col => (
        <div key={col} style={{ position: "absolute", left: col * (COL_W + COL_GAP) + 8, top: 8 }}>
          <KanbanColumnHeader title={colTitles[col]} count={columnCards[col].length} x={0} color={colColors[col]} />
        </div>
      ))}

      {/* Cards */}
      {cards.map(card => {
        const x = card.progress * (COL_W + COL_GAP) + 8;
        const y = 36 + card.row * (CARD_H + CARD_GAP);
        const isActive = card.column === 1;
        return (
          <KanbanCard
            key={card.index}
            task={card}
            x={x}
            y={y}
            isActive={isActive}
            glowColor={card.color}
          />
        );
      })}
    </div>
  );
};

// Activity feed events
function getActivityEvents(frame) {
  const events = [];
  TASKS.forEach((task, i) => {
    const startFrame = ASSEMBLY_START + i * TASK_INTERVAL;
    const doneFrame = startFrame + TASK_DURATION;
    events.push({ frame: startFrame, agent: "soph0n", color: C.soph0n, text: `Starting ${task.id}: ${task.label}...` });
    events.push({ frame: startFrame + 18, agent: "wallfacer", color: C.wallfacer, text: `PR #${task.pr}: reviewing...` });
    events.push({ frame: doneFrame + 5, agent: "logician", color: C.logician, text: `PR #${task.pr} merged ✓`, isMerge: true });
  });
  return events.filter(e => e.frame <= frame).slice(-6);
}

function getCurrentTestCount(frame) {
  for (let i = TASKS.length - 1; i >= 0; i--) {
    const doneFrame = ASSEMBLY_START + i * TASK_INTERVAL + TASK_DURATION + 12;
    if (frame >= doneFrame) return TEST_COUNTS[i];
  }
  return 0;
}

function getCurrentMilestone(frame) {
  // M1 done after task 3, M2 after 6, M3 after 9, M4 after 12, M5 after 15
  const milestoneEnds = [3, 6, 9, 12, 15];
  let current = 1;
  for (let i = 0; i < milestoneEnds.length; i++) {
    const taskDone = ASSEMBLY_START + milestoneEnds[i] * TASK_INTERVAL + TASK_DURATION + 12;
    if (frame >= taskDone) current = i + 2;
  }
  return Math.min(current, 5);
}

function getPRsMerged(frame) {
  let count = 0;
  TASKS.forEach((_, i) => {
    const doneFrame = ASSEMBLY_START + i * TASK_INTERVAL + TASK_DURATION + 12;
    if (frame >= doneFrame) count++;
  });
  return count;
}

const ActivityFeedItem = ({ event, index }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "4px 0", opacity: 1 - index * 0.08 }}>
    <div style={{ width: 6, height: 6, borderRadius: 3, background: event.color, marginTop: 6, flexShrink: 0 }} />
    <div>
      <span style={{ ...S.mono, fontSize: 11, fontWeight: 600, color: event.color }}>{event.agent}</span>
      <span style={{ ...S.mono, fontSize: 12, color: event.isMerge ? C.success : C.textDim, marginLeft: 6 }}>{event.text}</span>
    </div>
  </div>
);

const TestBar = ({ count, total }) => {
  const pct = (count / total) * 100;
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ ...S.mono, fontSize: 12, color: C.textMuted }}>Tests</span>
        <span style={{ ...S.mono, fontSize: 13, fontWeight: 700, color: count > 0 ? C.success : C.textMuted }}>{count}/{total}</span>
      </div>
      <div style={{ height: 6, background: C.kanbanBorder, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, #22c55e)`, borderRadius: 3 }} />
      </div>
    </div>
  );
};

const PRCounter = ({ count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill={C.ghMerge}><path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8-9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.25 4a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></svg>
    <span style={{ ...S.mono, fontSize: 13, color: C.ghMerge, fontWeight: 600 }}>{count} PRs merged</span>
  </div>
);

const MilestoneBar = ({ current }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 8px" }}>
    {[1, 2, 3, 4, 5].map(n => {
      const isDone = n < current;
      const isActive = n === current;
      const color = MILESTONE_COLORS[n];
      return (
        <div key={n} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: isActive ? 110 : 90,
            height: 28,
            borderRadius: 14,
            background: isDone ? `${color}30` : isActive ? `${color}20` : `${C.textMuted}10`,
            border: `1.5px solid ${isDone ? color + "66" : isActive ? color : C.textMuted + "33"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}>
            {isDone && <span style={{ color, fontSize: 12, fontWeight: 700 }}>✓</span>}
            <span style={{ ...S.sans, fontSize: 11, fontWeight: 700, color: isDone || isActive ? color : C.textMuted }}>M{n}</span>
            {isActive && <span style={{ ...S.sans, fontSize: 10, color }}>{MILESTONE_NAMES[n]}</span>}
          </div>
          {n < 5 && <div style={{ width: 16, height: 1.5, background: isDone ? `${color}44` : `${C.textMuted}22` }} />}
        </div>
      );
    })}
  </div>
);

const SceneAssembly = () => {
  const frame = useCurrentFrame();
  if (frame < SCENE.assembly.start || frame >= SCENE.assembly.end + 20) return null;
  const fadeIn = interpolate(frame, [SCENE.assembly.start, SCENE.assembly.start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = frame > SCENE.assembly.end ? interpolate(frame, [SCENE.assembly.end, SCENE.assembly.end + 20], [1, 0], { extrapolateRight: "clamp" }) : 1;

  const events = getActivityEvents(frame);
  const testCount = getCurrentTestCount(frame);
  const milestone = getCurrentMilestone(frame);
  const prCount = getPRsMerged(frame);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut, display: "flex", flexDirection: "column" }}>
      {/* Milestone bar */}
      <div style={{ padding: "20px 60px 12px", display: "flex", justifyContent: "center" }}>
        <MilestoneBar current={milestone} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", padding: "0 60px 20px", gap: 32, minHeight: 0 }}>
        {/* Left: Kanban Board */}
        <div style={{ flex: "0 0 680px" }}>
          <div style={{ ...S.sans, fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Project Board</div>
          <div style={{ background: C.kanbanBg, borderRadius: 10, border: `1px solid ${C.kanbanBorder}`, padding: 12, height: 860 }}>
            <KanbanBoard />
          </div>
        </div>

        {/* Right: Activity Feed */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Agent Activity */}
          <div style={{ flex: 1 }}>
            <div style={{ ...S.sans, fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Agent Activity</div>
            <div style={{ background: C.kanbanBg, borderRadius: 10, border: `1px solid ${C.kanbanBorder}`, padding: 14, minHeight: 200 }}>
              {/* Agent status indicators */}
              <div style={{ display: "flex", gap: 16, marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${C.kanbanBorder}` }}>
                {[
                  { name: "Logician", color: C.logician, role: "orchestrating" },
                  { name: "Soph0n", color: C.soph0n, role: "coding" },
                  { name: "Wallfacer", color: C.wallfacer, role: "reviewing" },
                ].map(a => (
                  <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <PulsingDot color={a.color} frame={frame} />
                    <span style={{ ...S.mono, fontSize: 11, fontWeight: 600, color: a.color }}>{a.name}</span>
                  </div>
                ))}
              </div>

              {/* Events */}
              {events.map((event, i) => (
                <ActivityFeedItem key={`${event.frame}-${event.agent}`} event={event} index={i} />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: C.kanbanBg, borderRadius: 10, border: `1px solid ${C.kanbanBorder}`, padding: 14 }}>
            <TestBar count={testCount} total={177} />
            <PRCounter count={prCount} />
          </div>

          {/* Code snippet peek */}
          <div style={{ background: C.termBg, borderRadius: 10, border: `1px solid ${C.termBorder}`, padding: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "#ff5f56" }} />
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "#ffbd2e" }} />
              <div style={{ width: 8, height: 8, borderRadius: 4, background: "#27c93f" }} />
              <span style={{ ...S.mono, fontSize: 11, color: C.textMuted, marginLeft: 8 }}>Terminal</span>
            </div>
            <TerminalOutput frame={frame} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PulsingDot = ({ color, frame }) => {
  const pulse = Math.sin(frame * 0.15) * 0.3 + 0.7;
  return (
    <div style={{ position: "relative", width: 8, height: 8 }}>
      <div style={{ position: "absolute", inset: -3, borderRadius: 7, background: `${color}22`, opacity: pulse }} />
      <div style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
    </div>
  );
};

const TerminalOutput = ({ frame }) => {
  // Show current task being worked on
  const currentTaskIdx = Math.floor((frame - ASSEMBLY_START) / TASK_INTERVAL);
  const task = TASKS[Math.max(0, Math.min(currentTaskIdx, TASKS.length - 1))];
  const progress = getCardProgress(Math.max(0, Math.min(currentTaskIdx, TASKS.length - 1)), frame);
  const isWorking = progress >= 0.5 && progress < 1.8;

  return (
    <div style={{ ...S.mono, fontSize: 12, lineHeight: 1.6, color: C.textDim }}>
      <div><span style={{ color: C.textMuted }}>$</span> <span style={{ color: C.text }}>pnpm test --run</span></div>
      {isWorking && (
        <>
          <div style={{ color: C.soph0n }}>  PASS <span style={{ color: C.textDim }}>src/__tests__/{task.id.toLowerCase().replace(".", "-")}.test.tsx</span></div>
          <div style={{ color: C.textMuted }}>  {getCurrentTestCount(frame)} tests passing...</div>
        </>
      )}
      <div><span style={{ color: C.textMuted }}>$</span> <span style={{ color: C.text }}>git push origin feat/{task.id.toLowerCase().replace(".", "-")}-{task.label.toLowerCase().replace(/\s+/g, "-")}</span></div>
    </div>
  );
};

// ─── Scene 4: The Results ───────────────────────────────────────────────────
const StatItem = ({ number, label, color, delay }) => (
  <ScaleIn delay={delay} style={{ textAlign: "center" }}>
    <div style={{ ...S.sans, fontSize: 56, fontWeight: 800, color, letterSpacing: -2 }}>{number}</div>
    <div style={{ ...S.sans, fontSize: 16, fontWeight: 500, color: C.textDim, marginTop: 4 }}>{label}</div>
  </ScaleIn>
);

const SceneResults = () => {
  const frame = useCurrentFrame();
  if (frame < SCENE.results.start || frame >= SCENE.results.end + 20) return null;
  const fadeIn = interpolate(frame, [SCENE.results.start, SCENE.results.start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = frame > SCENE.results.end ? interpolate(frame, [SCENE.results.end, SCENE.results.end + 20], [1, 0], { extrapolateRight: "clamp" }) : 1;
  const d = SCENE.results.start;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeIn * fadeOut, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>
      <FadeIn delay={d} duration={10}>
        <div style={{ ...S.sans, fontSize: 14, fontWeight: 600, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase" }}>From one message to production</div>
      </FadeIn>

      <div style={{ display: "flex", gap: 64 }}>
        <StatItem number="1" label="Human Message" color={C.white} delay={d + 15} />
        <StatItem number="3" label="AI Agents" color={C.accent} delay={d + 25} />
        <StatItem number="17" label="PRs Merged" color={C.ghMerge} delay={d + 35} />
        <StatItem number="177" label="Tests Passing" color={C.success} delay={d + 45} />
      </div>

      <div style={{ display: "flex", gap: 64 }}>
        <StatItem number="5" label="Milestones" color={C.m2} delay={d + 55} />
        <StatItem number="~4h" label="Start to Finish" color={C.wallfacer} delay={d + 65} />
      </div>

      {/* Agent lineup */}
      <FadeIn delay={d + 80} duration={10}>
        <div style={{ display: "flex", gap: 40, marginTop: 8 }}>
          {[
            { name: "Logician", role: "Architect · PM", color: C.logician },
            { name: "Soph0n", role: "Developer", color: C.soph0n },
            { name: "Wallfacer", role: "Code Reviewer", color: C.wallfacer },
          ].map(a => (
            <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: `${a.color}22`, border: `2px solid ${a.color}`, display: "flex", alignItems: "center", justifyContent: "center", ...S.sans, fontSize: 16, fontWeight: 700, color: a.color }}>{a.name[0]}</div>
              <div>
                <div style={{ ...S.sans, fontSize: 15, fontWeight: 700, color: a.color }}>{a.name}</div>
                <div style={{ ...S.sans, fontSize: 12, color: C.textMuted }}>{a.role}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
};

// ─── Scene 5: The Product ───────────────────────────────────────────────────
const BrowserChrome = ({ url, children }) => (
  <div style={{ borderRadius: 12, border: `1px solid ${C.termBorder}`, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.5)", height: "100%" }}>
    {/* Browser bar */}
    <div style={{ height: 40, background: C.termBar, borderBottom: `1px solid ${C.termBorder}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
      <div style={{ flex: 1, margin: "0 12px", height: 26, borderRadius: 6, background: `${C.textMuted}15`, display: "flex", alignItems: "center", padding: "0 12px" }}>
        <span style={{ ...S.sans, fontSize: 13, color: C.textMuted }}>{url}</span>
      </div>
    </div>
    <div style={{ background: "#faf7f2", height: "calc(100% - 40px)", overflow: "hidden" }}>{children}</div>
  </div>
);

const BeanAndBrewMockup = ({ frame, baseDelay }) => {
  const d = baseDelay;
  return (
    <div style={{ padding: 0, height: "100%" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #3d2b1f 0%, #5c3d2e 50%, #4a3728 100%)", padding: "60px 80px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <FadeIn delay={d + 5} duration={12}>
          <div style={{ ...S.sans, fontSize: 18, fontWeight: 600, color: "#d4a574", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Artisan Coffee, Delivered</div>
        </FadeIn>
        <FadeIn delay={d + 15} duration={12}>
          <div style={{ ...S.sans, fontSize: 52, fontWeight: 800, color: "#faf7f2", lineHeight: 1.15, maxWidth: 600 }}>Discover Your Perfect Brew</div>
        </FadeIn>
        <FadeIn delay={d + 25} duration={12}>
          <div style={{ ...S.sans, fontSize: 18, color: "#c4a882", lineHeight: 1.6, maxWidth: 500, marginTop: 16 }}>Hand-selected beans from world-class roasters. Freshly roasted and shipped to your door.</div>
        </FadeIn>
        <FadeIn delay={d + 35} duration={10}>
          <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
            <div style={{ ...S.sans, fontSize: 16, fontWeight: 700, color: "#3d2b1f", background: "#d4a574", padding: "14px 32px", borderRadius: 8 }}>Shop Now</div>
            <div style={{ ...S.sans, fontSize: 16, fontWeight: 600, color: "#d4a574", border: "2px solid #d4a574", padding: "14px 32px", borderRadius: 8 }}>Learn More</div>
          </div>
        </FadeIn>

        {/* Product cards preview */}
        <FadeIn delay={d + 50} duration={12}>
          <div style={{ display: "flex", gap: 20, marginTop: 48 }}>
            {["Ethiopian Yirgacheffe", "Colombia Supremo", "Kenya AA", "Guatemala Antigua"].map((name, i) => (
              <div key={i} style={{ width: 180, background: "rgba(250,247,242,0.08)", borderRadius: 10, padding: 16, border: "1px solid rgba(212,165,116,0.2)" }}>
                <div style={{ width: "100%", height: 100, background: "rgba(212,165,116,0.15)", borderRadius: 6, marginBottom: 10 }} />
                <div style={{ ...S.sans, fontSize: 13, fontWeight: 600, color: "#faf7f2" }}>{name}</div>
                <div style={{ ...S.sans, fontSize: 12, color: "#c4a882", marginTop: 4 }}>From $14.99</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

const SceneProduct = () => {
  const frame = useCurrentFrame();
  if (frame < SCENE.product.start) return null;
  const fadeIn = interpolate(frame, [SCENE.product.start, SCENE.product.start + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = SCENE.product.start;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeIn, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 80px" }}>
      <FadeIn delay={d} duration={8}>
        <div style={{ ...S.sans, fontSize: 14, fontWeight: 600, color: C.textMuted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 20, textAlign: "center" }}>The Result</div>
      </FadeIn>
      <div style={{ width: "100%", maxWidth: 1200, height: 700 }}>
        <ScaleIn delay={d + 5}>
          <BrowserChrome url="bean-and-brew.vercel.app">
            <BeanAndBrewMockup frame={frame} baseDelay={d + 10} />
          </BrowserChrome>
        </ScaleIn>
      </div>

      {/* End tagline */}
      <FadeIn delay={d + 100} duration={15} style={{ marginTop: 24, textAlign: "center" }}>
        <span style={{ ...S.sans, fontSize: 20, fontWeight: 600, color: C.accent }}>Trisol</span>
        <span style={{ ...S.sans, fontSize: 16, color: C.textMuted, marginLeft: 12 }}>Multi-agent development, orchestrated.</span>
      </FadeIn>
    </div>
  );
};

// ─── Main Composition ───────────────────────────────────────────────────────
export const BeanAndBrewShowcase = () => {
  return (
    <AbsoluteFill>
      <Background />
      <ScenePrompt />
      <SceneArchitect />
      <SceneAssembly />
      <SceneResults />
      <SceneProduct />
      <BottomProgressBar />
    </AbsoluteFill>
  );
};
