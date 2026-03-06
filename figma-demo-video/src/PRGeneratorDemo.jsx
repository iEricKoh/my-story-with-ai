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
  jiraBlue: "#2684ff",
  slackPurple: "#e01e5a",
  gitOrange: "#f78166",
  success: "#22c55e",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  border: "#2a2a3a",
  white: "#ffffff",
  cyan: "#00ffcc",
  // GitHub Light theme
  ghBg: "#ffffff",
  ghBorder: "#d0d7de",
  ghText: "#1f2328",
  ghTextDim: "#656d76",
  ghLink: "#0969da",
  ghGreen: "#1a7f37",
  ghGreenBg: "#dafbe1",
  ghRedText: "#d1242f",
  ghLabel: "#0969da",
  ghHeaderBg: "#f6f8fa",
  ghCodeBg: "rgba(175,184,193,0.2)",
};

const S = {
  mono: { fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace" },
  sans: { fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif" },
};

// ─── Animation helpers ──────────────────────────────────────────────────────

const FadeIn = ({ children, delay = 0, duration = 8, style = {} }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, frame - delay);
  const opacity = interpolate(p, [0, duration], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(p, [0, duration], [8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
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

const BottomProgressBar = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [0, totalFrames], [0, 100], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `${C.border}44` }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, ${C.cyan})`, borderRadius: "0 2px 2px 0" }} />
    </div>
  );
};

// ─── Claude Code Terminal (compact) ─────────────────────────────────────────

const ClaudeTerminal = ({ children, opacity = 1, style: extraStyle = {} }) => (
  <div style={{ opacity, borderRadius: 12, border: `1px solid ${C.termBorder}`, background: C.termBg, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.6)", ...extraStyle }}>
    <div style={{ height: 36, background: C.termBar, borderBottom: `1px solid ${C.termBorder}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 7, flexShrink: 0 }}>
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e" }} />
      <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f" }} />
      <div style={{ flex: 1, textAlign: "center", ...S.mono, fontSize: 18, color: C.textMuted }}>Claude Code</div>
    </div>
    <div style={{ padding: "8px 24px", borderBottom: `1px solid ${C.termBorder}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
      <span style={{ color: C.accent, fontSize: 22 }}>✻</span>
      <span style={{ ...S.mono, fontSize: 18, fontWeight: 700, color: C.text }}>Claude Code</span>
      <span style={{ color: C.textMuted, fontSize: 14 }}>│</span>
      <span style={{ ...S.mono, fontSize: 16, color: C.textDim }}>ecjs</span>
      <span style={{ ...S.mono, fontSize: 14, color: C.textMuted, background: `${C.textMuted}15`, padding: "1px 5px", borderRadius: 3 }}>MDX-12272-delay-cancel-btn</span>
    </div>
    <div style={{ padding: "14px 24px", overflow: "hidden", flex: 1 }}>{children}</div>
  </div>
);

const TermLine = ({ children, delay = 0, duration = 6, style = {} }) => (
  <FadeIn delay={delay} duration={duration}>
    <div style={{ ...S.mono, fontSize: 20, lineHeight: 1.5, whiteSpace: "pre-wrap", ...style }}>{children}</div>
  </FadeIn>
);

// ─── Agent Row ──────────────────────────────────────────────────────────────

const AgentRow = ({ name, icon, color, status, detail, delay = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 110 } });
  const t = Math.max(0, frame - delay);
  const spinAngle = t * 8;
  return (
    <div style={{ opacity: Math.min(s * 2, 1), transform: `translateX(${(1 - Math.min(s, 1)) * 20}px)`, display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
      <div style={{ width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {status === "done"
          ? <span style={{ color: C.success, fontSize: 18, fontWeight: 700 }}>✓</span>
          : <div style={{ width: 16, height: 16, border: "2px solid transparent", borderTopColor: color, borderRightColor: color, borderRadius: "50%", transform: `rotate(${spinAngle}deg)` }} />
        }
      </div>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ ...S.mono, fontSize: 18, fontWeight: 600, color: status === "done" ? C.success : color }}>{name}</span>
      <span style={{ ...S.mono, fontSize: 16, color: C.textDim }}>{detail}</span>
      {status === "done" && <span style={{ ...S.mono, fontSize: 14, color: C.textMuted, marginLeft: "auto" }}>{name === "Git" ? "45s" : name === "Jira" ? "54s" : "77s"}</span>}
    </div>
  );
};

// ─── GitHub PR Preview (Light Theme) ────────────────────────────────────────

const GHCode = ({ children }) => (
  <code style={{ ...S.mono, fontSize: 18, color: C.ghText, background: C.ghCodeBg, padding: "2px 7px", borderRadius: 5 }}>{children}</code>
);

const GHSection = ({ title, children, delay = 0 }) => (
  <FadeIn delay={delay} duration={10}>
    <div style={{ marginBottom: 18 }}>
      <div style={{ ...S.sans, fontSize: 26, fontWeight: 600, color: C.ghText, paddingBottom: 8, borderBottom: `1px solid ${C.ghBorder}`, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  </FadeIn>
);

const GHText = ({ children, size = 20 }) => (
  <div style={{ ...S.sans, fontSize: size, color: C.ghText, lineHeight: 1.65 }}>{children}</div>
);

const GHBullet = ({ bold, text }) => (
  <div style={{ ...S.sans, fontSize: 19, color: C.ghText, lineHeight: 1.7, paddingLeft: 6, display: "flex", gap: 8 }}>
    <span style={{ color: C.ghTextDim }}>•</span>
    <span><strong>{bold}</strong>{text ? `: ${text}` : ""}</span>
  </div>
);

const GHLink = ({ children }) => (
  <span style={{ color: C.ghLink, textDecoration: "underline" }}>{children}</span>
);

const GHBulletRich = ({ bold, children }) => (
  <div style={{ ...S.sans, fontSize: 19, color: C.ghText, lineHeight: 1.7, paddingLeft: 6, display: "flex", gap: 8 }}>
    <span style={{ color: C.ghTextDim }}>•</span>
    <span><strong>{bold}</strong>: {children}</span>
  </div>
);

const GHNumberedItem = ({ num, text }) => (
  <div style={{ ...S.sans, fontSize: 19, color: C.ghText, lineHeight: 1.7, paddingLeft: 6, display: "flex", gap: 8 }}>
    <span style={{ color: C.ghTextDim, minWidth: 18 }}>{num}.</span>
    <span>{text}</span>
  </div>
);

const GitHubPRPreview = ({ delay = 0, scrollOffset = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 16, stiffness: 90 } });
  const d = delay;

  return (
    <div style={{
      opacity: Math.min(s * 2, 1),
      transform: `scale(${0.95 + s * 0.05})`,
      position: "absolute",
      top: 36, left: 60, right: 60, bottom: 36,
      borderRadius: 12,
      border: `1px solid ${C.ghBorder}`,
      background: C.ghBg,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
    }}>
      {/* PR header */}
      <div style={{ padding: "16px 32px", borderBottom: `1px solid ${C.ghBorder}`, background: C.ghHeaderBg, display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
        <svg width="26" height="26" viewBox="0 0 16 16" fill={C.ghGreen}>
          <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
        </svg>
        <span style={{ ...S.sans, fontSize: 24, fontWeight: 700, color: C.ghText }}>
          [MDX-12272] feat(mcd/mop): add delay cancellation cancel button
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ ...S.sans, fontSize: 16, fontWeight: 600, color: C.white, background: C.ghGreen, padding: "3px 10px", borderRadius: 12 }}>Open</span>
          <span style={{ ...S.sans, fontSize: 16, fontWeight: 600, color: C.ghTextDim, background: C.ghCodeBg, padding: "3px 10px", borderRadius: 12, border: `1px solid ${C.ghBorder}` }}>Draft</span>
        </div>
      </div>

      {/* Metadata bar */}
      <div style={{ padding: "10px 32px", borderBottom: `1px solid ${C.ghBorder}`, display: "flex", alignItems: "center", gap: 16, ...S.sans, fontSize: 17, color: C.ghTextDim, flexShrink: 0 }}>
        <span><strong style={{ color: C.ghText }}>iEricKoh</strong> wants to merge into <GHCode>master</GHCode> from <GHCode>MDX-12272-delay-cancel-btn</GHCode></span>
        <span style={{ marginLeft: "auto" }}>23 files changed</span>
        <span style={{ color: C.ghGreen, fontWeight: 600 }}>+1,701</span>
        <span style={{ color: C.ghRedText, fontWeight: 600 }}>-232</span>
      </div>

      {/* Markdown body */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ padding: "24px 40px", transform: `translateY(${-scrollOffset}px)` }}>

          <GHSection title="Type of change" delay={d + 3}>
            <GHText>Feature</GHText>
          </GHSection>

          <GHSection title="Description" delay={d + 6}>
            <GHText>
              When a delivery is running 20+ min late, we show the cancel button again so the user can bail out.
              We poll anyCarry every 30s to check if the order qualifies, and after the user cancels,
              we double-check with <GHCode>GetDeliveryCancelledOrder</GHCode> to make sure it actually went through.
            </GHText>
          </GHSection>

          <GHSection title="What's new" delay={d + 12}>
            <GHBullet bold="AdmsService.isEligibleForDelayCancellation" text="hits anyCarry's API — returns false on error" />
            <GHBullet bold="useIsEligibleForDelayCancellation hook" text="polls every 30s, gated by DS_APPROACHING_STORE" />
            <GHBullet bold="useCancelOrderWithConfirmation hook" text="pulled out of Progress.tsx so both cancel flows share the same confirm → cancel → redirect logic" />
            <GHBullet bold="DelayCancellationNote component" text="owns the whole thing — checks eligibility and renders the cancel button" />
            <GHBullet bold="CancelFailed error prompt" text="shows a specific cancel failure message instead of the generic 'Unexpected Error'" />
            <GHBullet bold="Cancel verification" text="after cancelling, polls GetDeliveryCancelledOrder to confirm it actually worked" />
          </GHSection>

          <GHSection title="Implementation Details" delay={d + 18}>
            <GHText size={19}>The cancel button shows up when three things are all true:</GHText>
            <GHNumberedItem num={1} text="Delivery status is DS_APPROACHING_STORE" />
            <GHNumberedItem num={2} text="Backend says is_cancel_allowed (not wired up yet — waiting on MDX-12274)" />
            <GHNumberedItem num={3} text="anyCarry says redisplay_cancel_button: true" />
            <div style={{ height: 8 }} />
            <GHText size={19}>Right now only 1 and 3 are wired up. Condition 2 has TODOs in the code.</GHText>
            <div style={{ height: 6 }} />
            <GHText size={19}>
              When the user taps cancel, we re-check with MDAS first — if the driver picked up the order in the last 30s,
              we show a "sorry, too late" popup instead of cancelling.
            </GHText>
          </GHSection>

          <GHSection title="Ticket" delay={d + 24}>
            <div style={{ ...S.sans, fontSize: 20 }}>
              <span style={{ color: C.ghLink, textDecoration: "underline" }}>MDX-12272</span>
            </div>
          </GHSection>

          <GHSection title="Design" delay={d + 27}>
            <GHBullet bold="JMA cancel button / cancel flow" text="" />
            <div style={{ ...S.sans, fontSize: 19, color: C.ghLink, paddingLeft: 22, textDecoration: "underline" }}>Figma</div>
          </GHSection>

          <GHSection title="Notes" delay={d + 30}>
            <GHBulletRich bold="Backend not ready">is_cancel_allowed from MBE doesn't exist yet (<GHLink>MDX-12274</GHLink>). Stubbed with TODOs for now.</GHBulletRich>
            <GHBulletRich bold="anyCarry API was 404">as of 2/24 it wasn't live. Use force_redisplay=true in dev to test.</GHBulletRich>
            <GHBulletRich bold="Scope got bigger">originally just batched orders, but the batching flag turned out to be unreliable, so it now covers all UberEats 3PR orders.</GHBulletRich>
            <GHBulletRich bold="Refactor commits">fetchWithAuth extraction, useCancelOrderWithConfirmation extraction, isCancelledStatus helper, and cancel error message improvement — all pure refactors, just prep work.</GHBulletRich>
            <GHBulletRich bold="Requirements"><GHLink>MDI-547</GHLink> · <GHLink>System design</GHLink></GHBulletRich>
            <GHBulletRich bold="Slack threads"><GHLink>#mcd-delivery-cn technical discussion</GHLink> · <GHLink>#mcd-delivery coordination</GHLink></GHBulletRich>
          </GHSection>
        </div>
      </div>
    </div>
  );
};

// ─── Main composition ───────────────────────────────────────────────────────
//
// SCENE 1 (0–330): Terminal — command, parallel agents, completion
// SCENE 2 (330–900): GitHub PR preview (light theme) — sections stagger in, then scroll

export const PRGeneratorDemo = () => {
  const frame = useCurrentFrame();
  const TOTAL = 900;

  const gitDone = frame >= 170;
  const jiraDone = frame >= 210;
  const slackDone = frame >= 260;

  const scene1Opacity = frame < 310 ? 1 : interpolate(frame, [310, 340], [1, 0], { extrapolateRight: "clamp" });
  const showScene2 = frame >= 330;

  const scrollOffset = frame >= 380
    ? interpolate(frame, [380, 500], [0, 420], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill>
      <Background />

      {/* SCENE 1: Terminal (full-screen) */}
      {frame < 350 && (
        <div style={{ position: "absolute", top: 36, left: 60, right: 60, bottom: 36, opacity: scene1Opacity }}>
          <ClaudeTerminal style={{ height: "100%" }}>
            <TermLine delay={0} style={{ marginBottom: 6 }}>
              <span style={{ color: C.textMuted }}>❯ </span>
              <Typewriter text="/mcd-pr MDX-12272" delay={5} charFrames={2} color={C.text} />
            </TermLine>

            <TermLine delay={40} style={{ marginBottom: 10 }}>
              <span style={{ color: C.accent }}>● </span>
              <span style={{ color: C.text }}>Launching 3 agents in parallel...</span>
            </TermLine>

            <FadeIn delay={60} duration={6}>
              <div style={{ marginBottom: 10 }}>
                <AgentRow name="Jira" icon="📋" color={C.jiraBlue} status={jiraDone ? "done" : "running"} detail={jiraDone ? "MDX-12272 → MDX-11807 → MDI-547" : "ticket + parent + requirements..."} delay={65} />
                <AgentRow name="Git" icon="🔀" color={C.gitOrange} status={gitDone ? "done" : "running"} detail={gitDone ? "23 files · +1,701 / -232 · 10 commits" : "PR #5413 — diff, commits..."} delay={72} />
                <AgentRow name="Slack" icon="💬" color={C.slackPurple} status={slackDone ? "done" : "running"} detail={slackDone ? "#mcd-delivery-cn · #mcd-delivery" : "searching in:mcd- ..."} delay={79} />
              </div>
            </FadeIn>

            <TermLine delay={270} style={{ marginBottom: 6 }}>
              <span style={{ color: C.success }}>✓ </span>
              <span style={{ color: C.text, fontWeight: 700 }}>All context gathered </span>
              <span style={{ color: C.textMuted }}>— ~77s wall time</span>
            </TermLine>

            <TermLine delay={290}>
              <span style={{ color: C.accent }}>● </span>
              <span style={{ color: C.text }}>Generating PR title + description...</span>
            </TermLine>
          </ClaudeTerminal>
        </div>
      )}

      {/* SCENE 2: GitHub PR Preview (light theme) */}
      {showScene2 && <GitHubPRPreview delay={335} scrollOffset={scrollOffset} />}

      <BottomProgressBar totalFrames={TOTAL} />
    </AbsoluteFill>
  );
};
