import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
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
  reviewer: "#a855f7",
  reviewerGlow: "rgba(168, 85, 247, 0.25)",
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
          background: `linear-gradient(90deg, ${C.accent}, ${C.reviewer})`,
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
        <div
          style={{
            background: "#f59e0b22",
            color: C.warn,
            ...S.mono,
            fontSize: 22,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Ready for QA
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

// ─── New components unique to QA Handoff ─────────────────────────────────────

const ReviewCheckItem = ({ label, status, delay = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200 },
  });
  const icon = status === "pass" ? "✓" : status === "fail" ? "✗" : "…";
  const color = status === "pass" ? C.success : status === "fail" ? C.red : C.textMuted;
  return (
    <div
      style={{
        opacity: s,
        transform: `translateX(${(1 - s) * 12}px)`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        ...S.mono,
        fontSize: 24,
        lineHeight: 1.8,
      }}
    >
      <span style={{ color, fontWeight: 700, width: 22, textAlign: "center" }}>
        {icon}
      </span>
      <span style={{ color: C.text }}>{label}</span>
    </div>
  );
};

const ReviewCard = ({ delay = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const t = Math.max(0, frame - delay);
  return (
    <div
      style={{
        opacity: Math.min(s * 2, 1),
        transform: `scale(${s})`,
        background: C.termBg,
        border: `1.5px solid ${C.reviewer}44`,
        borderRadius: 14,
        padding: "28px 36px",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${C.reviewerGlow}`,
        minWidth: 440,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <PulseGlow color={C.reviewer} delay={delay} size={10} />
        <span
          style={{
            ...S.mono,
            fontSize: 24,
            fontWeight: 700,
            color: C.reviewer,
          }}
        >
          Reviewer Sub-Agent
        </span>
      </div>

      <ReviewCheckItem
        label="No internal jargon"
        status={t > 20 ? "pass" : "pending"}
        delay={delay + 12}
      />
      <ReviewCheckItem
        label="Jira-compatible markdown"
        status={t > 35 ? "pass" : "pending"}
        delay={delay + 24}
      />
      <ReviewCheckItem
        label="Correct localStorage keys"
        status={t > 50 ? "pass" : "pending"}
        delay={delay + 36}
      />
      <ReviewCheckItem
        label="Test steps reproducible"
        status={t > 65 ? "pass" : "pending"}
        delay={delay + 48}
      />
      <ReviewCheckItem
        label="No missing coverage areas"
        status={t > 80 ? "pass" : "pending"}
        delay={delay + 60}
      />

      {t > 90 && (
        <FadeIn delay={delay + 85} duration={10}>
          <div
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: `${C.success}15`,
              border: `1px solid ${C.success}44`,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
              ...S.mono,
              fontSize: 22,
              fontWeight: 700,
              color: C.success,
            }}
          >
            <span>✓</span>
            <span>ALL CHECKS PASSED</span>
          </div>
        </FadeIn>
      )}
    </div>
  );
};

const CommentPreview = ({ delay = 0, scrollOffset = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 200 },
  });

  const checkStyle = {
    display: "flex",
    gap: 6,
    marginBottom: 5,
    fontSize: 17,
    lineHeight: 1.5,
  };
  const checkBox = (
    <span style={{ color: "#9ca3af", flexShrink: 0 }}>☐</span>
  );
  const bold = (t) => (
    <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{t}</span>
  );

  return (
    <div
      style={{
        opacity: s,
        background: "#ffffff",
        borderRadius: 10,
        width: 620,
        height: 880,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        color: "#1a1a2e",
        ...S.sans,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Jira comment header — fixed */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "20px 28px 14px",
          borderBottom: "1px solid #e0e0e0",
          background: "#ffffff",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Img
          src={staticFile("eric-avatar.png")}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>
            Eric Xu
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>
            just now
          </div>
        </div>
      </div>

      {/* Scrolling comment body */}
      <div
        style={{
          padding: "16px 28px 28px",
          fontSize: 17,
          lineHeight: 1.55,
          color: "#374151",
          transform: `translateY(${-scrollOffset}px)`,
        }}
      >
        {/* Greeting */}
        <div style={{ marginBottom: 14 }}>
          <span style={{ color: C.jiraBlue, fontWeight: 600 }}>@Susan Wu</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          Thanks so much for always making time to help us catch the tricky
          stuff! Fresh off the oven — Okihai Default Delivery just landed on
          STG, ready for your team to take it for a spin whenever you have a
          slot!
        </div>

        {/* What to Test */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a2e",
            marginBottom: 10,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 4,
          }}
        >
          What to Test
        </div>

        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Okihai popup on first visit")} — Go to the payment
            confirmation screen as a delivery user → a popup should appear
            explaining that "Drop-off Delivery" (置き配) is now pre-selected.
            This popup should only appear once.
          </span>
        </div>
        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Popup dismissal")} — Click OK or click outside the popup →
            Okihai should remain selected as the delivery method
          </span>
        </div>
        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Payment method reset")} — When the popup appears for the
            first time, the payment method should be blank (not pre-filled) →
            user must manually select a payment method
          </span>
        </div>
        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Okihai persists across orders")} — Place an order with Okihai
            → start a new order → Okihai should still be the selected delivery
            method
          </span>
        </div>
        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Hand delivery switch")} — Select "Hand delivery at the door"
            → complete the order → next order should default to Hand delivery
          </span>
        </div>
        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Cash payment restriction")} — Select "Cash" as payment →
            Okihai should be greyed out and unavailable
          </span>
        </div>
        <div style={checkStyle}>
          {checkBox}
          <span>
            {bold("Order completion screen")} — Complete a delivery order with
            Okihai → should show "お届け完了（置き配）" and the Okihai image
          </span>
        </div>

        {/* How to Reset */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a2e",
            marginTop: 18,
            marginBottom: 10,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 4,
          }}
        >
          How to Reset
        </div>
        <div style={{ marginBottom: 8 }}>
          To re-trigger the Okihai popup (test it as a "first time" visit),
          open DevTools Console (F12) and run:
        </div>
        <div
          style={{
            background: "#f3f4f6",
            borderRadius: 6,
            padding: "10px 14px",
            ...S.mono,
            fontSize: 15,
            color: "#374151",
            marginBottom: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          localStorage.removeItem('mcd_delivery_pref_okihai')
        </div>
        <div style={{ marginBottom: 8, color: "#6b7280", fontSize: 16 }}>
          Or use an Incognito/Private window for a fresh session.
        </div>

        {/* References */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a2e",
            marginTop: 18,
            marginBottom: 10,
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: 4,
          }}
        >
          References
        </div>
        <div style={{ fontSize: 16, color: C.jiraBlue, lineHeight: 1.8 }}>
          <div>Requirements: theplanttokyo.atlassian.net/browse/MDI-432</div>
          <div>Epic: theplanttokyo.atlassian.net/browse/MDX-11961</div>
        </div>
      </div>

      {/* Fade-out gradient at bottom */}
      {scrollOffset < 10 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background:
              "linear-gradient(transparent, rgba(255,255,255,0.95))",
            zIndex: 3,
          }}
        />
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ═════════════════════════════════════════════════════════════════════════════

export const QAHandoffDemo = () => {
  const frame = useCurrentFrame();
  const totalFrames = 990;

  // Scene boundaries
  const SCENES = {
    title: [0, 90],
    problem: [90, 180],
    gather: [180, 360],
    build: [360, 510],
    review: [510, 630],
    output: [630, 900],
    outro: [900, 990],
  };

  const inScene = (name) =>
    frame >= SCENES[name][0] && frame < SCENES[name][1];

  // Claude Code window visible across scenes gather → output
  const showCC = frame >= 180 && frame < 900;
  const ccOpacity = showCC
    ? interpolate(frame, [180, 195, 880, 900], [0, 1, 1, 0], {
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
              Automated{" "}
              <span style={{ color: C.accent }}>QA Handoff</span>
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
              From done ticket to copy-paste QA comment in seconds
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
              {["Gather", "Build", "Review", "Deliver"].map(
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
                    {i < 3 && (
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
              "How do you tell QA what to test?"
            </div>
          </FadeIn>
        </AbsoluteFill>
      )}

      {/* ── Claude Code window (Scenes 3–6) ────────────────────────────── */}
      {showCC && (
        <ClaudeCodeWindow opacity={ccOpacity}>
          {/* ─── Gather (180–359) ──────────────────────────────────────── */}
          {inScene("gather") && (
            <div>
              {/* User input */}
              <TermLine delay={185}>
                <span style={{ color: C.accent, fontWeight: 700 }}>
                  {"› "}
                </span>
                <Typewriter
                  text="/mcd-qa-handoff MDX-11961"
                  delay={192}
                  charFrames={1.5}
                />
              </TermLine>
              <TermGap height={14} />

              <TermLine delay={235} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Gathering context for QA handoff..."}
              </TermLine>
              <TermGap />

              {/* Jira context */}
              <TermLine delay={252}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>
                  {"Jira: MDX-11961 — [Web] Okihai (置き配) Delivery Option"}
                </span>
              </TermLine>
              <TermLine delay={262}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"Assignee: Eric"}</span>
                <span style={{ color: C.textMuted }}>{" │ "}</span>
                <span style={{ color: C.text }}>{"QA: Susan Wu"}</span>
              </TermLine>

              {/* Git context */}
              <TermGap height={10} />
              <TermLine delay={278} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Reading git history..."}
              </TermLine>
              <TermGap />
              <TermLine delay={292}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"Branch: feature/okihai-delivery"}</span>
              </TermLine>
              <TermLine delay={300}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"Commits: 7"}</span>
                <span style={{ color: C.textMuted }}>{" │ "}</span>
                <span style={{ color: C.text }}>{"Files changed: 12"}</span>
              </TermLine>

              {/* Code scan */}
              <TermGap height={10} />
              <TermLine delay={316} style={{ color: C.textDim }}>
                <span style={{ color: C.accent }}>{"● "}</span>
                {"Scanning changed code for test-relevant logic..."}
              </TermLine>
              <TermGap />
              <TermLine delay={330}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"DeliveryOptions.tsx — toggle + state"}</span>
              </TermLine>
              <TermLine delay={338}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"OkihaiConfirmation.tsx — consent dialog"}</span>
              </TermLine>
              <TermLine delay={346}>
                <span style={{ color: C.success }}>{"  ✓ "}</span>
                <span style={{ color: C.text }}>{"OrderTracking.tsx — status display"}</span>
              </TermLine>
            </div>
          )}

          {/* ─── Build (360–509) ───────────────────────────────────────── */}
          {inScene("build") && (
            <div>
              <PhaseIndicator
                phase={2}
                title="Building QA Comment"
                delay={362}
              />
              <TermGap height={10} />

              <TermLine delay={374} style={{ color: C.textDim }}>
                {"  Constructing test checklist from code changes..."}
              </TermLine>
              <TermGap height={8} />

              <TermLine delay={390}>
                <span style={{ color: C.accent }}>{"  ┌ "}</span>
                <span style={{ color: C.text, fontWeight: 700 }}>
                  {"QA Comment Draft"}
                </span>
              </TermLine>
              <TermLine delay={398}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.textDim }}>
                  {"Hi @Susan Wu, MDX-11961 is ready for testing."}
                </span>
              </TermLine>
              <TermLine delay={406}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
              </TermLine>
              <TermLine delay={414}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.text, fontWeight: 700 }}>
                  {"Test Checklist:"}
                </span>
              </TermLine>
              <TermLine delay={422}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.success }}>{"  ☐ "}</span>
                <span style={{ color: C.text }}>
                  {"Toggle okihai on → confirmation appears"}
                </span>
              </TermLine>
              <TermLine delay={432}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.success }}>{"  ☐ "}</span>
                <span style={{ color: C.text }}>
                  {"Accept consent → order shows 'Leave at door'"}
                </span>
              </TermLine>
              <TermLine delay={442}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.success }}>{"  ☐ "}</span>
                <span style={{ color: C.text }}>
                  {"Order tracking shows okihai status"}
                </span>
              </TermLine>
              <TermLine delay={452}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.success }}>{"  ☐ "}</span>
                <span style={{ color: C.text }}>
                  {"Takeout orders → okihai toggle hidden"}
                </span>
              </TermLine>
              <TermLine delay={462}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
              </TermLine>
              <TermLine delay={472}>
                <span style={{ color: C.accent }}>{"  │ "}</span>
                <span style={{ color: C.text, fontWeight: 700 }}>
                  {"Reset: "}
                </span>
                <span style={{ color: C.textDim, fontSize: 24 }}>
                  {"localStorage.removeItem('mcd_delivery_pref_okihai')"}
                </span>
              </TermLine>
              <TermLine delay={480}>
                <span style={{ color: C.accent }}>{"  └──────────────────────────────────────"}</span>
              </TermLine>

              <TermGap height={12} />
              <TermLine delay={494} style={{ color: C.textDim }}>
                <span style={{ color: C.reviewer }}>{"● "}</span>
                {"Spawning reviewer sub-agent..."}
              </TermLine>
            </div>
          )}

          {/* ─── Review (510–629) ──────────────────────────────────────── */}
          {inScene("review") && (
            <div style={{ height: "100%", display: "flex", gap: 32 }}>
              {/* Left: terminal context */}
              <div style={{ flex: 1 }}>
                <PhaseIndicator
                  phase={3}
                  title="Quality Review"
                  delay={512}
                />
                <TermGap />
                <FadeIn delay={518}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 14,
                    }}
                  >
                    <PulseGlow color={C.reviewer} delay={520} />
                    <span
                      style={{
                        ...S.mono,
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: 2,
                        color: C.reviewer,
                      }}
                    >
                      REVIEWING COMMENT
                    </span>
                  </div>
                </FadeIn>

                <TermLine delay={530} style={{ color: C.textDim, fontSize: 24 }}>
                  {"  Checking for internal jargon..."}
                </TermLine>
                <TermLine delay={545}>
                  <span style={{ color: C.success }}>{"  ✓ "}</span>
                  <span style={{ color: C.text }}>
                    {"No MDAS/proto/internal terms found"}
                  </span>
                </TermLine>

                <TermGap height={6} />
                <TermLine delay={558} style={{ color: C.textDim, fontSize: 24 }}>
                  {"  Validating markdown format..."}
                </TermLine>
                <TermLine delay={572}>
                  <span style={{ color: C.success }}>{"  ✓ "}</span>
                  <span style={{ color: C.text }}>
                    {"Jira wiki markup compatible"}
                  </span>
                </TermLine>

                <TermGap height={6} />
                <TermLine delay={585} style={{ color: C.textDim, fontSize: 24 }}>
                  {"  Verifying reset script..."}
                </TermLine>
                <TermLine delay={598}>
                  <span style={{ color: C.success }}>{"  ✓ "}</span>
                  <span style={{ color: C.text }}>
                    {"localStorage key matches codebase"}
                  </span>
                </TermLine>
              </div>

              {/* Right: review card overlay */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ReviewCard delay={518} />
              </div>
            </div>
          )}

          {/* ─── Output (630–899) ──────────────────────────────────────── */}
          {inScene("output") && (() => {
            const scrollAmt = interpolate(
              frame,
              [700, 870],
              [0, 380],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );
            return (
              <div style={{ height: "100%", display: "flex", gap: 24 }}>
                {/* Left: terminal */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <PhaseIndicator
                    phase={4}
                    title="Ready to Post"
                    delay={632}
                  />
                  <TermGap />
                  <TermLine delay={640}>
                    <span style={{ color: C.success, fontWeight: 700 }}>
                      {"✓ "}
                    </span>
                    <span style={{ color: C.text }}>
                      {"QA comment generated and reviewed"}
                    </span>
                  </TermLine>
                  <TermGap height={8} />
                  <TermLine delay={655} style={{ color: C.textDim, fontSize: 24 }}>
                    {"  Comment copied to clipboard."}
                  </TermLine>
                  <TermGap height={14} />
                  <TermLine delay={670}>
                    <span style={{ color: C.accent }}>{"  ┌ "}</span>
                    <span style={{ color: C.text, fontWeight: 700 }}>
                      {"Options:"}
                    </span>
                  </TermLine>
                  <TermLine delay={678}>
                    <span style={{ color: C.accent }}>{"  │ "}</span>
                    <span style={{ color: C.text }}>
                      {"  1. Post to Jira automatically"}
                    </span>
                  </TermLine>
                  <TermLine delay={686}>
                    <span style={{ color: C.accent }}>{"  │ "}</span>
                    <span style={{ color: C.text }}>
                      {"  2. Edit before posting"}
                    </span>
                  </TermLine>
                  <TermLine delay={694}>
                    <span style={{ color: C.accent }}>{"  │ "}</span>
                    <span style={{ color: C.text }}>
                      {"  3. Copy and post manually"}
                    </span>
                  </TermLine>
                  <TermLine delay={702}>
                    <span style={{ color: C.accent }}>{"  └──────────────────────"}</span>
                  </TermLine>
                  <TermGap height={14} />
                  <TermLine delay={720}>
                    <span style={{ color: C.textDim }}>
                      {"  Want me to adjust anything?"}
                    </span>
                  </TermLine>
                </div>

                {/* Right: rendered Jira comment preview — auto-scrolls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: 10,
                  }}
                >
                  <ScaleIn delay={645}>
                    <CommentPreview delay={645} scrollOffset={scrollAmt} />
                  </ScaleIn>
                </div>
              </div>
            );
          })()}
        </ClaudeCodeWindow>
      )}

      {/* ── Scene 7: Outro (900–989) ─────────────────────────────────── */}
      {inScene("outro") && (
        <AbsoluteFill
          style={{
            opacity: interpolate(
              frame,
              [900, 920, 960, 990],
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
            Automated{" "}
            <span style={{ color: C.accent }}>QA Handoff</span>
          </div>
          <FadeIn delay={915}>
            <div style={{ ...S.sans, fontSize: 22, color: C.textDim }}>
              4 phases. 1 command. 0 jargon.
            </div>
          </FadeIn>
          <FadeIn delay={925}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                marginTop: 20,
              }}
            >
              {[
                { label: "Gather", icon: "📋" },
                { label: "Build", icon: "🔨" },
                { label: "Review", icon: "🔍" },
                { label: "Deliver", icon: "📤" },
              ].map((step, i) => (
                <ScaleIn key={step.label} delay={928 + i * 4}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div style={{ fontSize: 36 }}>{step.icon}</div>
                    <div
                      style={{
                        ...S.mono,
                        fontSize: 20,
                        color: C.accent,
                        padding: "4px 12px",
                        border: `1px solid ${C.accentDim}`,
                        borderRadius: 16,
                        background: `${C.accent}11`,
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </FadeIn>
        </AbsoluteFill>
      )}

      {/* ── Bottom progress bar ────────────────────────────────────────── */}
      <BottomProgressBar totalFrames={totalFrames} />
    </AbsoluteFill>
  );
};
