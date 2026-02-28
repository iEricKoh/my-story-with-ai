import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

/* ============================================================
   FIGMA DEV MODE WORKFLOW DEMO
   3 steps: Duplicate → Open Personal Copy → Enable Dev Mode
   ============================================================ */

// ─── Color palette ───
const C = {
  bg: "#0a0a0f",
  card: "#16161e",
  cardBorder: "#2a2a3a",
  figmaBg: "#2c2c2c",
  figmaToolbar: "#1e1e1e",
  figmaSidebar: "#252525",
  accent: "#00cf83", // Figma green
  accentGlow: "rgba(0, 207, 131, 0.3)",
  purple: "#a259ff",
  blue: "#57b9ff",
  pink: "#ff6ac1",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.5)",
  textDim: "rgba(255,255,255,0.25)",
  orange: "#ff9447",
};

// ─── Easing helpers ───
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ─── Reusable animated components ───

const FadeIn = ({ children, delay = 0, duration = 15, style = {} }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame - delay, [0, duration], [20, 0], {
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
  const scale = spring({ frame: frame - delay, fps, config: { damping: 15, stiffness: 120 } });
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ opacity, transform: `scale(${scale})`, ...style }}>
      {children}
    </div>
  );
};

// ─── Step Badge (compact, horizontal-friendly) ───
const StepBadge = ({ number, label, active, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: active ? C.accent : "transparent",
          border: `2px solid ${active ? C.accent : C.cardBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "SF Mono, Menlo, monospace",
          fontSize: 16,
          fontWeight: 700,
          color: active ? C.bg : C.textMuted,
          boxShadow: active ? `0 0 20px ${C.accentGlow}` : "none",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: active ? C.text : C.textMuted,
          fontFamily: "system-ui, -apple-system, sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ─── Step Arrow (connector between horizontal badges) ───
const StepArrow = () => (
  <span style={{ fontSize: 16, color: C.textDim, margin: "0 6px" }}>→</span>
);

// ─── Figma Window Mockup ───
const FigmaWindow = ({ children, title = "Figma", style = {} }) => {
  return (
    <div
      style={{
        background: C.figmaBg,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
        border: `1px solid rgba(255,255,255,0.08)`,
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 48,
          background: C.figmaToolbar,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f57" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#febc2e" }} />
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28c840" }} />
        <span
          style={{
            marginLeft: 12,
            fontSize: 22,
            color: C.textMuted,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {title}
        </span>
      </div>
      {/* Content */}
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
};

// ─── Cursor ───
const Cursor = ({ x, y, delay = 0, clicking = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clickScale = clicking
    ? spring({ frame: Math.max(0, frame - delay - 10), fps, config: { damping: 10, stiffness: 200 } })
    : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {/* Click ring */}
      {clicking && (
        <div
          style={{
            position: "absolute",
            left: -15,
            top: -15,
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: `2px solid ${C.orange}`,
            background: "rgba(255, 148, 71, 0.15)",
            transform: `scale(${clickScale * 1.5})`,
            opacity: 1 - clickScale * 0.5,
          }}
        />
      )}
      {/* Cursor arrow */}
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
        <path
          d="M2 2L2 22L8 16L14 26L18 24L12 14L20 14L2 2Z"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

// ─── Context Menu ───
const ContextMenu = ({ items, highlightIndex = -1, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 15, stiffness: 180 },
  });
  const opacity = interpolate(frame - delay, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        background: "#2d2d2d",
        borderRadius: 10,
        padding: "8px 0",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        border: "1px solid rgba(255,255,255,0.1)",
        minWidth: 280,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {items.map((item, i) => (
        <div key={i}>
          {item === "---" ? (
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />
          ) : (
            <div
              style={{
                padding: "10px 20px",
                fontSize: 24,
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: i === highlightIndex ? C.text : C.textMuted,
                background: i === highlightIndex ? "rgba(0, 207, 131, 0.15)" : "transparent",
                cursor: "pointer",
                fontWeight: i === highlightIndex ? 600 : 400,
              }}
            >
              {item}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── File Thumbnail ───
const FileThumbnail = ({ name, subtitle, isNew = false, highlighted = false, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        width: 320,
      }}
    >
      <div
        style={{
          width: 320,
          height: 200,
          borderRadius: 12,
          background: "linear-gradient(135deg, #da291c 0%, #ffbc0d 100%)",
          border: highlighted ? `3px solid ${C.accent}` : "2px solid rgba(255,255,255,0.08)",
          boxShadow: highlighted ? `0 0 25px ${C.accentGlow}` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* McDonald's-style arches mockup */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "rgba(255,255,255,0.3)",
            fontFamily: "system-ui",
          }}
        >
          M
        </div>
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(0,0,0,0.5)",
            padding: "4px 10px",
            borderRadius: 4,
            fontSize: 18,
            color: "white",
            fontWeight: 600,
            fontFamily: "system-ui",
          }}
        >
          WEB
        </div>
        {isNew && (
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              background: C.accent,
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 18,
              color: C.bg,
              fontWeight: 700,
              fontFamily: "system-ui",
            }}
          >
            NEW
          </div>
        )}
      </div>
      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: isNew ? C.accent : C.purple,
          }}
        />
        <div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: C.text,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 18,
              color: C.textDim,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── View-Only Banner ───
const ViewOnlyBanner = ({ visible = true }) => {
  return visible ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: "10px 20px",
        background: "rgba(255,255,255,0.06)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span style={{ fontSize: 22, color: C.textMuted, fontFamily: "system-ui" }}>
        ⚠ You can only view and comment on this file.
      </span>
      <div
        style={{
          padding: "5px 14px",
          background: C.purple,
          borderRadius: 6,
          fontSize: 20,
          fontWeight: 600,
          color: "white",
          fontFamily: "system-ui",
        }}
      >
        Start editing
      </div>
    </div>
  ) : null;
};

// ─── Dev Mode Panel ───
const DevModePanel = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame - delay, [0, 15], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // MCP section highlight pulse (starts a bit after panel appears)
  const mcpDelay = delay + 20;
  const mcpGlow = interpolate(frame - mcpDelay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mcpPulse = frame > mcpDelay + 15 ? Math.sin((frame - mcpDelay) * 0.12) * 0.15 + 0.85 : mcpGlow;

  // Copy button flash
  const copyFlash = frame > mcpDelay + 30;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        width: 440,
        background: C.figmaSidebar,
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 600, color: C.accent, fontFamily: "system-ui", borderBottom: `2px solid ${C.accent}`, paddingBottom: 6 }}>Inspect</span>
        <span style={{ fontSize: 22, color: C.textDim, fontFamily: "system-ui" }}>Plugins</span>
      </div>

      {/* Design section */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.textMuted, fontFamily: "system-ui", marginBottom: 6 }}>Design</div>
        <div style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui", display: "flex", alignItems: "center", gap: 6 }}>
          <span>📄</span> Page
        </div>
      </div>

      {/* Code settings */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.textMuted, fontFamily: "system-ui", marginBottom: 6 }}>Code settings</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui" }}>Language</span>
          <span style={{ fontSize: 18, color: C.text, fontFamily: "SF Mono, monospace", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>CSS</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui" }}>Unit</span>
          <span style={{ fontSize: 18, color: C.text, fontFamily: "SF Mono, monospace", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>px</span>
        </div>
      </div>

      {/* ── MCP Section — the star of the show ── */}
      <div
        style={{
          background: `rgba(0, 207, 131, ${0.04 + mcpPulse * 0.06})`,
          border: `1.5px solid rgba(0, 207, 131, ${0.2 + mcpPulse * 0.3})`,
          borderRadius: 10,
          padding: 14,
          boxShadow: mcpGlow > 0 ? `0 0 ${12 + mcpPulse * 10}px rgba(0, 207, 131, ${mcpPulse * 0.15})` : "none",
          position: "relative",
        }}
      >
        {/* MCP header with icon */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: C.bg }}>⚡</div>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "system-ui" }}>MCP</span>
          </div>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.accent }}>?</div>
        </div>

        {/* Connected clients */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui", marginBottom: 5 }}>Clients</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 4 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: "#007acc" }} />
              <span style={{ fontSize: 18, color: C.text, fontFamily: "system-ui" }}>VS Code</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 4 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: "#d97706" }} />
              <span style={{ fontSize: 18, color: C.text, fontFamily: "system-ui" }}>Claude</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.04)", padding: "3px 8px", borderRadius: 4, border: "1px dashed rgba(255,255,255,0.1)" }}>
              <span style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui" }}>+ Add</span>
            </div>
          </div>
        </div>

        {/* MCP Server Link — the key part */}
        <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 16, color: C.textDim, fontFamily: "system-ui", marginBottom: 4 }}>Server URL</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <span style={{ fontSize: 18, color: C.blue, fontFamily: "SF Mono, Menlo, monospace", whiteSpace: "nowrap" }}>
                figma://mcp/bk9KBkm5C0k4...
              </span>
            </div>
            <div
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                background: copyFlash ? C.accent : "rgba(255,255,255,0.08)",
                fontSize: 16,
                fontWeight: 600,
                color: copyFlash ? C.bg : C.textMuted,
                fontFamily: "system-ui",
                whiteSpace: "nowrap",
                transition: "all 0.3s",
              }}
            >
              {copyFlash ? "✓ Copied" : "Copy"}
            </div>
          </div>
        </div>
      </div>

      {/* Variables */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.textMuted, fontFamily: "system-ui", marginBottom: 4 }}>Variables</div>
        <div style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui" }}>View details for all variables...</div>
      </div>

      {/* Flows */}
      <div>
        <div style={{ fontSize: 20, fontWeight: 600, color: C.textMuted, fontFamily: "system-ui", marginBottom: 4 }}>Flows</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {["home logged out", "delivery status", "home logged in"].map((flow, i) => (
            <span key={i} style={{ fontSize: 18, color: C.textDim, fontFamily: "system-ui" }}>{flow}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Dev Mode Button ───
const DevModeButton = ({ active = false, pulsing = false }) => {
  const frame = useCurrentFrame();
  const pulse = pulsing ? Math.sin(frame * 0.15) * 0.3 + 0.7 : 0;

  return (
    <div
      style={{
        width: 52,
        height: 42,
        borderRadius: 8,
        background: active ? C.accent : "rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 700,
        color: active ? C.bg : C.textMuted,
        fontFamily: "SF Mono, monospace",
        boxShadow: pulsing ? `0 0 ${20 + pulse * 15}px ${C.accentGlow}` : active ? `0 0 15px ${C.accentGlow}` : "none",
      }}
    >
      {"</>"}
    </div>
  );
};

/* ============================================================
   MAIN COMPOSITION — 300 frames @ 30fps = 10 seconds
   ============================================================
   0-15:    Title fade in
   15-45:   Step 1 label + Figma window appears
   45-80:   Right-click → context menu with "Duplicate" highlighted
   80-110:  Transition to Step 2 — file browser with copy
   110-160: Open the copy → no view-only banner
   160-200: Step 3 — click Dev Mode button
   200-260: Dev Mode panel slides in with MCP section
   260-300: Final summary / celebration
   ============================================================ */

export const FigmaDevModeDemo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase calculations
  const phase1 = frame >= 0 && frame < 100;    // Step 1: Duplicate
  const phase2 = frame >= 100 && frame < 190;  // Step 2: Open copy
  const phase3 = frame >= 190 && frame < 320;  // Step 3: Dev Mode
  const finale = frame >= 320;

  // Background gradient shift
  const bgHue = interpolate(frame, [0, 340], [240, 200], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 30%, hsla(${bgHue}, 40%, 8%, 1) 0%, ${C.bg} 70%)`,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── TITLE ── */}
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <FadeIn delay={0} duration={12}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: C.accent,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                  fontFamily: "SF Mono, Menlo, monospace",
                }}
              >
                MCP Tip
              </div>
            </FadeIn>
            <FadeIn delay={6} duration={15}>
              <h1
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  color: C.text,
                  margin: 0,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                }}
              >
                Figma Dev Mode
                <br />
                <span style={{ color: C.accent }}>Workaround</span>
              </h1>
            </FadeIn>
            <FadeIn delay={15} duration={12}>
              <p style={{ fontSize: 22, color: C.textMuted, marginTop: 20 }}>
                No Developer Mode access? No problem.
              </p>
            </FadeIn>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ── STEP 1: DUPLICATE ── */}
      <Sequence from={40} durationInFrames={70}>
        {(() => {
          const localFrame = frame - 40;
          const cursorX = interpolate(localFrame, [20, 35], [600, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const cursorY = interpolate(localFrame, [20, 35], [350, 420], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const showMenu = localFrame >= 30;
          const showHighlight = localFrame >= 45;

          return (
            <AbsoluteFill style={{ padding: "30px 40px" }}>
              {/* Step indicator — horizontal row */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <StepBadge number="1" label="Duplicate the file" active={true} delay={0} />
              </div>

              {/* Figma file browser mockup */}
              <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
                <FadeIn delay={5} duration={15}>
                  <FigmaWindow title="Figma — Recents" style={{ width: 1600, height: 880 }}>
                    <div style={{ padding: 36 }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 28 }}>
                        Recently viewed
                      </div>
                      <div style={{ display: "flex", gap: 32 }}>
                        <FileThumbnail
                          name="Web - McDelivery"
                          subtitle="Edited 3 months ago"
                          highlighted={localFrame >= 20}
                          delay={8}
                        />
                      </div>
                    </div>

                    {/* Context menu */}
                    {showMenu && (
                      <div style={{ position: "absolute", left: 260, top: 300 }}>
                        <ContextMenu
                          items={["Open", "Open in new tab", "---", "Copy link", "Share", "Duplicate", "---", "Move file...", "Remove from recent"]}
                          highlightIndex={showHighlight ? 5 : -1}
                          delay={0}
                        />
                      </div>
                    )}
                  </FigmaWindow>
                </FadeIn>
              </div>

              {/* Cursor */}
              {localFrame >= 20 && (
                <Cursor
                  x={cursorX + 310}
                  y={cursorY + 80}
                  delay={0}
                  clicking={localFrame >= 30 || localFrame >= 45}
                />
              )}
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* ── STEP 2: OPEN PERSONAL COPY ── */}
      <Sequence from={110} durationInFrames={80}>
        {(() => {
          const localFrame = frame - 110;
          const showCopy = localFrame >= 10;

          return (
            <AbsoluteFill style={{ padding: "30px 40px" }}>
              {/* Step indicators — horizontal row */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <StepBadge number="1" label="Duplicate the file" active={false} delay={0} />
                <StepArrow />
                <StepBadge number="2" label="Open your personal copy" active={true} delay={5} />
              </div>

              {/* File browser showing copy */}
              <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
                <FadeIn delay={3} duration={12}>
                  <FigmaWindow title="Figma — Recents" style={{ width: 1600, height: 880 }}>
                    <div style={{ padding: 36 }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 28 }}>
                        Recently viewed
                      </div>
                      <div style={{ display: "flex", gap: 32 }}>
                        {showCopy && (
                          <ScaleIn delay={10}>
                            <FileThumbnail
                              name="Web - McDelivery (Copy)"
                              subtitle="Edited just now"
                              isNew={true}
                              highlighted={localFrame >= 25}
                              delay={0}
                            />
                          </ScaleIn>
                        )}
                        <FileThumbnail
                          name="Web - McDelivery"
                          subtitle="Edited 3 months ago"
                          delay={3}
                        />
                      </div>
                    </div>
                  </FigmaWindow>
                </FadeIn>
              </div>

              {/* Annotation: "Now in your Drafts" */}
              {localFrame >= 20 && (
                <FadeIn delay={20} style={{ position: "absolute", bottom: 140, left: "50%", transform: "translateX(-50%)" }}>
                  <div
                    style={{
                      background: "rgba(0, 207, 131, 0.1)",
                      border: `1px solid rgba(0, 207, 131, 0.3)`,
                      borderRadius: 12,
                      padding: "12px 24px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>✓</span>
                    <span style={{ fontSize: 18, color: C.accent, fontWeight: 600 }}>
                      Now in your Drafts — full edit access
                    </span>
                  </div>
                </FadeIn>
              )}
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* ── STEP 3: ENABLE DEV MODE ── */}
      <Sequence from={190} durationInFrames={130}>
        {(() => {
          const localFrame = frame - 190;
          const devModeActive = localFrame >= 35;
          const showPanel = localFrame >= 40;

          return (
            <AbsoluteFill style={{ padding: "30px 40px" }}>
              {/* Step indicators — horizontal row */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <StepBadge number="1" label="Duplicate the file" active={false} delay={0} />
                <StepArrow />
                <StepBadge number="2" label="Open your copy" active={false} delay={0} />
                <StepArrow />
                <StepBadge number="3" label="Enable Dev Mode" active={true} delay={5} />
              </div>

              {/* Figma editor mockup */}
              <div style={{ display: "flex", justifyContent: "center", flex: 1 }}>
                <FadeIn delay={3} duration={12}>
                  <FigmaWindow title="Web - McDelivery (Copy) — Drafts" style={{ width: 1760, height: 860 }}>
                    <div style={{ display: "flex", height: 812 }}>
                      {/* Main canvas area */}
                      <div style={{ flex: 1, position: "relative" }}>
                        {/* Canvas with MCD UI mockups */}
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(135deg, ${C.figmaBg} 0%, #1a1a24 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 20,
                            padding: "20px 30px",
                          }}
                        >
                          {/* Frame 1: MCD Home / Menu screen */}
                          <div style={{ width: 200, height: 420, borderRadius: 10, border: devModeActive ? `2px solid ${C.blue}` : "1px solid rgba(255,255,255,0.1)", background: "#fff", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                            {/* Status bar */}
                            <div style={{ height: 24, background: "#da291c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 12, color: "white", fontWeight: 700, fontFamily: "system-ui" }}>McDelivery</span>
                            </div>
                            {/* Hero banner */}
                            <div style={{ height: 100, background: "linear-gradient(135deg, #ffbc0d 0%, #da291c 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 24, fontWeight: 900, color: "rgba(255,255,255,0.8)", fontFamily: "system-ui" }}>M</span>
                            </div>
                            {/* Menu items */}
                            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ display: "flex", gap: 4 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 6, background: "#f5e6c8" }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                  <div style={{ height: 6, width: "80%", background: "#333", borderRadius: 1 }} />
                                  <div style={{ height: 3, width: "50%", background: "#999", borderRadius: 1 }} />
                                  <div style={{ height: 5, width: 27, background: "#da291c", borderRadius: 1, marginTop: 1 }} />
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 6, background: "#e8d5b7" }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                  <div style={{ height: 6, width: "70%", background: "#333", borderRadius: 1 }} />
                                  <div style={{ height: 3, width: "40%", background: "#999", borderRadius: 1 }} />
                                  <div style={{ height: 5, width: 27, background: "#da291c", borderRadius: 1, marginTop: 1 }} />
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 4 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 6, background: "#f0dfc4" }} />
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                  <div style={{ height: 6, width: "60%", background: "#333", borderRadius: 1 }} />
                                  <div style={{ height: 3, width: "45%", background: "#999", borderRadius: 1 }} />
                                  <div style={{ height: 5, width: 27, background: "#da291c", borderRadius: 1, marginTop: 1 }} />
                                </div>
                              </div>
                            </div>
                            {/* Bottom nav */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 32, borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 8px" }}>
                              {["🏠", "🔍", "🛒", "👤"].map((e, i) => <span key={i} style={{ fontSize: 13 }}>{e}</span>)}
                            </div>
                            {/* Dev mode selection highlight */}
                            {devModeActive && <div style={{ position: "absolute", inset: 0, border: `2px solid ${C.blue}`, borderRadius: 10, pointerEvents: "none" }}><div style={{ position: "absolute", top: -10, left: 4, fontSize: 12, color: C.blue, fontFamily: "SF Mono, monospace", fontWeight: 600, background: C.figmaBg, padding: "1px 4px", borderRadius: 2 }}>375×812</div></div>}
                          </div>

                          {/* Frame 2: Cart / Checkout screen */}
                          <div style={{ width: 200, height: 420, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#fff", overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ height: 24, background: "#da291c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 12, color: "white", fontWeight: 700, fontFamily: "system-ui" }}>Cart</span>
                            </div>
                            {/* Cart items */}
                            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                              {[1, 2].map((i) => (
                                <div key={i} style={{ display: "flex", gap: 5, padding: 4, background: "#f9f6f0", borderRadius: 4 }}>
                                  <div style={{ width: 48, height: 48, borderRadius: 8, background: i === 1 ? "#f5e6c8" : "#e8d5b7" }} />
                                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                                    <div style={{ height: 6, width: "70%", background: "#333", borderRadius: 1 }} />
                                    <div style={{ height: 3, width: "40%", background: "#999", borderRadius: 1 }} />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 12, fontWeight: 700, color: "#333", fontFamily: "system-ui" }}>¥{i === 1 ? "490" : "320"}</span>
                                      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                                        <div style={{ width: 12, height: 12, borderRadius: 3, background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>-</div>
                                        <span style={{ fontSize: 12, fontFamily: "system-ui" }}>1</span>
                                        <div style={{ width: 12, height: 12, borderRadius: 3, background: "#da291c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white" }}>+</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <div style={{ height: 1, background: "#eee", margin: "2px 0" }} />
                              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2px" }}>
                                <span style={{ fontSize: 12, color: "#666", fontFamily: "system-ui" }}>Total</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#333", fontFamily: "system-ui" }}>¥810</span>
                              </div>
                              {/* Checkout button */}
                              <div style={{ height: 28, background: "#da291c", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
                                <span style={{ fontSize: 12, color: "white", fontWeight: 700, fontFamily: "system-ui" }}>Checkout</span>
                              </div>
                            </div>
                          </div>

                          {/* Frame 3: Delivery Status screen */}
                          <div style={{ width: 200, height: 420, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#fff", overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ height: 24, background: "#da291c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 12, color: "white", fontWeight: 700, fontFamily: "system-ui" }}>Delivery</span>
                            </div>
                            {/* Map area */}
                            <div style={{ height: 160, background: "linear-gradient(135deg, #e8f4e8 0%, #d4e8d4 100%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {/* Roads */}
                              <div style={{ position: "absolute", width: "100%", height: 2, background: "rgba(0,0,0,0.08)", top: "40%" }} />
                              <div style={{ position: "absolute", height: "100%", width: 2, background: "rgba(0,0,0,0.08)", left: "60%" }} />
                              <div style={{ position: "absolute", width: "100%", height: 2, background: "rgba(0,0,0,0.08)", top: "70%", transform: "rotate(-15deg)" }} />
                              {/* Delivery pin */}
                              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#da291c", border: "3px solid white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", zIndex: 2 }} />
                              {/* Destination pin */}
                              <div style={{ position: "absolute", right: 20, bottom: 15, width: 12, height: 12, borderRadius: "50%", background: C.accent, border: "2px solid white" }} />
                            </div>
                            {/* Status */}
                            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.accent }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#333", fontFamily: "system-ui" }}>On the way</span>
                              </div>
                              <div style={{ height: 6, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                                <div style={{ width: "65%", height: "100%", background: "linear-gradient(90deg, #da291c, #ffbc0d)", borderRadius: 2 }} />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 12, color: "#999", fontFamily: "system-ui" }}>Estimated</span>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#333", fontFamily: "system-ui" }}>12 min</span>
                              </div>
                              {/* Driver info */}
                              <div style={{ display: "flex", gap: 4, alignItems: "center", padding: 3, background: "#f9f6f0", borderRadius: 4, marginTop: 2 }}>
                                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#ddd" }} />
                                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                  <div style={{ height: 3, width: 30, background: "#333", borderRadius: 1 }} />
                                  <div style={{ height: 2, width: 20, background: "#999", borderRadius: 1 }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Frame 4: Store Picker / Map screen */}
                          <div style={{ width: 200, height: 420, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "#fff", overflow: "hidden", flexShrink: 0 }}>
                            <div style={{ height: 24, background: "#da291c", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <span style={{ fontSize: 12, color: "white", fontWeight: 700, fontFamily: "system-ui" }}>Stores</span>
                            </div>
                            {/* Search bar */}
                            <div style={{ margin: "5px 6px", height: 24, background: "#f0f0f0", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px" }}>
                              <span style={{ fontSize: 12, color: "#999", fontFamily: "system-ui" }}>🔍 Search stores...</span>
                            </div>
                            {/* Store list */}
                            <div style={{ padding: "0 6px", display: "flex", flexDirection: "column", gap: 4 }}>
                              {["渋谷センター街店", "新宿南口店", "池袋東口店"].map((store, i) => (
                                <div key={i} style={{ padding: 4, borderRadius: 4, border: i === 0 ? "1px solid #da291c" : "1px solid #eee", background: i === 0 ? "#fff5f5" : "white" }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: "#333", fontFamily: "system-ui" }}>{store}</div>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                                    <span style={{ fontSize: 12, color: "#999", fontFamily: "system-ui" }}>{["0.3km", "0.8km", "1.2km"][i]}</span>
                                    <span style={{ fontSize: 12, color: C.accent, fontWeight: 600, fontFamily: "system-ui" }}>Open</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom toolbar */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 16,
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: C.figmaToolbar,
                            padding: "6px 12px",
                            borderRadius: 10,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {/* Tool icons */}
                          {["▸", "✋", "□", "○", "T"].map((icon, i) => (
                            <div
                              key={i}
                              style={{
                                width: 42,
                                height: 36,
                                borderRadius: 6,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                                color: C.textDim,
                              }}
                            >
                              {icon}
                            </div>
                          ))}
                          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />
                          <DevModeButton active={devModeActive} pulsing={localFrame >= 20 && !devModeActive} />
                        </div>

                        {/* Cursor pointing to Dev Mode button */}
                        {localFrame >= 20 && localFrame < 40 && (
                          <Cursor
                            x={545}
                            y={395}
                            delay={0}
                            clicking={localFrame >= 33}
                          />
                        )}
                      </div>

                      {/* Dev Mode Panel */}
                      {showPanel && <DevModePanel delay={40} />}
                    </div>
                  </FigmaWindow>
                </FadeIn>
              </div>
            </AbsoluteFill>
          );
        })()}
      </Sequence>

      {/* ── FINALE ── */}
      <Sequence from={320} durationInFrames={20}>
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ScaleIn delay={0}>
            <div
              style={{
                textAlign: "center",
                background: "rgba(0, 207, 131, 0.05)",
                border: `1px solid rgba(0, 207, 131, 0.2)`,
                borderRadius: 24,
                padding: "40px 60px",
              }}
            >
              <div style={{ fontSize: 48, fontWeight: 800, color: C.text, marginBottom: 12 }}>
                Now use <span style={{ color: C.accent }}>Figma MCP</span>
              </div>
              <div style={{ fontSize: 22, color: C.textMuted }}>
                to its full potential
              </div>
            </div>
          </ScaleIn>
        </AbsoluteFill>
      </Sequence>

      {/* ── PROGRESS BAR ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${(frame / 340) * 100}%`,
          background: `linear-gradient(90deg, ${C.accent}, ${C.blue})`,
          boxShadow: `0 0 10px ${C.accentGlow}`,
        }}
      />
    </AbsoluteFill>
  );
};
