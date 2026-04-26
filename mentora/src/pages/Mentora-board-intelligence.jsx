import { useState, useEffect, useRef } from "react";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #070706;
  --bg1:      #0D0C0A;
  --bg2:      #121008;
  --bg3:      #1A1712;
  --bg4:      #211E18;
  --border:   rgba(255,255,255,.055);
  --border2:  rgba(255,255,255,.10);
  --border3:  rgba(255,255,255,.16);
  --gold:     #C9A96E;
  --gold-lt:  #E8D5A8;
  --gold-dk:  #8A6A3E;
  --gold-xs:  #4A3A20;
  --text:     #F0EDE8;
  --text2:    #C4BFB8;
  --muted:    #78736C;
  --muted2:   #3C3830;
  --green:    #52C98A;
  --green-dk: #2A7A55;
  --red:      #E07070;
  --red-dk:   #8A3030;
  --amber:    #D4A840;
}

html { scroll-behavior: smooth; }
body {
  font-family: 'Outfit', sans-serif;
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  cursor: none;
}
::selection { background: var(--gold-dk); color: var(--text); }
::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--gold-dk); border-radius: 2px; }

.serif  { font-family: 'Cormorant Garamond', serif; }
.mono   { font-family: 'DM Mono', monospace; }

/* — Noise grain overlay — */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity: .32;
}

/* — Custom cursor — */
#cur  { position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none; width: 7px; height: 7px; border-radius: 50%; background: var(--gold); transform: translate(-50%,-50%); }
#curR { position: fixed; top: 0; left: 0; z-index: 9998; pointer-events: none; width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(201,169,110,.4); transform: translate(-50%,-50%); transition: all .14s cubic-bezier(.22,1,.36,1); }

/* — Ambient depth orbs — */
.orb { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
@keyframes breathe { 0%,100%{opacity:.25} 50%{opacity:.65} }
.orb { animation: breathe 8s ease-in-out infinite; }

/* — Navigation — */
.nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(7,7,6,.88);
  backdrop-filter: blur(32px) saturate(1.6);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 1320px; margin: 0 auto;
  padding: 0 48px;
  height: 58px;
  display: flex; align-items: center; gap: 20px;
}

/* — Page wrapper — */
.page { max-width: 1320px; margin: 0 auto; padding: 56px 48px 96px; position: relative; z-index: 1; }

/* — Glass card — */
.gc {
  background: linear-gradient(145deg, rgba(26,23,18,.97), rgba(14,12,9,.99));
  border: 1px solid var(--border);
  border-radius: 3px;
  position: relative; overflow: hidden;
  transition: border-color .4s, box-shadow .4s, transform .4s cubic-bezier(.22,1,.36,1);
}
.gc::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(201,169,110,.04), transparent 60%);
  opacity: 0; transition: opacity .4s; pointer-events: none;
}
.gc.hov:hover::before { opacity: 1; }
.gc.hov:hover { border-color: rgba(201,169,110,.16); transform: translateY(-3px); box-shadow: 0 18px 50px rgba(0,0,0,.55), 0 0 0 1px rgba(201,169,110,.06); }

/* — Gold gradient text — */
.gt { background: linear-gradient(135deg, var(--gold-lt) 0%, var(--gold) 50%, var(--gold-dk) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

/* — Section labels — */
.section-eyebrow {
  font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--gold); font-weight: 500; font-family: 'DM Mono', monospace;
  display: flex; align-items: center; gap: 10px;
}
.section-eyebrow::before { content: ''; display: inline-block; width: 20px; height: 1px; background: var(--gold-dk); }

/* — Badges — */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 2px;
  font-size: 10px; font-weight: 500; letter-spacing: .07em; text-transform: uppercase;
}
.badge-green  { background: rgba(82,201,138,.1);  border: 1px solid rgba(82,201,138,.22);  color: var(--green); }
.badge-red    { background: rgba(224,112,112,.1);  border: 1px solid rgba(224,112,112,.22); color: var(--red); }
.badge-gold   { background: rgba(201,169,110,.1);  border: 1px solid rgba(201,169,110,.22); color: var(--gold); }
.badge-amber  { background: rgba(212,168,64,.1);   border: 1px solid rgba(212,168,64,.22);  color: var(--amber); }
.badge-muted  { background: rgba(120,115,108,.1);  border: 1px solid rgba(120,115,108,.22); color: var(--muted); }

/* — Gold horizontal rule — */
.gold-rule { height: 1px; background: linear-gradient(90deg, transparent, rgba(201,169,110,.3), transparent); border: none; }

/* — Reveal animations — */
.rev     { opacity: 0; transform: translateY(26px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
.rev.on  { opacity: 1; transform: none; }
.revL    { opacity: 0; transform: translateX(-22px); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
.revL.on { opacity: 1; transform: none; }
.revS    { opacity: 0; transform: scale(.95); transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
.revS.on { opacity: 1; transform: none; }

/* — Progress bar — */
.pbar-track { height: 4px; background: rgba(255,255,255,.055); border-radius: 2px; overflow: hidden; }
.pbar-fill  { height: 100%; border-radius: 2px; transition: width 1.5s cubic-bezier(.22,1,.36,1); }

/* — KPI grid — */
.kpi-row  { display: flex; align-items: baseline; gap: 6px; }

/* — Divider line — */
.divider { height: 1px; background: var(--border); margin: 0; border: none; }

/* — Monospace value — */
.mono-val { font-family: 'DM Mono', monospace; }

/* — Count bounce — */
@keyframes val-pop { 0%{transform:scale(1)} 40%{transform:scale(1.06)} 75%{transform:scale(.97)} 100%{transform:scale(1)} }
.popped { animation: val-pop .5s cubic-bezier(.22,1,.36,1); }

/* — Circle progress — */
.circle-track { fill: none; stroke: rgba(255,255,255,.06); }
.circle-fill  { fill: none; stroke-linecap: round; transition: stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1); }

/* — Tier card — */
.tier-card {
  background: rgba(255,255,255,.025); border: 1px solid var(--border);
  border-radius: 3px; padding: 22px 24px;
  transition: all .35s cubic-bezier(.22,1,.36,1); position: relative; overflow: hidden;
}
.tier-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; border-radius: 1px; transition: opacity .35s; }
.tier-card:hover { border-color: var(--border2); transform: translateY(-2px); }

/* — Risk KPI — */
.risk-kpi {
  background: rgba(255,255,255,.025); border: 1px solid var(--border);
  border-radius: 3px; padding: 18px 20px;
  transition: border-color .3s;
}

/* — Responsive — */
@media (max-width: 1100px) { .page { padding: 40px 28px 72px; } .nav-inner { padding: 0 28px; } }
@media (max-width: 768px) {
  .hide-mob { display: none !important; }
  .page { padding: 32px 16px 60px; }
  .nav-inner { padding: 0 16px; }
  .g4 { grid-template-columns: repeat(2,1fr) !important; }
  .g3 { grid-template-columns: 1fr !important; }
  .g2 { grid-template-columns: 1fr !important; }
}
@media (max-width: 480px) { .g4 { grid-template-columns: 1fr !important; } }
`;

// ─── HOOKS ─────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1400, trigger = false) {
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!trigger) return;
    if (target === 0) { setVal(0); setDone(true); return; }
    let start = null;
    const raf = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(typeof target === "number" && !Number.isInteger(target)
        ? +(e * target).toFixed(1)
        : Math.floor(e * target));
      if (p < 1) requestAnimationFrame(raf);
      else { setVal(target); setDone(true); }
    };
    requestAnimationFrame(raf);
  }, [trigger, target, duration]);
  return [val, done];
}

function useInView(threshold = 0.12, delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setVisible(true), delay);
        obs.disconnect();
      }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── CURSOR ─────────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const mouse = useRef({ x: 0, y: 0 }), lag = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mv = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener("mousemove", mv);
    let raf;
    const loop = () => {
      lag.current.x += (mouse.current.x - lag.current.x) * 0.1;
      lag.current.y += (mouse.current.y - lag.current.y) * 0.1;
      if (dot.current)  dot.current.style.transform  = `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);
  return <><div id="cur" ref={dot} /><div id="curR" ref={ring} /></>;
}

// ─── SECTION HEADER ─────────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, italic, sub, delay = 0 }) {
  const [ref, vis] = useInView(0.15, delay);
  return (
    <div ref={ref} className={`rev ${vis ? "on" : ""}`} style={{ marginBottom: 32 }}>
      <div className="section-eyebrow" style={{ marginBottom: 14 }}>{eyebrow}</div>
      <h2 className="serif" style={{ fontSize: "clamp(24px,3.2vw,40px)", fontWeight: 400, letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: 10 }}>
        {title} {italic && <span className="gt" style={{ fontStyle: "italic" }}>{italic}</span>}
      </h2>
      {sub && <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300, letterSpacing: ".02em" }}>{sub}</p>}
    </div>
  );
}

// ─── THIN DIVIDER BETWEEN SECTIONS ──────────────────────────────────────────────
function SectionDivider() {
  return (
    <div style={{ margin: "72px 0", position: "relative" }}>
      <hr className="gold-rule" />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "var(--bg1)", padding: "0 16px" }}>
        <span style={{ fontSize: 10, color: "var(--gold-dk)", letterSpacing: ".18em", fontFamily: "'DM Mono',monospace" }}>◆</span>
      </div>
    </div>
  );
}

// ─── SECTION 1: UNIT ECONOMICS ─────────────────────────────────────────────────
function UnitEconomics() {
  const [ref, vis] = useInView(0.15);
  const [ltcRef, ltcVis] = useInView(0.2, 100);
  const [ltv, ltvDone] = useCountUp(4200, 1400, vis);
  const [cac, cacDone] = useCountUp(250, 1100, vis);
  const [arpu, arpuDone] = useCountUp(1800, 1200, vis);
  const [ratio, ratioDone] = useCountUp(16.8, 1600, vis);

  const metrics = [
    { label: "Customer Acquisition Cost", key: "CAC", val: `₹${cac.toLocaleString("en-IN")}`, done: cacDone, note: "Blended avg across channels" },
    { label: "Avg Revenue Per User", key: "ARPU",  val: `₹${arpu.toLocaleString("en-IN")}`, done: arpuDone, note: "Monthly per active student" },
    { label: "Customer Lifetime Value", key: "LTV",  val: `₹${ltv.toLocaleString("en-IN")}`, done: ltvDone, note: "Based on 28-month avg retention" },
  ];

  return (
    <div ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 18, alignItems: "start" }} className="g2">
        {/* Left: LTV/CAC centrepiece */}
        <div className={`gc revS ${vis ? "on" : ""}`} style={{ padding: "48px 44px", borderColor: "rgba(201,169,110,.18)", boxShadow: "0 0 60px rgba(201,169,110,.06)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--gold-dk), var(--gold), var(--gold-dk), transparent)" }} />

          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="section-eyebrow" style={{ justifyContent: "center", marginBottom: 16 }}>LTV / CAC Ratio</div>
            <div className={`serif gt ${ratioDone ? "popped" : ""}`} style={{ fontSize: "clamp(72px,9vw,120px)", fontWeight: 300, letterSpacing: "-.04em", lineHeight: 1, marginBottom: 8 }}>
              {typeof ratio === "number" && !Number.isInteger(16.8) ? ratio.toFixed(1) : ratio}
              <span className="serif" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 300, opacity: .7 }}>x</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <span className="badge badge-green">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
                Healthy SaaS Benchmark
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", maxWidth: 340, margin: "0 auto", lineHeight: 1.75 }}>
              Industry benchmark for healthy SaaS is <span style={{ color: "var(--text2)" }}>3×</span>. Mentora operates at <span style={{ color: "var(--gold-lt)" }}>5.6× above benchmark</span> — signalling strong product-market fit and capital efficiency.
            </p>
          </div>

          <hr className="gold-rule" style={{ marginBottom: 32 }} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--border)" }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ background: "var(--bg2)", padding: "20px 18px", textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 9, color: "var(--gold-dk)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>{m.key}</div>
                <div className={`serif ${m.done ? "popped" : ""}`} style={{ fontSize: "clamp(22px,2.5vw,32px)", fontWeight: 400, letterSpacing: "-.02em", color: "var(--gold-lt)", lineHeight: 1, marginBottom: 6 }}>{m.val}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{m.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: supporting context */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: "◈", title: "Payback Period", val: "1.7 months", sub: "Time to recover CAC from ARPU", clr: "var(--green)" },
            { icon: "◇", title: "Unit Margin",    val: "82%",        sub: "After mentor payout (90% of session)", clr: "var(--gold-lt)" },
            { icon: "○", title: "Cohort ROI",     val: "₹4,200",    sub: "Average lifetime value per student", clr: "var(--text2)" },
            { icon: "△", title: "Revenue Multiple", val: "16.8×",   sub: "Return on each ₹1 of CAC spent", clr: "var(--gold)" },
          ].map((c, i) => (
            <div key={i} className={`gc hov rev ${vis ? "on" : ""}`}
              style={{ padding: "18px 20px", transitionDelay: `${i * .08}s`, display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span className="serif" style={{ fontSize: 18, color: "var(--gold-dk)", lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{c.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".06em", marginBottom: 4 }}>{c.title}</div>
                <div className="serif" style={{ fontSize: "clamp(18px,2vw,24px)", fontWeight: 400, color: c.clr, letterSpacing: "-.02em", lineHeight: 1, marginBottom: 3 }}>{c.val}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CIRCULAR PROGRESS ──────────────────────────────────────────────────────────
function CircleProgress({ pct, size = 120, stroke = 7, color = "var(--gold)", trackColor = "rgba(255,255,255,.06)", visible = false, label, subLabel }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (visible ? pct / 100 * circ : circ);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} className="circle-track" strokeWidth={stroke} stroke={trackColor} />
          <circle cx={size/2} cy={size/2} r={r} className="circle-fill" strokeWidth={stroke} stroke={color}
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: visible ? "stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)" : "none" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span className="serif" style={{ fontSize: "clamp(20px,2vw,26px)", fontWeight: 400, color: "var(--gold-lt)", letterSpacing: "-.02em", lineHeight: 1 }}>{pct}%</span>
        </div>
      </div>
      {label && <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 2 }}>{label}</div>
        {subLabel && <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{subLabel}</div>}
      </div>}
    </div>
  );
}

// ─── SECTION 2: RETENTION & ENGAGEMENT ─────────────────────────────────────────
function Retention() {
  const [ref, vis] = useInView(0.15);

  const stats = [
    { label: "Avg Sessions / Student", val: "4.3",  clr: "var(--text2)",   mono: true  },
    { label: "Student Retention Rate",  val: "78%",  clr: "var(--green)",   badge: { t: "Strong",  cl: "badge-green" } },
    { label: "Monthly Churn Rate",      val: "6%",   clr: "var(--red)",     badge: { t: "Monitor", cl: "badge-red" } },
    { label: "Avg Session Rating",      val: "4.8★", clr: "var(--amber)",   mono: true  },
    { label: "Days Between Sessions",   val: "12",   clr: "var(--text2)",   mono: true  },
    { label: "Session Completion Rate", val: "94%",  clr: "var(--green)",   badge: { t: "Healthy", cl: "badge-green" } },
  ];

  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 18, alignItems: "start" }} className="g2">
      {/* Circular focus */}
      <div className={`gc revS ${vis ? "on" : ""}`} style={{ padding: "36px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".14em", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 24 }}>Repeat Booking Rate</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <CircleProgress pct={72} size={150} stroke={8} color="var(--gold)" visible={vis} label="Repeat Bookings" subLabel="of students return" />
        </div>
        <hr className="gold-rule" style={{ marginBottom: 20 }} />
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.75, fontWeight: 300 }}>
          <span style={{ color: "var(--gold-lt)", fontWeight: 500 }}>72%</span> of students who complete one session book again within 30 days — confirming product value and supply quality.
        </div>
      </div>

      {/* Stat grid */}
      <div className={`gc rev ${vis ? "on" : ""}`} style={{ padding: "32px 28px" }}>
        <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 22 }}>Platform Stickiness & Sustainability</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", marginBottom: 28 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", padding: "20px 20px" }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".05em", marginBottom: 8 }}>{s.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span className={s.mono ? "mono" : "serif"} style={{ fontSize: s.mono ? "clamp(20px,2.2vw,28px)" : "clamp(24px,2.5vw,34px)", fontWeight: s.mono ? 400 : 400, color: s.clr, letterSpacing: "-.01em", lineHeight: 1 }}>{s.val}</span>
                {s.badge && <span className={`badge ${s.badge.cl}`}>{s.badge.t}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Retention vs Churn visual */}
        <div>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 14 }}>Retention vs Churn Ratio</div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 2, overflow: "hidden", height: 28 }}>
            <div style={{ flex: 78, background: "rgba(82,201,138,.2)", borderRight: "2px solid var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, color: "var(--green)", fontWeight: 600, letterSpacing: ".04em" }}>78% Retained</span>
            </div>
            <div style={{ flex: 6, background: "rgba(224,112,112,.18)", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 42 }}>
              <span style={{ fontSize: 10, color: "var(--red)", fontWeight: 500 }}>6%</span>
            </div>
            <div style={{ flex: 16, background: "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 10, color: "var(--muted)" }}>16% pause</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 3: REVENUE EFFICIENCY ──────────────────────────────────────────────
function RevenueEfficiency() {
  const [ref, vis] = useInView(0.15);

  const bars = [
    { label: "Avg Mentor Monthly Earnings", val: "₹18,000", raw: 18000, max: 50000, pct: 36, clr: "var(--gold)" },
    { label: "Top 10% Mentor Earnings",     val: "₹45,000", raw: 45000, max: 50000, pct: 90, clr: "var(--gold-lt)" },
    { label: "Platform Revenue per Mentor", val: "₹1,800",  raw: 1800,  max: 50000, pct: 4,  clr: "var(--muted)" },
    { label: "Gross Margin",                val: "82%",      raw: 82,    max: 100,   pct: 82, clr: "var(--green)" },
  ];

  const insights = [
    { val: "₹2,000", label: "Median session price" },
    { val: "9:1",    label: "Mentor:Platform payout ratio" },
    { val: "340",    label: "Revenue-generating mentors" },
    { val: "94%",    label: "Mentor satisfaction score" },
  ];

  return (
    <div ref={ref} className={`gc rev ${vis ? "on" : ""}`} style={{ padding: "36px 36px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 36, alignItems: "start" }} className="g2">
        <div>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 28 }}>Supply-Side Incentive Alignment</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ transitionDelay: `${i * .08}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>{b.label}</span>
                  <span className="serif" style={{ fontSize: "clamp(16px,1.8vw,22px)", fontWeight: 400, color: b.clr, letterSpacing: "-.01em" }}>{b.val}</span>
                </div>
                <div className="pbar-track" style={{ height: 5 }}>
                  <div className="pbar-fill" style={{ width: vis ? `${b.pct}%` : "0%", background: b.clr, transitionDelay: `${i * .1 + .1}s` }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 32, padding: "18px 20px", background: "rgba(201,169,110,.04)", border: "1px solid rgba(201,169,110,.14)", borderRadius: 3 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.75, fontWeight: 300 }}>
              Mentors retain <span style={{ color: "var(--gold-lt)", fontWeight: 600 }}>90%</span> of session earnings, creating strong supply-side loyalty. At scale, the platform earns <span style={{ color: "var(--gold-lt)", fontWeight: 600 }}>₹1,800 per mentor per month</span> passively — a high-margin, zero-overhead revenue stream.
            </div>
          </div>
        </div>

        {/* Right: insight tiles */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)" }}>
          {insights.map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", padding: "18px 20px", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 400, color: "var(--gold-lt)", letterSpacing: "-.02em", lineHeight: 1, marginBottom: 6 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 4: GROWTH ENGINE ────────────────────────────────────────────────────
function GrowthEngine() {
  const [ref, vis] = useInView(0.15);

  const channels = [
    { label: "Organic Growth",         pct: 64, val: "64%", clr: "var(--gold)",    note: "SEO, word-of-mouth, content" },
    { label: "Referral Contribution",  pct: 28, val: "28%", clr: "var(--green)",   note: "Student & mentor referrals" },
    { label: "Paid Marketing",         pct: 18, val: "18%", clr: "var(--muted)",   note: "Performance ads, sponsored" },
  ];

  const kpis = [
    { label: "Organic CAC",           val: "₹80",   good: true  },
    { label: "Referral CAC",          val: "₹120",  good: true  },
    { label: "Paid CAC",              val: "₹680",  good: false },
    { label: "Viral Coefficient (K)", val: "0.74",  good: true  },
    { label: "Referral Reward",       val: "₹200",  good: null  },
    { label: "Avg Referred LTV",      val: "₹5,100",good: true  },
  ];

  return (
    <div ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }} className="g2">
        {/* Channel bars */}
        <div className={`gc rev ${vis ? "on" : ""}`} style={{ padding: "32px 28px" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 26 }}>Customer Acquisition Channels</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {channels.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{c.note}</div>
                  </div>
                  <span className="serif" style={{ fontSize: "clamp(20px,2.2vw,28px)", fontWeight: 400, color: c.clr, letterSpacing: "-.02em" }}>{c.val}</span>
                </div>
                <div className="pbar-track" style={{ height: 6 }}>
                  <div className="pbar-fill" style={{ width: vis ? `${c.pct}%` : "0%", background: c.clr, transitionDelay: `${i * .12 + .05}s` }} />
                </div>
              </div>
            ))}
          </div>

          <hr className="gold-rule" style={{ margin: "28px 0 20px" }} />
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.75, fontWeight: 300 }}>
            <span style={{ color: "var(--gold-lt)", fontWeight: 500 }}>64% organic growth</span> means the platform acquires most users with zero marginal cost — a strong signal of organic product-led growth.
          </div>
        </div>

        {/* KPI grid */}
        <div className={`gc rev ${vis ? "on" : ""}`} style={{ padding: "32px 28px", transitionDelay: ".1s" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", marginBottom: 26 }}>Channel Unit Economics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)" }}>
            {kpis.map((k, i) => (
              <div key={i} style={{ background: "var(--bg2)", padding: "16px 16px" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>{k.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="mono" style={{ fontSize: "clamp(14px,1.6vw,18px)", fontWeight: 400, color: k.good === true ? "var(--green)" : k.good === false ? "var(--red)" : "var(--text2)" }}>
                    {k.val}
                  </span>
                  {k.good === true  && <span style={{ fontSize: 10, color: "var(--green)" }}>↑</span>}
                  {k.good === false && <span style={{ fontSize: 10, color: "var(--red)" }}>↓</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(82,201,138,.05)", border: "1px solid rgba(82,201,138,.15)", borderRadius: 3 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
              K-factor of <span style={{ color: "var(--green)", fontWeight: 600 }}>0.74</span> means for every 10 new users, 7.4 additional users join through referrals. Near-viral at scale.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 5: SCALABILITY PROJECTIONS ─────────────────────────────────────────
function ScalabilityProjections() {
  const [ref, vis] = useInView(0.15);

  const tiers = [
    {
      label: "Current Scale",
      sessions: "5,000 / mo",
      sessionsRaw: 5000,
      revenue: "₹4L / mo",
      revenueRaw: 400000,
      arpu: "₹80",
      mentors: 340,
      highlight: false,
      tag: "Live",
      tagCl: "badge-green",
      accentClr: "var(--muted)",
      barPct: 10,
    },
    {
      label: "Growth Stage",
      sessions: "20,000 / mo",
      sessionsRaw: 20000,
      revenue: "₹16L / mo",
      revenueRaw: 1600000,
      arpu: "₹80",
      mentors: 1200,
      highlight: false,
      tag: "12–18 months",
      tagCl: "badge-gold",
      accentClr: "var(--gold)",
      barPct: 40,
    },
    {
      label: "At Scale",
      sessions: "50,000 / mo",
      sessionsRaw: 50000,
      revenue: "₹40L / mo",
      revenueRaw: 4000000,
      arpu: "₹80",
      mentors: 3000,
      highlight: true,
      tag: "Series A target",
      tagCl: "badge-amber",
      accentClr: "var(--gold-lt)",
      barPct: 100,
    },
  ];

  return (
    <div ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }} className="g3">
        {tiers.map((t, i) => (
          <div key={i} className={`tier-card rev ${vis ? "on" : ""}`}
            style={{
              transitionDelay: `${i * .1}s`,
              borderColor: t.highlight ? "rgba(201,169,110,.3)" : "var(--border)",
              boxShadow: t.highlight ? "0 0 40px rgba(201,169,110,.08), inset 0 1px 0 rgba(201,169,110,.1)" : "none",
            }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: t.highlight ? "linear-gradient(90deg, transparent, var(--gold), transparent)" : "transparent" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".06em" }}>{t.label}</div>
              <span className={`badge ${t.tagCl}`}>{t.tag}</span>
            </div>
            <div className="serif" style={{ fontSize: "clamp(13px,1.4vw,16px)", color: "var(--muted)", marginBottom: 4 }}>Sessions</div>
            <div className="serif" style={{ fontSize: "clamp(22px,2.6vw,34px)", fontWeight: 400, color: t.accentClr, letterSpacing: "-.03em", lineHeight: 1, marginBottom: 16 }}>{t.sessions}</div>
            <hr className="gold-rule" style={{ marginBottom: 16 }} />
            <div className="serif" style={{ fontSize: "clamp(13px,1.4vw,16px)", color: "var(--muted)", marginBottom: 4 }}>Platform Revenue</div>
            <div className="serif" style={{ fontSize: "clamp(26px,3vw,42px)", fontWeight: t.highlight ? 500 : 400, letterSpacing: "-.03em", lineHeight: 1, marginBottom: 18 }}>
              {t.highlight ? <span className="gt">{t.revenue}</span> : <span style={{ color: t.accentClr }}>{t.revenue}</span>}
            </div>
            <div className="pbar-track">
              <div className="pbar-fill" style={{ width: vis ? `${t.barPct}%` : "0%", background: t.accentClr, transitionDelay: `${i * .12 + .2}s` }} />
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 14 }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>Mentors needed</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--text2)" }}>{t.mentors.toLocaleString("en-IN")}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>Commission / session</div>
                <div className="mono" style={{ fontSize: 13, color: "var(--text2)" }}>{t.arpu}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trajectory note */}
      <div className={`gc rev ${vis ? "on" : ""}`} style={{ padding: "20px 28px", transitionDelay: ".35s", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,169,110,.15), transparent)" }} />
        <span className="serif" style={{ fontSize: 28, color: "var(--gold-dk)", opacity: .5 }}>∿</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text2)", marginBottom: 4 }}>Revenue Expansion Model</div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300 }}>
            Revenue scales linearly with sessions — no infrastructure cost inflection until <span style={{ color: "var(--text2)" }}>~100,000 sessions/month</span>. Every additional session adds ₹80 in pure platform margin. At 50K sessions, monthly gross margin exceeds <span style={{ color: "var(--gold-lt)", fontWeight: 500 }}>₹32.8L</span>.
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "12px 20px", background: "rgba(201,169,110,.04)", border: "1px solid rgba(201,169,110,.14)", borderRadius: 2 }}>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>10× Revenue</div>
          <div className="serif" style={{ fontSize: 22, color: "var(--gold-lt)" }}>18 months</div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 6: OPERATIONAL RISK MONITOR ────────────────────────────────────────
function RiskMonitor() {
  const [ref, vis] = useInView(0.15);

  const risks = [
    { label: "Refund Rate",       val: "3%",  raw: 3,   threshold: 5,  status: "green",  note: "Below 5% SaaS benchmark" },
    { label: "No-show Rate",      val: "4%",  raw: 4,   threshold: 5,  status: "amber",  note: "Monitor — near threshold" },
    { label: "Mentor Attrition",  val: "5%",  raw: 5,   threshold: 8,  status: "green",  note: "Monthly supply churn" },
    { label: "Dispute Rate",      val: "1.2%",raw: 1.2, threshold: 3,  status: "green",  note: "Well below 3% alert level" },
    { label: "Late Cancellations",val: "7%",  raw: 7,   threshold: 10, status: "green",  note: "Within acceptable range" },
    { label: "Support Tickets/mo",val: "148", raw: 148, threshold: 300,status: "green",  note: "Low relative to volume" },
  ];

  const statusColor = { green: "var(--green)", amber: "var(--amber)", red: "var(--red)" };
  const statusBadge = { green: "badge-green", amber: "badge-amber", red: "badge-red" };
  const statusLabel = { green: "Nominal", amber: "Monitor", red: "Alert" };

  return (
    <div ref={ref}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }} className="g3">
        {risks.map((r, i) => (
          <div key={i} className={`risk-kpi rev ${vis ? "on" : ""}`} style={{ transitionDelay: `${i * .07}s`, borderColor: r.status === "amber" ? "rgba(212,168,64,.22)" : "var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".04em" }}>{r.label}</div>
              <span className={`badge ${statusBadge[r.status]}`}>{statusLabel[r.status]}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
              <span className="serif" style={{ fontSize: "clamp(24px,2.5vw,34px)", fontWeight: 400, color: statusColor[r.status], letterSpacing: "-.02em", lineHeight: 1 }}>{r.val}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div className="pbar-track" style={{ height: 3 }}>
                <div className="pbar-fill" style={{
                  width: vis ? `${Math.min((r.raw / r.threshold) * 100, 100)}%` : "0%",
                  background: statusColor[r.status],
                  transitionDelay: `${i * .07 + .15}s`,
                }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 300 }}>{r.note}</div>
          </div>
        ))}
      </div>

      {/* Risk summary */}
      <div className={`gc rev ${vis ? "on" : ""}`} style={{ padding: "20px 24px", transitionDelay: ".45s", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 500 }}>Platform Stability: Nominal</span>
        </div>
        <div style={{ width: 1, height: 20, background: "var(--border2)" }} className="hide-mob" />
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 300, flex: 1 }}>
          5 of 6 risk indicators below alert thresholds. No-show rate approaching monitor threshold — automated reminder system planned in Q1 2026 sprint.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ t: "5 Nominal", cl: "badge-green" }, { t: "1 Monitor", cl: "badge-amber" }, { t: "0 Alert", cl: "badge-muted" }].map((b, i) => (
            <span key={i} className={`badge ${b.cl}`}>{b.t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [navVisible, setNavVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    setTimeout(() => setNavVisible(true), 60);
    setTimeout(() => setHeroVisible(true), 180);
    const tick = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const fmt = (d) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <>
      <style>{STYLES}</style>
      <Cursor />

      {/* Ambient orbs */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
        <div className="orb" style={{ width: 800, height: 800, background: "radial-gradient(circle, rgba(201,169,110,.05), transparent 70%)", top: -250, right: -300, animationDelay: "0s" }} />
        <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(82,201,138,.03), transparent 70%)", bottom: 200, left: -150, animationDelay: "4s" }} />
        <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(201,169,110,.03), transparent 70%)", bottom: -100, right: 200, animationDelay: "2s" }} />
      </div>

      {/* ── NAV ── */}
      <nav className="nav" style={{ opacity: navVisible ? 1 : 0, transition: "opacity .7s ease" }}>
        <div className="nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 24, height: 24, border: "1px solid var(--gold-dk)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,.07)" }}>
              <span className="serif" style={{ color: "var(--gold)", fontSize: 14, fontWeight: 500, lineHeight: 1 }}>M</span>
            </div>
            <span className="serif" style={{ fontSize: 15, fontWeight: 500, letterSpacing: ".07em", color: "var(--text)" }}>MENTORA</span>
            <span style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: ".08em", paddingLeft: 8, borderLeft: "1px solid var(--border2)", marginLeft: 4, fontFamily: "'DM Mono',monospace" }}>BOARD / INVESTOR VIEW</span>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }} className="hide-mob">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 6px var(--green)", display: "inline-block" }} />
              <span className="mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".04em" }}>{fmt(liveTime)}</span>
            </div>
            <div style={{ padding: "4px 12px", border: "1px solid var(--border2)", borderRadius: 2, background: "rgba(201,169,110,.04)" }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--gold)", letterSpacing: ".08em" }}>Q4 · FY 2025</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", border: "1px solid rgba(82,201,138,.2)", borderRadius: 2, background: "rgba(82,201,138,.05)" }} className="hide-mob">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--green)" }} />
              <span style={{ fontSize: 10, color: "var(--green)", fontWeight: 500, letterSpacing: ".06em" }}>All Systems Nominal</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="page">
        {/* ── HERO HEADER ── */}
        <div style={{
          marginBottom: 72,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.22,1,.36,1)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div className="section-eyebrow" style={{ marginBottom: 16 }}>Internal · Confidential</div>
              <h1 className="serif" style={{ fontSize: "clamp(36px,5.5vw,72px)", fontWeight: 300, letterSpacing: "-.04em", lineHeight: 1.02, maxWidth: 680 }}>
                Strategic<br />
                <span className="gt" style={{ fontStyle: "italic", fontWeight: 400 }}>Business Intelligence</span>
              </h1>
              <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14, fontWeight: 300, lineHeight: 1.8, maxWidth: 500, letterSpacing: ".01em" }}>
                A comprehensive view of unit economics, retention performance, supply-side efficiency, and growth scalability for the Mentora marketplace platform.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
              {[
                { label: "Period", val: "November 2025" },
                { label: "Data freshness", val: "Live · Auto-sync" },
                { label: "Classification", val: "Board Confidential" },
                { label: "Prepared by", val: "Strategy & Finance" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 0, background: "var(--bg2)" }}>
                  <div style={{ padding: "9px 14px", borderRight: "1px solid var(--border)", minWidth: 120 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "'DM Mono',monospace", letterSpacing: ".06em" }}>{r.label}</span>
                  </div>
                  <div style={{ padding: "9px 14px" }}>
                    <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 400, letterSpacing: ".02em" }}>{r.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="gold-rule" style={{ marginTop: 40 }} />
        </div>

        {/* ── SECTION 1 ── */}
        <SectionHeader eyebrow="01 · Unit Economics" title="LTV / CAC" italic="Analysis" sub="Customer acquisition efficiency and lifetime value assessment" />
        <UnitEconomics />

        <SectionDivider />

        {/* ── SECTION 2 ── */}
        <SectionHeader eyebrow="02 · Retention & Engagement" title="Cohort" italic="Stickiness" sub="Platform retention, engagement depth, and session frequency metrics" />
        <Retention />

        <SectionDivider />

        {/* ── SECTION 3 ── */}
        <SectionHeader eyebrow="03 · Revenue Efficiency" title="Mentor" italic="Economics" sub="Supply-side earnings, platform margin, and incentive alignment" />
        <RevenueEfficiency />

        <SectionDivider />

        {/* ── SECTION 4 ── */}
        <SectionHeader eyebrow="04 · Growth Engine" title="Acquisition" italic="Channels" sub="Organic, referral, and paid customer acquisition performance" />
        <GrowthEngine />

        <SectionDivider />

        {/* ── SECTION 5 ── */}
        <SectionHeader eyebrow="05 · Scalability" title="Revenue" italic="Projections" sub="Commission model expansion scenarios and capital efficiency outlook" />
        <ScalabilityProjections />

        <SectionDivider />

        {/* ── SECTION 6 ── */}
        <SectionHeader eyebrow="06 · Operational Risk" title="Platform" italic="Stability" sub="Key risk indicators with threshold benchmarks and monitoring status" />
        <RiskMonitor />

        {/* ── FOOTER ── */}
        <div style={{ marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, border: "1px solid var(--gold-dk)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,.07)" }}>
              <span className="serif" style={{ color: "var(--gold)", fontSize: 12, fontWeight: 500 }}>M</span>
            </div>
            <span className="serif" style={{ fontSize: 13, color: "var(--muted)", letterSpacing: ".05em" }}>MENTORA</span>
            <span className="mono" style={{ fontSize: 10, color: "var(--muted2)", marginLeft: 4 }}>Strategic Business Intelligence · Board View · Confidential</span>
          </div>
          <span className="mono" style={{ fontSize: 10, color: "var(--muted2)" }}>Data as of {liveTime.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>
      </div>
    </>
  );
}
