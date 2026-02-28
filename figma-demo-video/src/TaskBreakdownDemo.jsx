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
  accentDim: "#00cf8344",
  scout: "#a855f7",
  architect: "#3b82f6",
  jiraBlue: "#2684ff",
  warn: "#f59e0b",
  red: "#ef4444",
  success: "#22c55e",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  border: "#2a2a3a",
  white: "#ffffff",
};

// ─── Fonts ──────────────────────────────────────────────────────────────────
const S = {
  mono: { fontFamily: "'SF Mono', 'Fira Code', Consolas, monospace" },
  sans: { fontFamily: "'Inter', 'SF Pro Display', sans-serif" },
};

// ─── Animation helpers ──────────────────────────────────────────────────────

const FadeIn = ({ children, delay = 0, duration = 8, style = {} }) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, frame - delay);
  const opacity = interpolate(p, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(p, [0, duration], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
};

const ScaleIn = ({ children, delay = 0, style = {} }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  return (
    <div
      style={{
        opacity: Math.min(s * 2, 1),
        transform: `scale(${s})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const PulseGlow = ({ color, delay = 0, size = 8 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const pulse = Math.sin(t * 0.15) * 0.3 + 0.7;
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 ${8 * pulse}px ${color}`,
        opacity: pulse,
        marginRight: 6,
      }}
    />
  );
};

// ─── Claude Code terminal ───────────────────────────────────────────────────

const ClaudeCodeWindow = ({ children, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      top: 36,
      left: 60,
      right: 60,
      bottom: 36,
      opacity,
      borderRadius: 12,
      border: `1px solid ${C.termBorder}`,
      background: C.termBg,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: `0 25px 80px rgba(0,0,0,0.6), 0 0 1px ${C.termBorder}`,
    }}
  >
    {/* macOS title bar */}
    <div
      style={{
        height: 40,
        background: C.termBar,
        borderBottom: `1px solid ${C.termBorder}`,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#ff5f56",
        }}
      />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#ffbd2e",
        }}
      />
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "#27c93f",
        }}
      />
      <div
        style={{
          flex: 1,
          textAlign: "center",
          ...S.mono,
          fontSize: 24,
          color: C.textMuted,
        }}
      >
        Claude Code
      </div>
    </div>
    {/* Claude Code header bar */}
    <div
      style={{
        padding: "10px 36px",
        borderBottom: `1px solid ${C.termBorder}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
      }}
    >
      <span style={{ color: C.accent, fontSize: 28 }}>✻</span>
      <span
        style={{ ...S.mono, fontSize: 24, fontWeight: 700, color: C.text }}
      >
        Claude Code
      </span>
      <span style={{ color: C.textMuted, fontSize: 16 }}>│</span>
      <span style={{ ...S.mono, fontSize: 22, color: C.textDim }}>
        ecjs
      </span>
      <span
        style={{
          ...S.mono,
          fontSize: 20,
          color: C.textMuted,
          background: `${C.textMuted}15`,
          padding: "2px 6px",
          borderRadius: 4,
        }}
      >
        mcd-skill
      </span>
    </div>
    {/* Content area */}
    <div
      style={{
        flex: 1,
        padding: "20px 36px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

const TermLine = ({ children, delay = 0, duration = 6, style = {} }) => (
  <FadeIn delay={delay} duration={duration}>
    <div
      style={{
        ...S.mono,
        fontSize: 28,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {children}
    </div>
  </FadeIn>
);

const PhaseIndicator = ({ phase, title, delay = 0 }) => (
  <TermLine delay={delay} style={{ marginTop: 6, marginBottom: 4 }}>
    <span style={{ color: C.accent }}>● </span>
    <span style={{ color: C.text, fontWeight: 700 }}>
      Phase {phase}
    </span>
    <span style={{ color: C.textMuted }}> — </span>
    <span style={{ color: C.text }}>{title}</span>
  </TermLine>
);

const TermGap = ({ height = 6 }) => <div style={{ height }} />;

const Typewriter = ({
  text,
  delay = 0,
  charFrames = 1.5,
  color = C.accent,
}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const chars = Math.min(Math.floor(t / charFrames), text.length);
  const cursorBlink = Math.floor(t / 15) % 2 === 0;
  return (
    <span>
      <span style={{ color }}>{text.slice(0, chars)}</span>
      {chars < text.length && (
        <span style={{ color: C.accent, opacity: cursorBlink ? 1 : 0.3 }}>
          █
        </span>
      )}
    </span>
  );
};

/** Animated estimate change — old value strikes through, new springs in */
const CalibratedEst = ({ oldEst, newEst, triggerFrame, direction }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const triggered = frame >= triggerFrame;
  const s = triggered
    ? spring({
        frame: frame - triggerFrame,
        fps,
        config: { damping: 12, stiffness: 120 },
      })
    : 0;
  const color = direction === "down" ? C.success : C.warn;
  const arrow = direction === "down" ? "↓" : "↑";
  return (
    <>
      <span
        style={{
          color: triggered ? C.textMuted : C.accent,
          textDecoration: triggered ? "line-through" : "none",
          textDecorationColor: C.red,
        }}
      >
        {oldEst}
      </span>
      <span
        style={{
          opacity: s,
          display: "inline-block",
          transform: `scale(${Math.min(s, 1)})`,
          transformOrigin: "left center",
        }}
      >
        <span style={{ color, fontWeight: 700 }}> {newEst} </span>
        <span style={{ color }}>{arrow}</span>
      </span>
    </>
  );
};

// ─── Visual components ──────────────────────────────────────────────────────

const Background = () => {
  const frame = useCurrentFrame();
  const shift = Math.sin(frame * 0.005) * 2;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 30%, #1a1040 0%, ${C.bg} 70%), ${C.bg}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${C.border}15 1px, transparent 1px), linear-gradient(90deg, ${C.border}15 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          transform: `translateY(${shift}px)`,
          opacity: 0.4,
        }}
      />
    </div>
  );
};

const BottomProgressBar = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [0, totalFrames], [0, 100], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `${C.border}44`,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${C.scout})`,
          borderRadius: "0 2px 2px 0",
        }}
      />
    </div>
  );
};

const JiraTicket = ({ delay = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  return (
    <div
      style={{
        opacity: s,
        transform: `scale(${s})`,
        background: C.termBg,
        border: `1.5px solid ${C.termBorder}`,
        borderRadius: 14,
        padding: "36px 44px",
        maxWidth: 680,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            background: C.jiraBlue,
            color: C.white,
            ...S.mono,
            fontSize: 24,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 4,
          }}
        >
          MDX-11961
        </div>
        <div
          style={{
            background: "#22c55e22",
            color: C.success,
            ...S.mono,
            fontSize: 22,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Feature
        </div>
      </div>
      <div
        style={{
          ...S.sans,
          fontSize: 36,
          fontWeight: 700,
          color: C.text,
          marginBottom: 10,
          lineHeight: 1.3,
        }}
      >
        [Web] Implement Okihai (置き配) Delivery Option
      </div>
      <div
        style={{
          ...S.sans,
          fontSize: 26,
          color: C.textDim,
          lineHeight: 1.5,
        }}
      >
        Allow customers to select "leave at door" delivery for McDelivery
        orders. Requires UI toggle, order tracking updates, and MDAS
        integration.
      </div>
    </div>
  );
};

const ProgressRing = ({ percentage, delay = 0, size = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 20, stiffness: 40 },
  });
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - (percentage / 100) * progress);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.termBorder}
        strokeWidth={8}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.accent}
        strokeWidth={8}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 8px ${C.accentGlow})` }}
      />
    </svg>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═════════════════════════════════════════════════════════════════════════════

export const TaskBreakdownDemo = () => {
  const frame = useCurrentFrame();
  const totalFrames = 1110;

  // Scene boundaries
  const SCENES = {
    title: [0, 90],
    problem: [90, 180],
    gather: [180, 330],
    analysis: [330, 510],
    parallel: [510, 690],
    calibration: [690, 840],
    openspec: [840, 920],
    accuracy: [920, 1000],
    outro: [1000, 1110],
  };

  const inScene = (name) =>
    frame >= SCENES[name][0] && frame < SCENES[name][1];

  // Claude Code window visible across scenes gather → openspec
  const showCC = frame >= 180 && frame < 920;
  const ccOpacity = showCC
    ? interpolate(frame, [180, 195, 900, 920], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Visual scene fade helper
  const sceneFade = (start, duration) =>
    interpolate(
      frame,
      [start, start + 12, start + duration - 12, start + duration],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden", ...S.sans }}>
      <Background />

      {/* ── Scene 1: Title Card (0–89) ─────────────────────────────────── */}
      {inScene("title") && (
        <AbsoluteFill
          style={{
            opacity: sceneFade(0, 90),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScaleIn delay={6}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: C.white,
                textAlign: "center",
                lineHeight: 1.2,
                letterSpacing: -1,
              }}
            >
              Multi-Agent{" "}
              <span style={{ color: C.accent }}>Task Breakdown</span>
            </div>
          </ScaleIn>
          <FadeIn delay={20}>
            <div
              style={{
                fontSize: 20,
                color: C.textDim,
                textAlign: "center",
                marginTop: 18,
              }}
            >
              From Jira ticket to calibrated estimates in seconds
            </div>
          </FadeIn>
          <FadeIn delay={35}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 32,
              }}
            >
              {["Gather", "Analyze", "Scout", "Estimate", "Spec"].map(
                (step, i) => (
                  <div
                    key={step}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        ...S.mono,
                        fontSize: 22,
                        color: C.accent,
                        padding: "6px 14px",
                        border: `1px solid ${C.accentDim}`,
                        borderRadius: 20,
                        background: `${C.accent}11`,
                      }}
                    >
                      {step}
                    </div>
                    {i < 4 && (
                      <span style={{ color: C.textMuted, fontSize: 22 }}>
                        →
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          </FadeIn>
        </AbsoluteFill>
      )}

      {/* ── Scene 2: The Problem (90–179) ──────────────────────────────── */}
      {inScene("problem") && (
        <AbsoluteFill
          style={{
            opacity: sceneFade(90, 90),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
          }}
        >
          <JiraTicket delay={96} />
          <FadeIn delay={115}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 700,
                color: C.warn,
                textAlign: "center",
              }}
            >
              "How long will this take?"
            </div>
          </FadeIn>
        </AbsoluteFill>
      )}

      {/* ── Claude Code window (Scenes 3–7) ────────────────────────────── */}
      {showCC && (
        <ClaudeCodeWindow opacity={ccOpacity}>
          {/* ─── Gather (180–329) ──────────────────────────────────────── */}
          {inScene("gather") && (
            <div>
              {/* User input */}
              <TermLine delay={185}>
                <span style={{ color: C.accent, fontWeight: 700 }}>
                  {"› "}
                </span>
                <Typewriter
                  text="/mcd-task-breakdown MDX-11961"
                  delay={192}
                  charFrames={1.5}
                />
              </TermLine>
              <TermGap height={14} />

              <TermLine delay={240} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Gathering ticket context..."}
              </TermLine>
              <TermGap />
              <TermLine delay={258}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"MDX-11961: [Web] Implement Okihai (置き配) Delivery Option"}
                </span>
              </TermLine>
              <TermLine delay={266}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"Type: Feature"}</span>
                <span style={{ color: C.textMuted }}>{" │ "}</span>
                <span style={{ color: C.text }}>{"Status: To Do"}</span>
              </TermLine>
              <TermLine delay={274}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"Linked: MDI-547 (requirements)"}
                </span>
              </TermLine>
              <TermLine delay={282}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"Comments: 12"}</span>
                <span style={{ color: C.textMuted }}>{" │ "}</span>
                <span style={{ color: C.text }}>{"Sub-tasks: 0"}</span>
              </TermLine>
              <TermLine delay={290}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"Figma: delivery-options-v2 (3 screens)"}
                </span>
              </TermLine>
              <TermGap height={14} />
              <TermLine delay={308} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Analyzing requirements..."}
              </TermLine>
            </div>
          )}

          {/* ─── Analysis (330–509) ────────────────────────────────────── */}
          {inScene("analysis") && (
            <div>
              <PhaseIndicator
                phase={1}
                title="Requirements Analysis"
                delay={332}
              />
              <TermGap height={6} />
              <TermLine
                delay={342}
                style={{ color: C.text, fontWeight: 700 }}
              >
                {"  Scope (Web frontend)"}
              </TermLine>
              <TermGap height={4} />
              <TermLine delay={350}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"Okihai opt-in toggle on delivery options"}
                </span>
              </TermLine>
              <TermLine delay={356}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"Order tracking status display for Okihai"}
                </span>
              </TermLine>
              <TermLine delay={362}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"Okihai confirmation with consent screen"}
                </span>
              </TermLine>
              <TermLine delay={368}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"i18n keys for all Okihai UI (ja/en)"}
                </span>
              </TermLine>
              <TermLine delay={374}>
                <span style={{ color: C.textMuted }}>{"    ✗ "}</span>
                <span style={{ color: C.textMuted }}>
                  {"MDAS integration — backend (out of scope)"}
                </span>
              </TermLine>
              <TermLine delay={380}>
                <span style={{ color: C.textMuted }}>{"    ✗ "}</span>
                <span style={{ color: C.textMuted }}>
                  {"JMA native app — separate team (out of scope)"}
                </span>
              </TermLine>

              <TermGap height={14} />
              <TermLine
                delay={394}
                style={{ color: C.text, fontWeight: 700 }}
              >
                {"  Initial Task Breakdown"}
              </TermLine>
              <TermLine delay={400} style={{ color: C.textMuted, display: "flex", justifyContent: "space-between" }}>
                <span>{"  #   Task"}</span>
                <span>{"Est."}</span>
              </TermLine>
              <TermLine delay={400} style={{ color: C.textMuted }}>
                {"  ──────────────────────────────────────────────────"}
              </TermLine>
              <TermLine delay={408} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  1   "}</span>
                  <span style={{ color: C.text }}>{"Implement Okihai opt-in toggle"}</span>
                </span>
                <span style={{ color: C.accent }}>{"2.0d"}</span>
              </TermLine>
              <TermLine delay={416} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  2   "}</span>
                  <span style={{ color: C.text }}>{"Update order tracking for Okihai status"}</span>
                </span>
                <span style={{ color: C.accent }}>{"1.5d"}</span>
              </TermLine>
              <TermLine delay={424} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  3   "}</span>
                  <span style={{ color: C.text }}>{"Add Okihai confirmation with consent"}</span>
                </span>
                <span style={{ color: C.accent }}>{"1.0d"}</span>
              </TermLine>
              <TermLine delay={432} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  4   "}</span>
                  <span style={{ color: C.text }}>{"Add Okihai i18n keys (ja/en)"}</span>
                </span>
                <span style={{ color: C.accent }}>{"0.5d"}</span>
              </TermLine>
              <TermLine delay={440} style={{ color: C.textMuted }}>
                {"  ──────────────────────────────────────────────────"}
              </TermLine>
              <TermLine delay={448} style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <span style={{ color: C.text, fontWeight: 700 }}>{"Total:"}</span>
                <span style={{ color: C.accent, fontWeight: 700 }}>{"5.0d"}</span>
              </TermLine>
              <TermGap height={14} />
              <TermLine delay={470} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Spawning review agents..."}
              </TermLine>
            </div>
          )}

          {/* ─── Parallel Agents (510–689) ─────────────────────────────── */}
          {inScene("parallel") && (
            <div style={{ height: "100%" }}>
              <PhaseIndicator
                phase={2}
                title="Parallel Review"
                delay={512}
              />
              <TermGap />
              {/* RUNNING IN PARALLEL badge */}
              <FadeIn delay={518}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <PulseGlow color={C.scout} delay={520} />
                  <span
                    style={{
                      ...S.mono,
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: 2,
                      color: C.warn,
                    }}
                  >
                    RUNNING IN PARALLEL
                  </span>
                  <PulseGlow color={C.architect} delay={520} />
                </div>
              </FadeIn>

              {/* Two columns */}
              <div style={{ display: "flex", gap: 0 }}>
                {/* ── Scout (left) ── */}
                <div
                  style={{
                    flex: 1,
                    borderRight: `1px solid ${C.termBorder}`,
                    paddingRight: 20,
                  }}
                >
                  <TermLine delay={524}>
                    <PulseGlow color={C.scout} delay={524} />
                    <span style={{ color: C.scout, fontWeight: 700 }}>
                      Codebase Scout
                    </span>
                  </TermLine>
                  <TermLine
                    delay={532}
                    style={{ color: C.textMuted, fontSize: 24 }}
                  >
                    {"  Searching for reusable patterns..."}
                  </TermLine>
                  <TermGap height={10} />

                  {/* Finding 1: DeliveryOptions */}
                  <TermLine
                    delay={548}
                    style={{ color: C.textDim, fontSize: 24 }}
                  >
                    {"  src/mdssm/Checkout/"}
                  </TermLine>
                  <TermLine delay={554}>
                    {"    "}
                    <span style={{ color: C.text }}>
                      DeliveryOptions.tsx
                    </span>
                  </TermLine>
                  <TermLine delay={560}>
                    {"    → "}
                    <span
                      style={{
                        color: C.success,
                        fontWeight: 700,
                        background: `${C.success}15`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      REUSE
                    </span>
                    <span style={{ color: C.textDim }}>
                      {" Toggle + hooks exist"}
                    </span>
                  </TermLine>
                  <TermGap height={8} />

                  {/* Finding 2: OrderTracking — simpler */}
                  <TermLine
                    delay={576}
                    style={{ color: C.textDim, fontSize: 24 }}
                  >
                    {"  src/mdssm/DeliveryStatus/"}
                  </TermLine>
                  <TermLine delay={582}>
                    {"    "}
                    <span style={{ color: C.text }}>OrderTracking.tsx</span>
                  </TermLine>
                  <TermLine delay={588}>
                    {"    → "}
                    <span
                      style={{
                        color: C.success,
                        fontWeight: 700,
                        background: `${C.success}15`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      REUSE
                    </span>
                    <span style={{ color: C.textDim }}>
                      {" mapMessages() pattern"}
                    </span>
                  </TermLine>
                  <TermLine delay={594} style={{ color: C.textDim }}>
                    {"    Complexity: "}
                    <span style={{ color: C.success, fontWeight: 600 }}>
                      simpler
                    </span>
                  </TermLine>
                  <TermGap height={8} />

                  {/* Finding 3: Confirmation — useModal reusable */}
                  <TermLine
                    delay={610}
                    style={{ color: C.textDim, fontSize: 24 }}
                  >
                    {"  src/mdssm/Checkout/Confirmation/"}
                  </TermLine>
                  <TermLine delay={616}>
                    {"    "}
                    <span style={{ color: C.text }}>Confirmation.tsx</span>
                  </TermLine>
                  <TermLine delay={622}>
                    {"    → "}
                    <span
                      style={{
                        color: C.warn,
                        fontWeight: 700,
                        background: `${C.warn}15`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      MODIFY
                    </span>
                    <span style={{ color: C.textDim }}>
                      {" useModal hook reusable"}
                    </span>
                  </TermLine>
                  <TermLine delay={628} style={{ color: C.textDim }}>
                    {"    Complexity: "}
                    <span style={{ color: C.text, fontWeight: 600 }}>
                      as-expected
                    </span>
                  </TermLine>
                </div>

                {/* ── Architect (right) ── */}
                <div style={{ flex: 1, paddingLeft: 20 }}>
                  <TermLine delay={526}>
                    <PulseGlow color={C.architect} delay={526} />
                    <span style={{ color: C.architect, fontWeight: 700 }}>
                      Project Architect
                    </span>
                  </TermLine>
                  <TermLine
                    delay={534}
                    style={{ color: C.textMuted, fontSize: 24 }}
                  >
                    {"  Analyzing blast radius..."}
                  </TermLine>
                  <TermGap height={10} />

                  {/* Risk 1: Entry points — HIGH */}
                  <TermLine delay={550}>
                    {"  ⚠ "}
                    <span style={{ color: C.text, fontWeight: 600 }}>
                      Confirmation.tsx entry points
                    </span>
                  </TermLine>
                  <TermLine delay={556}>
                    {"    Risk: "}
                    <span
                      style={{
                        color: C.red,
                        fontWeight: 700,
                        background: `${C.red}15`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      HIGH
                    </span>
                  </TermLine>
                  <TermLine delay={562} style={{ color: C.textDim }}>
                    {"    Fresh checkout, payment redirect,"}
                  </TermLine>
                  <TermLine delay={566} style={{ color: C.textDim }}>
                    {"    payment error, browser back,"}
                  </TermLine>
                  <TermLine delay={570} style={{ color: C.textDim }}>
                    {"    order recovery"}
                  </TermLine>
                  <TermLine delay={576} style={{ color: C.textDim }}>
                    {"    Consent must NOT show on redirect"}
                  </TermLine>
                  <TermGap height={8} />

                  {/* Risk 2: Proto schema */}
                  <TermLine delay={596}>
                    {"  ⚠ "}
                    <span style={{ color: C.text, fontWeight: 600 }}>
                      Proto schema change
                    </span>
                  </TermLine>
                  <TermLine delay={602}>
                    {"    Risk: "}
                    <span
                      style={{
                        color: C.warn,
                        fontWeight: 700,
                        background: `${C.warn}15`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      MEDIUM
                    </span>
                  </TermLine>
                  <TermLine delay={608} style={{ color: C.textDim }}>
                    {"    Add DELIVERY_OKIHAI enum"}
                  </TermLine>
                  <TermLine delay={612} style={{ color: C.textDim }}>
                    {"    Needs backend sync"}
                  </TermLine>
                  <TermGap height={8} />

                  {/* Risk 3: localStorage */}
                  <TermLine delay={628}>
                    {"  ℹ "}
                    <span style={{ color: C.text, fontWeight: 600 }}>
                      localStorage key format
                    </span>
                  </TermLine>
                  <TermLine delay={634}>
                    {"    Risk: "}
                    <span
                      style={{
                        color: C.success,
                        fontWeight: 700,
                        background: `${C.success}15`,
                        padding: "1px 5px",
                        borderRadius: 3,
                      }}
                    >
                      LOW
                    </span>
                  </TermLine>
                  <TermLine delay={640} style={{ color: C.textDim }}>
                    {"    Use okihai-consent:<userId> prefix"}
                  </TermLine>
                </div>
              </div>

              <TermGap height={12} />
              <TermLine delay={660} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Calibrating estimates..."}
              </TermLine>
            </div>
          )}

          {/* ─── Calibration (690–839) ─────────────────────────────────── */}
          {inScene("calibration") && (
            <div>
              <PhaseIndicator
                phase={3}
                title="Senior Estimation"
                delay={692}
              />
              <TermGap />
              <TermLine delay={700} style={{ color: C.textDim, fontSize: 24 }}>
                {
                  "  Reviewed by: Analyst → Scout + Architect → Estimator"
                }
              </TermLine>
              <TermGap height={8} />
              <TermLine
                delay={710}
                style={{ color: C.text, fontWeight: 700 }}
              >
                {"  Calibrated Tasks"}
              </TermLine>
              <TermLine delay={716} style={{ color: C.textMuted, display: "flex", justifyContent: "space-between" }}>
                <span>{"  #   Task"}</span>
                <span>{"Est."}</span>
              </TermLine>
              <TermLine delay={716} style={{ color: C.textMuted }}>
                {"  ──────────────────────────────────────────────────"}
              </TermLine>
              {/* T1: reduced 2.0d → 1.5d */}
              <TermLine delay={722} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  1   "}</span>
                  <span style={{ color: C.text }}>{"Implement Okihai opt-in toggle"}</span>
                </span>
                <span style={{ whiteSpace: "nowrap" }}>
                  <CalibratedEst oldEst="2.0d" newEst="1.5d" triggerFrame={752} direction="down" />
                </span>
              </TermLine>
              {/* T2: reduced 1.5d → 0.5d */}
              <TermLine delay={728} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  2   "}</span>
                  <span style={{ color: C.text }}>{"Update order tracking for Okihai status"}</span>
                </span>
                <span style={{ whiteSpace: "nowrap" }}>
                  <CalibratedEst oldEst="1.5d" newEst="0.5d" triggerFrame={758} direction="down" />
                </span>
              </TermLine>
              {/* T3: increased 1.0d → 1.5d */}
              <TermLine delay={734} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  3   "}</span>
                  <span style={{ color: C.text }}>{"Add Okihai confirmation with consent"}</span>
                </span>
                <span style={{ whiteSpace: "nowrap" }}>
                  <CalibratedEst oldEst="1.0d" newEst="1.5d" triggerFrame={764} direction="up" />
                </span>
              </TermLine>
              {/* T4: unchanged */}
              <TermLine delay={740} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  <span style={{ color: C.textMuted }}>{"  4   "}</span>
                  <span style={{ color: C.text }}>{"Add Okihai i18n keys (ja/en)"}</span>
                </span>
                <span style={{ color: C.accent }}>{"0.5d"}</span>
              </TermLine>
              <TermLine delay={770} style={{ color: C.textMuted }}>
                {"  ──────────────────────────────────────────────────"}
              </TermLine>
              <TermLine delay={776} style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <span style={{ color: C.text, fontWeight: 700 }}>{"Total:"}</span>
                <span style={{ color: C.accent, fontWeight: 800, fontSize: 32 }}>{"4.0d"}</span>
              </TermLine>

              <TermGap height={12} />
              <TermLine
                delay={788}
                style={{ color: C.text, fontWeight: 700 }}
              >
                {"  Estimation Notes"}
              </TermLine>
              <TermLine delay={796}>
                <span style={{ color: C.success }}>{"    ↳ "}</span>
                <span style={{ color: C.textDim }}>
                  {
                    "T1 reduced 2.0d → 1.5d: Scout found toggle hook in"
                  }
                </span>
              </TermLine>
              <TermLine delay={800} style={{ color: C.textDim }}>
                {"      DeliveryOptions.tsx — no new component needed"}
              </TermLine>
              <TermLine delay={808}>
                <span style={{ color: C.success }}>{"    ↳ "}</span>
                <span style={{ color: C.textDim }}>
                  {
                    "T2 reduced 1.5d → 0.5d: mapMessages() pattern reusable,"
                  }
                </span>
              </TermLine>
              <TermLine delay={812} style={{ color: C.textDim }}>
                {"      just add Okihai status branch"}
              </TermLine>
              <TermLine delay={820}>
                <span style={{ color: C.warn }}>{"    ↳ "}</span>
                <span style={{ color: C.textDim }}>
                  {
                    "T3 increased 1.0d → 1.5d: Architect flagged 5 entry"
                  }
                </span>
              </TermLine>
              <TermLine delay={824} style={{ color: C.textDim }}>
                {
                  "      points — consent must guard against payment redirect"
                }
              </TermLine>
            </div>
          )}

          {/* ─── OpenSpec (840–919) ────────────────────────────────────── */}
          {inScene("openspec") && (
            <div>
              <PhaseIndicator
                phase={4}
                title="OpenSpec Generation"
                delay={842}
              />
              <TermGap />
              <TermLine delay={850} style={{ color: C.textDim }}>
                {"  Creating openspec/changes/mdx-11961/..."}
              </TermLine>
              <TermGap />
              <TermLine delay={860}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>{"proposal.md"}</span>
              </TermLine>
              <TermLine delay={867}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>{"design.md"}</span>
              </TermLine>
              <TermLine delay={874}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>{"tasks.md"}</span>
              </TermLine>
              <TermLine delay={881}>
                <span style={{ color: C.success }}>{"    ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"specs/mds-checkout/spec.md"}
                </span>
              </TermLine>
              <TermGap height={12} />
              <TermLine delay={893}>
                <span style={{ color: C.textDim }}>{"  $ "}</span>
                <span style={{ color: C.text }}>
                  {"openspec validate mdx-11961"}
                </span>
              </TermLine>
              <TermLine delay={902}>
                <span style={{ color: C.success, fontWeight: 700 }}>
                  {"    ✓ All checks passed"}
                </span>
              </TermLine>
            </div>
          )}
        </ClaudeCodeWindow>
      )}

      {/* ── Scene 8: Accuracy Reveal (920–999) ────────────────────────── */}
      {inScene("accuracy") && (
        <AbsoluteFill
          style={{
            opacity: sceneFade(920, 80),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <FadeIn delay={924}>
            <div
              style={{
                ...S.mono,
                fontSize: 24,
                color: C.textMuted,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Estimation Accuracy
            </div>
          </FadeIn>

          <div style={{ position: "relative" }}>
            <ProgressRing percentage={89} delay={930} size={200} />
            <ScaleIn
              delay={940}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  ...S.sans,
                  fontSize: 52,
                  fontWeight: 800,
                  color: C.white,
                }}
              >
                89%
              </span>
            </ScaleIn>
          </div>

          <FadeIn delay={955}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: 8,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...S.mono,
                    fontSize: 22,
                    color: C.textMuted,
                    marginBottom: 4,
                  }}
                >
                  ESTIMATED
                </div>
                <div
                  style={{
                    ...S.sans,
                    fontSize: 28,
                    fontWeight: 700,
                    color: C.accent,
                  }}
                >
                  4.0d
                </div>
              </div>
              <div style={{ ...S.sans, fontSize: 20, color: C.textMuted }}>
                vs
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    ...S.mono,
                    fontSize: 22,
                    color: C.textMuted,
                    marginBottom: 4,
                  }}
                >
                  ACTUAL
                </div>
                <div
                  style={{
                    ...S.sans,
                    fontSize: 28,
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  4.5d
                </div>
              </div>
            </div>
          </FadeIn>
        </AbsoluteFill>
      )}

      {/* ── Scene 9: Outro (1000–1109) ─────────────────────────────────── */}
      {inScene("outro") && (
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [1000, 1020, 1080, 1110],
              [0, 1, 1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              ...S.sans,
              fontSize: 42,
              fontWeight: 800,
              color: C.white,
            }}
          >
            Multi-Agent{" "}
            <span style={{ color: C.accent }}>Task Breakdown</span>
          </div>
          <FadeIn delay={1015}>
            <div style={{ ...S.sans, fontSize: 22, color: C.textDim }}>
              One command. Five agents. Calibrated estimates.
            </div>
          </FadeIn>
        </AbsoluteFill>
      )}

      {/* ── Bottom progress bar ────────────────────────────────────────── */}
      <BottomProgressBar totalFrames={totalFrames} />
    </AbsoluteFill>
  );
};
