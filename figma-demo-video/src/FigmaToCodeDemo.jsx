import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
} from "remotion";

/* ============================================================
   FIGMA → TAILWIND CODE DEMO
   Split screen: code editor (left) + LIVE preview (right)
   Right panel is real rendered React components, not a screenshot.
   ============================================================ */

// ─── Colors ───
const C = {
  bg: "#0a0a0f",
  editorBg: "#1e1e2e",
  editorText: "#cdd6f4",
  editorComment: "#6c7086",
  editorString: "#a6e3a1",
  editorTag: "#89b4fa",
  editorAttr: "#f9e2af",
  editorClassName: "#94e2d5",
  accent: "#00cf83",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.5)",
  // McD
  mcdText: "#292929",
  mcdMuted: "#6f6f6f",
  mcdBorder: "#e0e0e0",
  mcdYellow: "#ffbc0d",
  mcdGreen: "#00a651",
};

// ─── Code snippets ───
const CODE_PHASES = [
  {
    id: "header",
    lines: [
      { type: "comment", text: "// McDelivery - ご注文内容の確認" },
      { type: "tag", text: '<div class="flex flex-col items-center pt-8 gap-8">' },
      { type: "mixed", parts: [
        { text: '  <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"w-[51px] h-[51px]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '    <img ', color: C.editorTag },
        { text: 'src=', color: C.editorAttr },
        { text: '"assets/delivery-logo.svg"', color: C.editorString },
        { text: ' />', color: C.editorTag },
      ]},
      { type: "tag", text: '  </div>' },
      { type: "mixed", parts: [
        { text: '  <p ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"font-w7 text-[28px] text-center"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "string", text: '    ご注文内容の確認' },
      { type: "tag", text: '  </p>' },
    ],
  },
  {
    id: "priceSidebar",
    lines: [
      { type: "empty" },
      { type: "comment", text: "  {/* Price Sidebar */}" },
      { type: "mixed", parts: [
        { text: '  <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"w-[220px] shrink-0"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '    <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"border border-[#e0e0e0] rounded', color: C.editorClassName },
      ]},
      { type: "mixed", parts: [
        { text: '      flex flex-col gap-4 p-5"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '      <span ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"font-w7 text-[28px]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "string", text: '        ¥ 2,100' },
      { type: "tag", text: '      </span>' },
      { type: "mixed", parts: [
        { text: '      <button ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"w-full py-3 bg-[#e0e0e0]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "string", text: '        次へ' },
      { type: "tag", text: '      </button>' },
      { type: "tag", text: '    </div>' },
      { type: "tag", text: '  </div>' },
      { type: "tag", text: '</div>' },
    ],
  },
  {
    id: "delivery",
    lines: [
      { type: "empty" },
      { type: "comment", text: "  {/* お届け先・配達日時 */}" },
      { type: "mixed", parts: [
        { text: '  <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"flex gap-5 w-[1024px]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '    <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"w-[200px] shrink-0"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '      <p ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"font-w7 text-[13px] text-[#292929]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "string", text: '        お届け先' },
      { type: "tag", text: '      </p>' },
      { type: "string", text: '    東京都港区虎ノ門4-3-13...' },
      { type: "tag", text: '    </div>' },
      { type: "tag", text: '  </div>' },
    ],
  },
  {
    id: "payment",
    lines: [
      { type: "empty" },
      { type: "comment", text: "    {/* お支払い方法 */}" },
      { type: "mixed", parts: [
        { text: '    <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"flex flex-col gap-6"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '      <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"flex gap-3"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "comment", text: "        {/* PayPay */}" },
      { type: "mixed", parts: [
        { text: '        <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"flex-1 border border-[#e0e0e0]', color: C.editorClassName },
      ]},
      { type: "mixed", parts: [
        { text: '          rounded-[9px] shadow p-2"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '          <img ', color: C.editorTag },
        { text: 'src=', color: C.editorAttr },
        { text: '"assets/paypay-p.svg"', color: C.editorString },
        { text: ' />', color: C.editorTag },
      ]},
      { type: "tag", text: '        </div>' },
      { type: "comment", text: "        {/* d払い, 楽天ペイ... */}" },
      { type: "comment", text: "      {/* 現金支払い (selected) */}" },
      { type: "mixed", parts: [
        { text: '      <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"border-2 border-[#ffbc0d]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "tag", text: '      </div>' },
    ],
  },
  {
    id: "orderItems",
    lines: [
      { type: "empty" },
      { type: "comment", text: "    {/* ご注文内容 */}" },
      { type: "mixed", parts: [
        { text: '    <div ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"flex items-start gap-4 py-5', color: C.editorClassName },
      ]},
      { type: "mixed", parts: [
        { text: '      border-b border-[#e0e0e0]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '      <img ', color: C.editorTag },
        { text: 'src=', color: C.editorAttr },
        { text: '"assets/product-1.png"', color: C.editorString },
      ]},
      { type: "mixed", parts: [
        { text: '        class=', color: C.editorAttr },
        { text: '"w-[62px] object-contain"', color: C.editorClassName },
        { text: ' />', color: C.editorTag },
      ]},
      { type: "mixed", parts: [
        { text: '      <p ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"font-w7 text-[13px]"', color: C.editorClassName },
        { text: '>', color: C.editorTag },
      ]},
      { type: "string", text: '        ビッグマック® セット' },
      { type: "tag", text: '      </p>' },
      { type: "mixed", parts: [
        { text: '      <span ', color: C.editorTag },
        { text: 'class=', color: C.editorAttr },
        { text: '"font-speedee text-[18px]"', color: C.editorClassName },
        { text: '>¥600</span>', color: C.editorTag },
      ]},
    ],
  },
];

const ALL_LINES = CODE_PHASES.flatMap((p) => p.lines);

// ─── Shared inline style helpers ───
// Sizes match the real HTML (1024px layout), scaled down via transform
const S = {
  fontW4: { fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif", fontWeight: 400 },
  fontW7: { fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif", fontWeight: 700 },
  fontSpeedee: { fontFamily: "'Speedee', 'Hiragino Sans', sans-serif", fontWeight: 700 },
};

// ─── Timer ───
const Timer = ({ frame, startFrame }) => {
  const elapsed = Math.max(0, (frame - startFrame) / 30);
  return (
    <div style={{
      position: "absolute", top: 20, right: 24,
      fontFamily: "SF Mono, Menlo, monospace", fontSize: 16,
      color: C.accent, background: "rgba(0,0,0,0.6)",
      padding: "6px 14px", borderRadius: 8,
      border: "1px solid rgba(0, 207, 131, 0.3)", zIndex: 50,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accent}` }} />
      {elapsed.toFixed(1)}s
    </div>
  );
};

// ─── Code Editor (left panel) ───
const CodeEditor = ({ visibleLines, frame }) => {
  const lineHeight = 22;
  const totalVisibleCount = Math.ceil(visibleLines);
  const linesToShow = ALL_LINES.slice(0, totalVisibleCount);
  // Panel is ~918px tall (1080 - padding - top bar - tab bar). Fill the full height.
  const maxVisible = 40;
  const scrollOffset = linesToShow.length > maxVisible ? (linesToShow.length - maxVisible) * lineHeight : 0;

  return (
    <div style={{ flex: "0 0 560px", background: C.editorBg, display: "flex", flexDirection: "column", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Tab bar */}
      <div style={{ height: 36, background: "#181825", display: "flex", alignItems: "center", paddingLeft: 16, gap: 2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ padding: "6px 16px", fontSize: 18, fontFamily: "system-ui", color: C.editorText, background: C.editorBg, borderTop: `2px solid ${C.accent}`, fontWeight: 600 }}>
          checkout.html
        </div>
        <div style={{ padding: "6px 16px", fontSize: 18, fontFamily: "system-ui", color: C.editorComment }}>
          tailwind.config.js
        </div>
      </div>
      {/* Code area */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 12, left: 0, right: 0, transform: `translateY(${-scrollOffset}px)` }}>
          {linesToShow.map((line, i) => {
            const isLatest = i >= totalVisibleCount - 2;
            const lineOpacity = i < totalVisibleCount - 1 ? 1 : visibleLines - Math.floor(visibleLines);
            return (
              <div key={i} style={{ height: lineHeight, display: "flex", alignItems: "center", fontSize: 18, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", opacity: lineOpacity, background: isLatest ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <div style={{ width: 48, textAlign: "right", paddingRight: 12, color: isLatest ? C.editorComment : "rgba(255,255,255,0.12)", fontSize: 16, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ whiteSpace: "pre" }}>{renderCodeLine(line)}</div>
              </div>
            );
          })}
          {totalVisibleCount > 0 && (
            <div style={{
              position: "absolute",
              top: (totalVisibleCount - 1) * lineHeight + 4,
              left: 48 + getLineWidth(linesToShow[linesToShow.length - 1]),
              width: 2, height: 16, background: C.accent,
              opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0.2,
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

function getLineWidth(line) {
  if (!line) return 0;
  if (line.type === "empty") return 0;
  if (line.type === "mixed") return line.parts.reduce((s, p) => s + p.text.length, 0) * 7.5;
  return (line.text || "").length * 7.5;
}

function renderCodeLine(line) {
  if (!line) return null;
  if (line.type === "empty") return " ";
  if (line.type === "comment") return <span style={{ color: C.editorComment }}>{line.text}</span>;
  if (line.type === "string") return <span style={{ color: C.editorString }}>{line.text}</span>;
  if (line.type === "tag") return <span style={{ color: C.editorTag }}>{line.text}</span>;
  if (line.type === "mixed") return line.parts.map((p, i) => <span key={i} style={{ color: p.color }}>{p.text}</span>);
  return <span style={{ color: C.editorText }}>{line.text}</span>;
}

// ═══════════════════════════════════════════════════════════
// LIVE PREVIEW — Real rendered McDelivery checkout components
// ═══════════════════════════════════════════════════════════

// Divider line
const Divider = () => <div style={{ height: 1, background: C.mcdBorder, width: "100%" }} />;

// Label + value row (narrower label to give more room to content + sidebar)
const FormRow = ({ label, children }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", width: "100%" }}>
    <div style={{ width: 140, flexShrink: 0 }}>
      <p style={{ ...S.fontW7, fontSize: 18, lineHeight: "24px", color: C.mcdText }}>{label}</p>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
  </div>
);

// Payment tile with image area (matches HTML: h-[80px] image, gap-[10px], rounded-[9px])
const PaymentTile = ({ children, label }) => (
  <div style={{
    flex: "1 1 0", minWidth: 0, background: "white",
    border: `1px solid ${C.mcdBorder}`,
    borderRadius: 9, boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.2)",
    padding: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    position: "relative",
  }}>
    <div style={{ height: 80, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {children}
    </div>
    <p style={{ ...S.fontW7, fontSize: 18, lineHeight: "24px", color: "#2d2d2d", textAlign: "center", whiteSpace: "nowrap" }}>{label}</p>
  </div>
);

// Cash payment tile (selected, matches HTML: h-[64px], border-2 gold, centered text)
const CashTile = () => (
  <div style={{
    flex: "1 1 0", minWidth: 0, background: "white",
    border: `2px solid ${C.mcdYellow}`,
    borderRadius: 9, boxShadow: "0px 1px 4px 0px rgba(0,0,0,0.2)",
    padding: 8, height: 64,
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  }}>
    <p style={{ ...S.fontW7, fontSize: 18, lineHeight: "24px", color: "#2d2d2d", textAlign: "center" }}>現金支払い</p>
    {/* Gold checkmark (top-right, matches HTML: w-6 h-6) */}
    <div style={{ position: "absolute", right: 0, top: 0, width: 24, height: 24 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11.5" fill="#FFBC0D" stroke="#FFBC0D"/>
      </svg>
      <svg width="13" height="10" viewBox="0 0 12.958 9.707" fill="none" style={{ position: "absolute", top: 7, left: 5.5 }}>
        <path d="M12.958 1.475L4.977 8.945L4.163 9.707L3.495 8.798L0 4.041L1.598 2.86L4.425 6.706L11.591 0L12.958 1.475Z" fill="#292929"/>
      </svg>
    </div>
  </div>
);

// Order item (matches HTML: gap-4, py-5, w-[54px] image, w-[72px] button)
const OrderItem = ({ showBorder, opacity }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", gap: 16, padding: "20px 0",
    borderBottom: showBorder ? `1px solid ${C.mcdBorder}` : "none",
    opacity,
  }}>
    <div style={{ width: 54, height: 54, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "visible" }}>
      <Img src={staticFile("assets/product-1.png")} style={{ width: 62, height: "auto", objectFit: "contain" }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ ...S.fontW7, fontSize: 18, lineHeight: "24px", color: C.mcdText }}>ビッグマック® セット</p>
      <p style={{ ...S.fontW4, fontSize: 16, lineHeight: "22px", color: C.mcdMuted, marginTop: 2 }}>マックフライポテト（M）</p>
      <p style={{ ...S.fontW4, fontSize: 16, lineHeight: "22px", color: C.mcdMuted }}>アールグレイ アイスティー(ストレート)(M)</p>
      <div style={{ display: "flex", alignItems: "center", gap: 2, marginTop: 4 }}>
        <span style={{ ...S.fontW7, fontSize: 16, lineHeight: "24px", color: "#2d2d2d" }}>￥</span>
        <span style={{ ...S.fontSpeedee, fontSize: 18, lineHeight: "24px", color: "#2d2d2d" }}>600</span>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
      <div style={{ width: 72, height: 36, background: "white", border: `1px solid ${C.mcdText}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...S.fontW4, fontSize: 18, lineHeight: "24px", color: C.mcdText }}>変更</span>
      </div>
      <div style={{ width: 93, height: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Img src={staticFile("assets/counter-minus.svg")} style={{ width: 20, height: 20 }} />
        <span style={{ ...S.fontSpeedee, fontSize: 18, lineHeight: "22px", color: "black" }}>1</span>
        <Img src={staticFile("assets/counter-plus.svg")} style={{ width: 20, height: 20 }} />
      </div>
    </div>
  </div>
);

// Sidebar (matches HTML: w-[220px], gap-4, p-5, text-[28px] total)
// progress: 0→1 controls progressive reveal of sidebar elements
const PriceSidebar = ({ progress }) => {
  // Break into 5 reveal stages as code is typed
  const boxOp = Math.min(1, progress / 0.15);           // 0–15%: outer container
  const subtotalOp = Math.min(1, Math.max(0, (progress - 0.15) / 0.15));  // 15–30%: subtotal + delivery
  const totalOp = Math.min(1, Math.max(0, (progress - 0.35) / 0.15));     // 35–50%: total price
  const termsOp = Math.min(1, Math.max(0, (progress - 0.55) / 0.15));     // 55–70%: terms + checkbox
  const buttonsOp = Math.min(1, Math.max(0, (progress - 0.75) / 0.2));    // 75–95%: buttons

  return (
    <div style={{
      width: 220, flexShrink: 0, opacity: boxOp,
    }}>
      <div style={{
        background: "white", border: `1px solid ${C.mcdBorder}`, borderRadius: 4,
        display: "flex", flexDirection: "column", gap: 16, padding: 20,
      }}>
        <div style={{ opacity: subtotalOp, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...S.fontW4, fontSize: 18, color: C.mcdMuted }}>小計</span>
          <span style={{ ...S.fontW4, fontSize: 18, color: C.mcdText }}>¥ 1,800</span>
        </div>
        <div style={{ opacity: subtotalOp, display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 16, borderBottom: `1px solid ${C.mcdBorder}` }}>
          <span style={{ ...S.fontW4, fontSize: 18, color: C.mcdMuted }}>デリバリー料</span>
          <span style={{ ...S.fontW4, fontSize: 18, color: C.mcdText }}>¥ 300</span>
        </div>
        <div style={{ opacity: totalOp, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ ...S.fontW7, fontSize: 18, color: C.mcdText }}>合計</span>
          <span style={{ ...S.fontW7, fontSize: 28, lineHeight: "36px", color: C.mcdText }}>¥ 2,100</span>
        </div>
        <p style={{ ...S.fontW4, fontSize: 16, lineHeight: "22px", color: C.mcdText, marginTop: 8, opacity: termsOp }}>
          配達のため、個人情報を委託先の企業に提供する場合がございます。
        </p>
        <div style={{ opacity: termsOp, display: "flex", alignItems: "flex-start", gap: 8, marginTop: 8 }}>
          <div style={{ width: 24, height: 24, flexShrink: 0, position: "relative", marginTop: 2 }}>
            <div style={{ position: "absolute", left: 3, top: 3, width: 18, height: 18, border: "1px solid #959595", borderRadius: 3, background: "white" }} />
          </div>
          <span style={{ ...S.fontW4, fontSize: 16, lineHeight: "22px", color: C.mcdText }}>マックデリバリー利用規約に同意します</span>
        </div>
        <div style={{ opacity: buttonsOp, width: "100%", padding: "12px 0", background: C.mcdBorder, borderRadius: 4, textAlign: "center", marginTop: 8 }}>
          <span style={{ ...S.fontW7, fontSize: 18, color: C.mcdMuted }}>次へ</span>
        </div>
        <div style={{ opacity: buttonsOp, width: "100%", padding: "12px 0", background: "white", border: `1px solid ${C.mcdText}`, borderRadius: 4, textAlign: "center" }}>
          <span style={{ ...S.fontW7, fontSize: 18, color: C.mcdText }}>メニューに戻る</span>
        </div>
      </div>
    </div>
  );
};

// ─── Live Preview (right panel) ───
const LivePreview = ({ visibleSections, sectionProgress, scrollY }) => {
  // Phase order: 0=header, 1=priceSidebar, 2=delivery, 3=payment, 4=orderItems
  const headerOp = visibleSections >= 1 ? 1 : 0;
  const deliveryOp = visibleSections >= 3 ? Math.min(1, sectionProgress[2] || 0) : 0;
  const paymentOp = visibleSections >= 4 ? Math.min(1, sectionProgress[3] || 0) : 0;
  const orderOp = visibleSections >= 5 ? Math.min(1, sectionProgress[4] || 0) : 0;
  const footerOp = orderOp;

  // Sticky sidebar: starts at the top, stays there as content scrolls
  const sidebarTop = 10;

  return (
    <div style={{ flex: 1, background: "#f5f5f5", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Browser chrome */}
      <div style={{ height: 36, background: "#e8e8e8", display: "flex", alignItems: "center", padding: "0 12px", gap: 8, borderBottom: "1px solid #d0d0d0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 22, background: "white", borderRadius: 6, display: "flex", alignItems: "center", padding: "0 10px", fontSize: 16, color: "#666", fontFamily: "system-ui" }}>
          localhost:3000/checkout
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflow: "hidden", background: "white", position: "relative" }}>
        {/* Single centered 1024px container — content + sidebar share one coordinate system */}
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          marginLeft: -512,
          width: 1024,
          height: "100%",
          transform: "scale(1.20)",
          transformOrigin: "top center",
        }}>
          {/* Scrolling content */}
          <div style={{
            transform: `translateY(${-scrollY}px)`,
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: 32, gap: 32,
          }}>
            {/* Header: Logo + Title */}
            <div style={{ opacity: headerOp, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 51, height: 51, overflow: "hidden" }}>
                <Img src={staticFile("assets/delivery-logo.svg")} style={{ width: "100%", height: "100%" }} />
              </div>
              <p style={{ ...S.fontW7, fontSize: 28, lineHeight: "36px", color: C.mcdText, textAlign: "center" }}>
                ご注文内容の確認
              </p>
            </div>

            {/* Two-column layout (matches HTML: w-[1024px], gap-5) */}
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start", width: 1024 }}>
              {/* Left column */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24, minWidth: 0 }}>

                {/* お届け先 */}
                <div style={{ opacity: deliveryOp }}>
                  <Divider />
                  <div style={{ marginTop: 24 }}>
                    <FormRow label="お届け先">
                      <p style={{ ...S.fontW4, fontSize: 18, lineHeight: "24px", color: C.mcdText }}>
                        東京都港区虎ノ門4-3-13 虎ノ門ビル101 日本マクドナルド株式会社 営業部
                      </p>
                    </FormRow>
                  </div>
                </div>

                {/* 予定配達日時 */}
                <div style={{ opacity: deliveryOp }}>
                  <Divider />
                  <div style={{ marginTop: 24 }}>
                    <FormRow label="予定配達日時">
                      <p style={{ ...S.fontW4, fontSize: 18, lineHeight: "24px", color: C.mcdText }}>
                        202X年12月31日　12:00-12:20
                      </p>
                    </FormRow>
                  </div>
                </div>

                {/* お支払い方法 */}
                <div style={{ opacity: paymentOp }}>
                  <Divider />
                  <div style={{ marginTop: 24 }}>
                    <FormRow label="お支払い方法">
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Section header */}
                        <div style={{ display: "flex", gap: 12 }}>
                          <p style={{ ...S.fontW4, fontSize: 18, color: C.mcdText, whiteSpace: "nowrap" }}>オンライン決済</p>
                          <p style={{ ...S.fontW4, fontSize: 18, color: C.mcdMuted }}>メールでレシートをお送りします</p>
                        </div>
                        {/* Row 1 (matches HTML: gap-3) */}
                        <div style={{ display: "flex", gap: 12 }}>
                          <PaymentTile label="PayPay（残高払い）">
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Img src={staticFile("assets/paypay-p.svg")} style={{ height: 27 }} />
                              <Img src={staticFile("assets/paypay-text.svg")} style={{ height: 20 }} />
                            </div>
                          </PaymentTile>
                          <PaymentTile label="d払い">
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Img src={staticFile("assets/dpay-logo1.svg")} style={{ height: 27 }} />
                              <Img src={staticFile("assets/dpay-logo2.svg")} style={{ height: 24 }} />
                            </div>
                          </PaymentTile>
                          <PaymentTile label="楽天ペイ">
                            <div style={{ position: "relative", width: 94, height: 43 }}>
                              <Img src={staticFile("assets/rpay-logo1.svg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                              <Img src={staticFile("assets/rpay-logo2.svg")} style={{ position: "absolute", width: 44, height: 25, top: 9, left: 43 }} />
                              <Img src={staticFile("assets/rpay-logo3.svg")} style={{ position: "absolute", width: 25, height: 27, top: 8, left: 7 }} />
                            </div>
                          </PaymentTile>
                        </div>
                        {/* Row 2 */}
                        <div style={{ display: "flex", gap: 12 }}>
                          <PaymentTile label="LINE Pay">
                            <Img src={staticFile("assets/linepay-real.svg")} style={{ height: 29 }} />
                          </PaymentTile>
                          <PaymentTile label="クレジットカード">
                            <div style={{ position: "relative", width: 64, height: 41 }}>
                              <div style={{ position: "absolute", inset: 0, border: "1.6px solid black", borderRadius: 3, background: "linear-gradient(90deg, rgba(255,188,13,0.2), rgba(255,188,13,0.2)), white" }} />
                              <div style={{ position: "absolute", left: 0, top: 6.4, width: "100%", height: 6.5, background: C.mcdText }} />
                              <div style={{ position: "absolute", borderRadius: 1, left: 46.8, top: 28.2, width: 12.9, height: 8.1, background: C.mcdYellow }} />
                            </div>
                          </PaymentTile>
                          <div style={{ flex: "1 1 0", minWidth: 0 }} />
                        </div>
                        {/* その他 */}
                        <div style={{ display: "flex", gap: 12 }}>
                          <p style={{ ...S.fontW4, fontSize: 18, color: C.mcdText, whiteSpace: "nowrap" }}>その他</p>
                          <p style={{ ...S.fontW4, fontSize: 18, color: C.mcdMuted }}>紙のレシートをお渡しします</p>
                        </div>
                        <div style={{ display: "flex", gap: 12 }}>
                          <CashTile />
                          <div style={{ flex: "1 1 0", minWidth: 0 }} />
                          <div style={{ flex: "1 1 0", minWidth: 0 }} />
                        </div>
                      </div>
                    </FormRow>
                  </div>
                </div>

                {/* クーポンコード */}
                <div style={{ opacity: paymentOp }}>
                  <Divider />
                  <div style={{ marginTop: 24 }}>
                    <FormRow label="クーポンコード">
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ flex: 1, height: 36, border: "1px solid #d6d6d6", borderRadius: 4, display: "flex", alignItems: "center", paddingLeft: 12 }}>
                          <span style={{ ...S.fontW4, fontSize: 18, color: "#959595" }}>例: ED234</span>
                        </div>
                        <div style={{ height: 36, padding: "0 16px", border: `1px solid ${C.mcdText}`, borderRadius: 4, display: "flex", alignItems: "center" }}>
                          <span style={{ ...S.fontW7, fontSize: 18, color: C.mcdText, whiteSpace: "nowrap" }}>クーポンを使う</span>
                        </div>
                      </div>
                    </FormRow>
                  </div>
                </div>

                {/* ご注文内容 */}
                <div style={{ opacity: orderOp }}>
                  <Divider />
                  <div style={{ marginTop: 24 }}>
                    <FormRow label="ご注文内容">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <OrderItem showBorder opacity={1} />
                        <OrderItem showBorder opacity={1} />
                        <OrderItem showBorder={false} opacity={1} />
                      </div>
                    </FormRow>
                  </div>
                </div>
              </div>

              {/* Spacer for sidebar in flow layout */}
              <div style={{ width: 220, flexShrink: 0 }} />
            </div>

            {/* Footer */}
            <div style={{ opacity: footerOp, width: 1024 }}>
              <Divider />
              <div style={{ display: "flex", justifyContent: "center", padding: "48px 0", gap: 32 }}>
                {["©2021 McDonald's. All Rights Reserved.", "利用規約", "個人情報保護方針", "法律に基づく情報"].map((t) => (
                  <span key={t} style={{ ...S.fontW4, fontSize: 16, color: C.mcdMuted }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky sidebar — outside scrolling div so it doesn't move with content */}
          <div style={{
            position: "absolute",
            top: sidebarTop,
            right: 0,
          }}>
            <PriceSidebar progress={sectionProgress[1] || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN COMPOSITION — 360 frames @ 30fps = 12 seconds
   0-10:    Fade in
   10-340:  Code streams left, live preview builds right
   340-360: Hold final result
   ============================================================ */
export const FigmaToCodeDemo = () => {
  const frame = useCurrentFrame();
  const codingStart = 10;
  const codingEnd = 340;

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const totalLines = ALL_LINES.length;
  const codeProgress = interpolate(frame, [codingStart, codingEnd], [0, totalLines], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Track visible sections and progress within each
  let visibleSections = 0;
  let linesSoFar = 0;
  const sectionProgress = [];
  const phaseCumulativeLines = [];
  for (let i = 0; i < CODE_PHASES.length; i++) {
    const sectionLines = CODE_PHASES[i].lines.length;
    const sectionStart = linesSoFar;
    linesSoFar += sectionLines;
    phaseCumulativeLines.push(linesSoFar);
    if (codeProgress >= sectionStart + 1) {
      visibleSections = i + 1;
    }
    const prog = Math.min(1, Math.max(0, (codeProgress - sectionStart) / sectionLines));
    sectionProgress.push(prog);
  }

  // Scroll the preview as left-column content builds up.
  // Sidebar code is written in phase 1, so it's already visible during phases 2-4.
  // Scrolling during payment/orderItems demonstrates the sidebar's sticky behavior.
  const paymentMid = phaseCumulativeLines[2] + (phaseCumulativeLines[3] - phaseCumulativeLines[2]) * 0.4;
  const scrollY = interpolate(
    codeProgress,
    [
      phaseCumulativeLines[2],  // end of delivery — no scroll yet
      paymentMid,               // midway through payment — start scrolling
      phaseCumulativeLines[3],  // end of payment
      phaseCumulativeLines[4],  // end of orderItems — max scroll
    ],
    [0, 0, 250, 750],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const bgHue = interpolate(frame, [0, 360], [240, 200], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 30% 30%, hsla(${bgHue}, 40%, 8%, 1) 0%, ${C.bg} 70%)`,
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <AbsoluteFill style={{ opacity: fadeIn, display: "flex", padding: "54px 24px 24px 24px" }}>
        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 48, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 18, fontFamily: "SF Mono, Menlo, monospace" }}>
            <span style={{ color: C.textMuted }}>Figma</span>
            <span style={{ color: C.accent, fontSize: 16 }}>→</span>
            <span style={{ color: C.accent, fontWeight: 700 }}>Tailwind + HTML</span>
          </div>
        </div>

        {frame >= codingStart && <Timer frame={frame} startFrame={codingStart} />}

        {/* Split panels */}
        <div style={{ display: "flex", flex: 1, marginTop: 48, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}>
          <CodeEditor visibleLines={codeProgress} frame={frame} />
          <LivePreview visibleSections={visibleSections} sectionProgress={sectionProgress} scrollY={scrollY} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
