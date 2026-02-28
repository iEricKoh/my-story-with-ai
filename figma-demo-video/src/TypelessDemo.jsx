import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

/* ============================================================
   TYPELESS DEMO — Voice dictation in Claude Code
   Scene 1: fn+space  (hands-free dictation)
   Scene 2: fn+shift  (translation mode)
   ============================================================ */

// ─── Colors ─────────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0a0f",
  termBg: "#0d1117",
  termBar: "#161b22",
  termBorder: "#30363d",
  accent: "#00cf83",
  accentGlow: "rgba(0, 207, 131, 0.25)",
  cyan: "#00ffcc",
  cyanGlow: "rgba(0, 255, 204, 0.3)",
  purple: "#a855f7",
  blue: "#3b82f6",
  orange: "#f59e0b",
  claudeOrange: "#da7756",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  white: "#ffffff",
  keyCap: "#2a2a3a",
  keyCapBorder: "#3a3a4a",
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

// ─── Typewriter ─────────────────────────────────────────────────────────────

const Typewriter = ({ text, delay = 0, charFrames = 1.2, color = C.text }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const chars = Math.min(Math.floor(t / charFrames), text.length);
  const cursorBlink = Math.floor(t / 15) % 2 === 0;
  const done = chars >= text.length;
  return (
    <span>
      <span style={{ color }}>{text.slice(0, chars)}</span>
      {!done && (
        <span style={{ color: C.cyan, opacity: cursorBlink ? 1 : 0.3 }}>
          █
        </span>
      )}
    </span>
  );
};

// ─── Keystroke badge ────────────────────────────────────────────────────────

const KeyBadge = ({ keys, delay = 0, label = "" }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 14, stiffness: 120 },
  });
  return (
    <div
      style={{
        opacity: Math.min(s * 2, 1),
        transform: `scale(${s})`,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        {keys.map((key, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && (
              <span style={{ color: C.textMuted, fontSize: 18, ...S.sans }}>
                +
              </span>
            )}
            <span
              style={{
                ...S.mono,
                fontSize: 22,
                fontWeight: 600,
                color: C.white,
                background: C.keyCap,
                border: `1px solid ${C.keyCapBorder}`,
                borderBottom: `3px solid ${C.keyCapBorder}`,
                borderRadius: 6,
                padding: "4px 12px",
                minWidth: 36,
                textAlign: "center",
              }}
            >
              {key}
            </span>
          </span>
        ))}
      </div>
      {label && (
        <span
          style={{
            ...S.sans,
            fontSize: 20,
            color: C.textDim,
            marginLeft: 8,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

// ─── Listening indicator (audio waveform bars) ──────────────────────────────

const ListeningIndicator = ({ delay = 0, color = C.cyan }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const fadeIn = interpolate(t, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barCount = 5;
  return (
    <div
      style={{
        opacity: fadeIn,
        display: "flex",
        alignItems: "center",
        gap: 3,
        height: 28,
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => {
        const phase = i * 1.3;
        const h = 8 + 12 * (Math.sin(t * 0.25 + phase) * 0.5 + 0.5);
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              borderRadius: 2,
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Speech bubble ──────────────────────────────────────────────────────────

const SpeechBubble = ({ text, delay = 0, charFrames = 0.7, color = C.orange }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);
  const fadeIn = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleIn = interpolate(t, [0, 10], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chars = Math.min(Math.floor(t / charFrames), text.length);
  const visibleText = text.slice(0, chars);
  const cursorBlink = Math.floor(t / 15) % 2 === 0;
  const done = chars >= text.length;

  if (t <= 0) return null;

  return (
    <div
      style={{
        opacity: fadeIn,
        transform: `scale(${scaleIn})`,
        transformOrigin: "left top",
        position: "relative",
        display: "inline-block",
        maxWidth: 1400,
      }}
    >
      {/* Bubble */}
      <div
        style={{
          background: `${color}12`,
          border: `1px solid ${color}40`,
          borderRadius: "16px 16px 16px 4px",
          padding: "10px 16px",
          ...S.sans,
          fontSize: 21,
          lineHeight: 1.5,
          color,
          fontStyle: "italic",
        }}
      >
        <span style={{ marginRight: 4 }}>🗣️</span>
        {visibleText}
        {!done && (
          <span style={{ opacity: cursorBlink ? 0.8 : 0.2 }}>|</span>
        )}
      </div>
      {/* Tail */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: 12,
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: `7px solid ${color}40`,
        }}
      />
    </div>
  );
};

// ─── Mode badge ─────────────────────────────────────────────────────────────

const ModeBadge = ({ label, icon, color, delay = 0 }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 120 },
  });
  return (
    <div
      style={{
        opacity: Math.min(s * 2, 1),
        transform: `scale(${s})`,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: `${color}18`,
        border: `1px solid ${color}44`,
        borderRadius: 8,
        padding: "6px 14px",
      }}
    >
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ ...S.sans, fontSize: 22, fontWeight: 600, color }}>
        {label}
      </span>
    </div>
  );
};

// ─── Claude Code terminal window ────────────────────────────────────────────

const ClaudeCodeWindow = ({ children, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity,
      background: C.termBg,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
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
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
      <div
        style={{
          flex: 1,
          textAlign: "center",
          ...S.mono,
          fontSize: 14,
          color: C.textMuted,
        }}
      >
        claude — ~/development/ecjs
      </div>
    </div>
    {/* Content area */}
    <div
      style={{
        flex: 1,
        padding: "24px 36px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  </div>
);

// ─── Prompt area ────────────────────────────────────────────────────────────

const PromptPrefix = () => (
  <span>
    <span style={{ color: C.claudeOrange, ...S.mono, fontSize: 26 }}>✻ </span>
    <span style={{ color: C.textMuted, ...S.mono, fontSize: 26 }}>❯ </span>
  </span>
);

// ─── Scene 1: fn+space hands-free dictation ─────────────────────────────────

const EXISTING_CODE =
  "// TODO: fix the authentication check — it's letting expired tokens through and we keep getting complaints from QA";

const ASK_SPEECH =
  "Turn this into a detailed Jira ticket with acceptance criteria";

const ASK_OUTPUT =
  "**[BUG] Expired JWT tokens bypass auth middleware**\n\nDescription: Expired tokens are not rejected by the auth middleware, allowing unauthorized access.\n\nAcceptance Criteria:\n- [ ] Middleware rejects tokens past expiry\n- [ ] Return 401 with clear error message\n- [ ] Add unit tests for expiry edge cases";

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline:
  // 0-15:    Terminal fade in
  // 15-40:   Show selected text (the code comment)
  // 45-55:   Keystroke badge "fn + space" + mode badge
  // 60-120:  Speech bubble — voice command
  // 125-135: Processing indicator
  // 140-270: Generated output appears
  // 275-290: Completion

  const termOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const processArrow = frame >= 125
    ? interpolate(frame, [125, 140], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <ClaudeCodeWindow opacity={termOpacity}>
      {/* Claude Code welcome */}
      <FadeIn delay={3} duration={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ color: C.claudeOrange, fontSize: 30 }}>✻</span>
          <span style={{ ...S.sans, fontSize: 24, fontWeight: 700, color: C.text }}>
            Claude Code
          </span>
          <span style={{ ...S.mono, fontSize: 20, color: C.textMuted }}>
            ~/development/ecjs
          </span>
        </div>
      </FadeIn>

      {/* ── Selected text (what you've highlighted) ── */}
      <FadeIn delay={15} duration={10}>
        <div
          style={{
            ...S.sans,
            fontSize: 20,
            fontWeight: 600,
            color: C.textDim,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            marginBottom: 6,
          }}
        >
          ▎ Selected text
        </div>
        <div
          style={{
            background: "rgba(58, 130, 246, 0.08)",
            border: "1px solid rgba(58, 130, 246, 0.25)",
            borderRadius: 8,
            padding: "12px 16px",
            ...S.mono,
            fontSize: 22,
            lineHeight: 1.6,
            color: C.blue,
            marginBottom: 16,
          }}
        >
          {EXISTING_CODE}
        </div>
      </FadeIn>

      {/* Keystroke badge + mode badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
        <KeyBadge keys={["fn", "space"]} delay={45} />
        <ModeBadge
          label="Ask Anything"
          icon="💬"
          color={C.cyan}
          delay={50}
        />
        {frame >= 55 && frame < 125 && <ListeningIndicator delay={55} color={C.cyan} />}
      </div>

      {/* ── Speech bubble: voice command ── */}
      {frame >= 60 && (
        <div style={{ marginBottom: 16 }}>
          <SpeechBubble
            text={ASK_SPEECH}
            delay={60}
            charFrames={1.2}
            color={C.orange}
          />
        </div>
      )}

      {/* ── Processing indicator ── */}
      {frame >= 125 && frame < 280 && (
        <FadeIn delay={125} duration={8}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              ...S.sans,
              fontSize: 22,
              color: C.textDim,
            }}
          >
            <span style={{ opacity: processArrow, color: C.cyan, fontSize: 22 }}>
              ↓
            </span>
            <span style={{ opacity: processArrow }}>
              Generating…
            </span>
          </div>
        </FadeIn>
      )}

      {/* ── Generated output ── */}
      {frame >= 140 && (
        <FadeIn delay={140} duration={8}>
          <div
            style={{
              ...S.sans,
              fontSize: 20,
              fontWeight: 600,
              color: C.cyan,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            ✦ Typeless output
          </div>
          <div
            style={{
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}25`,
              borderRadius: 8,
              padding: "12px 16px",
              ...S.mono,
              fontSize: 21,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            <Typewriter
              text={ASK_OUTPUT}
              delay={145}
              charFrames={0.5}
              color={C.text}
            />
          </div>
        </FadeIn>
      )}

      {/* ── Completion ── */}
      {frame >= 280 && (
        <FadeIn delay={280} duration={10}>
          <div
            style={{
              marginTop: 14,
              ...S.sans,
              fontSize: 24,
              color: C.textDim,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: C.accent }}>✓</span>
            <span>Voice command → Jira ticket generated · Ready to paste</span>
          </div>
        </FadeIn>
      )}
    </ClaudeCodeWindow>
  );
};

// ─── Scene 2: fn+shift translation mode ─────────────────────────────────────

const CHINESE_TEXT = "给支付网关超时添加错误处理。如果请求超过三十秒，重试一次，然后显示一个用户友好的错误信息。";

const ENGLISH_TEXT =
  "Add error handling for the payment gateway timeout. If the request exceeds 30 seconds, retry once then show a user-friendly error message.";

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline (local frames, 0-based within Sequence):
  // 0-15:    Terminal fade in
  // 15-30:   Keystroke badge "fn + shift" appears
  // 30-40:   Mode badge + language flow indicator
  // 40-110:  Stage 1 — Chinese speech appears (what you're saying)
  // 115-125: Translating indicator
  // 130-230: Stage 2 — English translation appears
  // 235-260: Stage 3 — Final output in prompt, completion indicator

  const termOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chinese text fades/dims when translation starts
  const chineseDim = frame >= 120
    ? interpolate(frame, [120, 135], [1, 0.35], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // Arrow animation between speech and translation
  const arrowProgress = frame >= 115
    ? interpolate(frame, [115, 130], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <ClaudeCodeWindow opacity={termOpacity}>
      {/* Claude Code welcome */}
      <FadeIn delay={3} duration={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ color: C.claudeOrange, fontSize: 30 }}>✻</span>
          <span style={{ ...S.sans, fontSize: 24, fontWeight: 700, color: C.text }}>
            Claude Code
          </span>
          <span style={{ ...S.mono, fontSize: 20, color: C.textMuted }}>
            ~/development/ecjs
          </span>
        </div>
      </FadeIn>

      {/* Spacer */}
      <div style={{ height: 4 }} />

      {/* Keystroke badge + mode badge row */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
        <KeyBadge keys={["fn", "⇧"]} delay={15} />
        <ModeBadge
          label="Translation mode"
          icon="🌐"
          color={C.purple}
          delay={25}
        />
        {frame >= 30 && <ListeningIndicator delay={30} color={C.purple} />}
      </div>

      {/* Language flow indicator */}
      <FadeIn delay={30} duration={8}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
            ...S.sans,
            fontSize: 20,
          }}
        >
          <span
            style={{
              background: `${C.purple}20`,
              border: `1px solid ${C.purple}44`,
              borderRadius: 6,
              padding: "3px 10px",
              color: C.purple,
            }}
          >
            🇨🇳 Chinese
          </span>
          <span style={{ color: C.textMuted }}>→</span>
          <span
            style={{
              background: `${C.accent}20`,
              border: `1px solid ${C.accent}44`,
              borderRadius: 6,
              padding: "3px 10px",
              color: C.accent,
            }}
          >
            🇬🇧 English
          </span>
        </div>
      </FadeIn>

      {/* ── Stage 1: Chinese speech bubble (what you're saying) ── */}
      {frame >= 40 && (
        <div style={{ opacity: chineseDim, marginBottom: 18 }}>
          <SpeechBubble
            text={CHINESE_TEXT}
            delay={40}
            charFrames={1.5}
            color={C.purple}
          />
        </div>
      )}

      {/* ── Translating indicator ── */}
      {frame >= 115 && frame < 235 && (
        <FadeIn delay={115} duration={8}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
              ...S.sans,
              fontSize: 22,
              color: C.textDim,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 24,
                textAlign: "center",
                opacity: arrowProgress,
                color: C.accent,
                fontSize: 20,
              }}
            >
              ↓
            </span>
            <span style={{ opacity: arrowProgress }}>Translating…</span>
          </div>
        </FadeIn>
      )}

      {/* ── Stage 2: English translation output ── */}
      {frame >= 130 && (
        <FadeIn delay={130} duration={8}>
          <div
            style={{
              ...S.sans,
              fontSize: 20,
              fontWeight: 600,
              color: C.accent,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            ✦ Translated output
          </div>
          <div
            style={{
              background: `${C.accent}08`,
              border: `1px solid ${C.accent}25`,
              borderRadius: 8,
              padding: "12px 16px",
              ...S.mono,
              fontSize: 24,
              lineHeight: 1.6,
            }}
          >
            <PromptPrefix />
            <Typewriter
              text={ENGLISH_TEXT}
              delay={135}
              charFrames={0.8}
              color={C.text}
            />
          </div>
        </FadeIn>
      )}

      {/* ── Stage 3: Completion ── */}
      {frame >= 245 && (
        <FadeIn delay={245} duration={10}>
          <div
            style={{
              marginTop: 14,
              ...S.sans,
              fontSize: 24,
              color: C.textDim,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: C.accent }}>✓</span>
            <span>Spoken in Chinese · Translated to English · Pasted into Claude Code</span>
          </div>
        </FadeIn>
      )}
    </ClaudeCodeWindow>
  );
};

// ─── Scene 3: Natural speech — filler removal & self-correction ─────────────

// The raw speech with fillers, hesitations, and a self-correction
const RAW_NATURAL = "Um, so we need to, uh, update the payment... no wait, the checkout flow to um, validate the card number before, you know, before submitting the form. And uh, also show an error if it's... if it's invalid.";

// What Typeless outputs — clean, no fillers, correction resolved
const CLEAN_NATURAL = "Update the checkout flow to validate the card number before submitting the form. Show an error if it's invalid.";

// Highlighted annotations for the visualization
const FILLER_WORDS = ["Um,", "uh,", "um,", "you know,", "uh,"];
const CORRECTION = "no wait, the checkout";
const REPETITION = "if it's...";

const NaturalSpeechViz = ({ rawText, cleanText, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  // Phase 1: raw text types in (0-180)
  // Phase 2: fillers highlight red + strikethrough (180-210)
  // Phase 3: clean text fades in below (220+)

  const rawChars = Math.min(Math.floor(t / 0.7), rawText.length);
  const rawVisible = rawText.slice(0, rawChars);
  const rawDone = rawChars >= rawText.length;

  const highlightPhase = t >= 180
    ? interpolate(t, [180, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const cleanPhase = t >= 220
    ? interpolate(t, [220, 235], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  // Render raw text with filler highlighting
  const renderRaw = () => {
    if (!rawDone || highlightPhase === 0) {
      // Still typing or no highlight yet
      return (
        <span style={{ color: C.text }}>
          {rawVisible}
          {!rawDone && (
            <span style={{ color: C.cyan, opacity: Math.floor(t / 15) % 2 === 0 ? 1 : 0.3 }}>█</span>
          )}
        </span>
      );
    }

    // Highlight fillers and corrections
    const parts = rawText.split(/(Um,\s|uh,\s|um,\s|you know,\s|no wait, the payment\.\.\.\s|if it's\.\.\.\s)/g);
    return parts.map((part, i) => {
      const isFiller = /^(Um,|uh,|um,|you know,|no wait, the payment\.\.\.|if it's\.\.\.)\s?$/.test(part);
      if (isFiller) {
        return (
          <span
            key={i}
            style={{
              color: "#ef4444",
              textDecoration: "line-through",
              textDecorationColor: `rgba(239, 68, 68, ${highlightPhase})`,
              opacity: 1 - highlightPhase * 0.4,
              background: `rgba(239, 68, 68, ${highlightPhase * 0.12})`,
              borderRadius: 3,
              padding: "0 2px",
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={i} style={{ color: C.text }}>{part}</span>;
    });
  };

  return (
    <div>
      {/* Raw speech */}
      <div
        style={{
          ...S.sans,
          fontSize: 20,
          fontWeight: 600,
          color: C.orange,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 6,
        }}
      >
        🗣️ What you said
      </div>
      <div
        style={{
          background: `${C.orange}10`,
          border: `1px solid ${C.orange}30`,
          borderRadius: 8,
          padding: "12px 16px",
          ...S.sans,
          fontSize: 22,
          lineHeight: 1.7,
          fontStyle: "italic",
          marginBottom: 8,
        }}
      >
        {renderRaw()}
      </div>

      {/* Legend */}
      {highlightPhase > 0 && (
        <div
          style={{
            opacity: highlightPhase,
            display: "flex",
            gap: 20,
            marginBottom: 14,
            ...S.sans,
            fontSize: 18,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#ef4444", textDecoration: "line-through" }}>filler</span>
            <span style={{ color: C.textMuted }}>— removed</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "#ef4444", textDecoration: "line-through" }}>correction</span>
            <span style={{ color: C.textMuted }}>— resolved</span>
          </span>
        </div>
      )}

      {/* Arrow */}
      {highlightPhase > 0 && (
        <div
          style={{
            opacity: highlightPhase,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            ...S.sans,
            fontSize: 22,
            color: C.textDim,
          }}
        >
          <span style={{ color: C.cyan }}>↓</span>
          <span>Cleaned by Typeless</span>
        </div>
      )}

      {/* Clean output */}
      {cleanPhase > 0 && (
        <div style={{ opacity: cleanPhase, transform: `translateY(${(1 - cleanPhase) * 8}px)` }}>
          <div
            style={{
              ...S.sans,
              fontSize: 20,
              fontWeight: 600,
              color: C.cyan,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            ✦ Typeless output
          </div>
          <div
            style={{
              background: `${C.cyan}08`,
              border: `1px solid ${C.cyan}25`,
              borderRadius: 8,
              padding: "12px 16px",
              ...S.mono,
              fontSize: 24,
              lineHeight: 1.6,
              color: C.text,
            }}
          >
            <PromptPrefix />
            {cleanText}
          </div>
        </div>
      )}
    </div>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();

  const termOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ClaudeCodeWindow opacity={termOpacity}>
      {/* Claude Code welcome */}
      <FadeIn delay={3} duration={10}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ color: C.claudeOrange, fontSize: 30 }}>✻</span>
          <span style={{ ...S.sans, fontSize: 24, fontWeight: 700, color: C.text }}>
            Claude Code
          </span>
          <span style={{ ...S.mono, fontSize: 20, color: C.textMuted }}>
            ~/development/ecjs
          </span>
        </div>
      </FadeIn>

      <div style={{ height: 4 }} />

      {/* Keystroke badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 14 }}>
        <KeyBadge keys={["fn"]} delay={10} label="hold to dictate" />
        <ModeBadge
          label="Dictation"
          icon="🎙️"
          color={C.cyan}
          delay={16}
        />
        {frame >= 20 && frame < 180 && <ListeningIndicator delay={20} color={C.cyan} />}
      </div>

      {/* Natural speech visualization */}
      <NaturalSpeechViz
        rawText={RAW_NATURAL}
        cleanText={CLEAN_NATURAL}
        delay={25}
      />

      {/* Completion */}
      {frame >= 265 && (
        <FadeIn delay={265} duration={10}>
          <div
            style={{
              marginTop: 14,
              ...S.sans,
              fontSize: 24,
              color: C.textDim,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: C.accent }}>✓</span>
            <span>Fillers removed · Self-correction resolved · Clean prompt ready</span>
          </div>
        </FadeIn>
      )}
    </ClaudeCodeWindow>
  );
};

// ─── Exported compositions ──────────────────────────────────────────────────

export const TypelessNaturalSpeech = () => (
  <AbsoluteFill style={{ background: C.termBg }}>
    <Scene3 />
  </AbsoluteFill>
);

export const TypelessAskAnything = () => (
  <AbsoluteFill style={{ background: C.termBg }}>
    <Scene1 />
  </AbsoluteFill>
);

export const TypelessTranslation = () => (
  <AbsoluteFill style={{ background: C.termBg }}>
    <Scene2 />
  </AbsoluteFill>
);

// Combined (kept for backwards compat)
export const TypelessDemo = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.termBg }}>
      <Sequence from={0} durationInFrames={300} premountFor={fps}>
        <Scene1 />
      </Sequence>
      <Sequence from={310} durationInFrames={270} premountFor={fps}>
        <Scene2 />
      </Sequence>
    </AbsoluteFill>
  );
};
