import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar, Tooltip
} from "recharts";

// ─── Global Styles ────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#080808; --bg2:#0E0E0E; --bg3:#131313; --bg4:#181816;
  --border:rgba(255,255,255,.06); --border2:rgba(255,255,255,.11); --border3:rgba(255,255,255,.18);
  --gold:#C9A96E; --gold-lt:#E2C99A; --gold-dk:#8A6A3E; --gold-glow:rgba(201,169,110,.2);
  --text:#F0EDE8; --muted:#7A7570; --muted2:#3A3530; --muted3:#555;
  --green:#4ADE80; --red:#F87171; --blue:#60A5FA; --purple:#A78BFA;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
::selection{background:var(--gold-dk);color:var(--text)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold-dk);border-radius:2px}
.serif{font-family:'Cormorant Garamond',serif}
.gold-text{background:linear-gradient(135deg,var(--gold-lt),var(--gold) 50%,var(--gold-dk));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* noise */
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E");opacity:.5}

/* cursor */
#cur{position:fixed;top:0;left:0;z-index:9999;pointer-events:none;width:8px;height:8px;border-radius:50%;background:var(--gold);transform:translate(-50%,-50%);transition:transform .1s}
#cur-ring{position:fixed;top:0;left:0;z-index:9998;pointer-events:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(201,169,110,.5);transform:translate(-50%,-50%);transition:all .15s cubic-bezier(.22,1,.36,1)}

/* orbs */
.orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
@keyframes glowPulse{0%,100%{opacity:.4}50%{opacity:.8}}
.orb{animation:glowPulse 6s ease-in-out infinite}

/* nav */
.nav-wrap{position:sticky;top:0;z-index:100;background:rgba(8,8,8,.92);backdrop-filter:blur(24px) saturate(1.5);border-bottom:1px solid var(--border)}

/* tags */
.tag-pill{display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(201,169,110,.25);border-radius:1px;padding:5px 13px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:500;background:rgba(201,169,110,.04)}

/* reveals */
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes slideLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.rv{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.rv.in{opacity:1;transform:translateY(0)}
.rv-l{opacity:0;transform:translateX(-28px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.rv-l.in{opacity:1;transform:translateX(0)}
.rv-r{opacity:0;transform:translateX(28px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1)}
.rv-r.in{opacity:1;transform:translateX(0)}
.d0{transition-delay:0ms}.d1{transition-delay:80ms}.d2{transition-delay:160ms}.d3{transition-delay:240ms}.d4{transition-delay:320ms}.d5{transition-delay:400ms}

/* glass card */
.g-card{background:linear-gradient(145deg,rgba(22,19,15,.97),rgba(13,11,9,.98));border:1px solid var(--border);border-radius:3px;position:relative;overflow:hidden;transition:border-color .4s,box-shadow .4s}
.g-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,169,110,.05),transparent 55%);opacity:0;transition:opacity .4s;pointer-events:none}
.g-card:hover{border-color:rgba(201,169,110,.18);box-shadow:0 0 60px rgba(0,0,0,.5)}
.g-card:hover::before{opacity:1}

/* metric cards */
.metric-card{transition:all .45s cubic-bezier(.22,1,.36,1)}
.metric-card:hover{transform:translateY(-6px);box-shadow:0 28px 70px rgba(0,0,0,.7),0 0 0 1px rgba(201,169,110,.1)!important}
.metric-card:hover .m-glow{opacity:1}
.m-glow{position:absolute;bottom:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(201,169,110,.12),transparent 70%);opacity:0;transition:opacity .45s;pointer-events:none}

/* badges */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:1px;font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase}
.badge-green{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);color:var(--green)}
.badge-gold{background:rgba(201,169,110,.1);border:1px solid rgba(201,169,110,.2);color:var(--gold)}
.badge-red{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);color:var(--red)}
.badge-blue{background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.2);color:var(--blue)}
.badge-purple{background:rgba(167,139,250,.1);border:1px solid rgba(167,139,250,.2);color:var(--purple)}

/* chart tooltip */
.custom-tip{background:linear-gradient(145deg,#1A1714,#100E0C)!important;border:1px solid rgba(201,169,110,.25)!important;border-radius:3px!important;padding:10px 14px!important;font-family:'Outfit',sans-serif!important;box-shadow:0 12px 40px rgba(0,0,0,.7)!important}

/* formula box */
.formula-box{background:rgba(201,169,110,.04);border:1px solid rgba(201,169,110,.15);border-radius:3px;padding:20px 24px;position:relative;overflow:hidden}
.formula-box::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,169,110,.06),transparent 50%);pointer-events:none}

/* future stream card */
.stream-card{background:rgba(255,255,255,.025);border:1px solid var(--border);border-radius:3px;padding:20px;transition:all .35s cubic-bezier(.22,1,.36,1)}
.stream-card:hover{border-color:rgba(201,169,110,.2);background:rgba(201,169,110,.04);transform:translateY(-4px)}

/* progress bar */
.prog-bg{height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-top:8px}
.prog-fill{height:100%;border-radius:2px;transition:width 1.2s cubic-bezier(.22,1,.36,1)}

/* divider */
.gold-line{height:1px;background:linear-gradient(90deg,transparent,var(--gold-dk),transparent)}
.v-line{width:1px;background:linear-gradient(180deg,transparent,var(--border2),transparent)}

/* recharts overrides */
.recharts-text{font-family:'Outfit',sans-serif!important;fill:var(--muted)!important;font-size:11px!important}
.recharts-cartesian-grid-horizontal line,.recharts-cartesian-grid-vertical line{stroke:rgba(255,255,255,.04)!important}
.recharts-tooltip-wrapper{outline:none!important}

/* section spacing */
.sec{padding:0 48px;margin-bottom:48px;position:relative;z-index:1;max-width:1320px;margin-left:auto;margin-right:auto;margin-bottom:56px}
.sec-pad{padding:0 48px}

/* number shimmer on hover */
@keyframes shimNum{0%,100%{opacity:1}50%{opacity:.7}}

/* grid bg */
.grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(201,169,110,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,.015) 1px,transparent 1px);background-size:80px 80px;pointer-events:none}

@media(max-width:1024px){.sec{padding:0 24px}}
@media(max-width:768px){
  .sec{padding:0 16px}
  .hide-mob{display:none!important}
  .grid-4{grid-template-columns:repeat(2,1fr)!important}
  .grid-3{grid-template-columns:1fr!important}
  .grid-2{grid-template-columns:1fr!important}
}
@media(max-width:480px){
  .grid-4{grid-template-columns:1fr!important}
}
`;

// ─── Hooks ─────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useCountUp(target, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let s = null;
    const raf = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: "Jan", sessions: 38, revenue: 3800, mentors: 210, students: 1800 },
  { month: "Feb", sessions: 52, revenue: 5200, mentors: 225, students: 2100 },
  { month: "Mar", sessions: 71, revenue: 7100, mentors: 248, students: 2600 },
  { month: "Apr", sessions: 88, revenue: 8800, mentors: 270, students: 3100 },
  { month: "May", sessions: 104, revenue: 10400, mentors: 295, students: 3700 },
  { month: "Jun", sessions: 127, revenue: 12700, mentors: 308, students: 4100 },
  { month: "Jul", sessions: 155, revenue: 15500, mentors: 320, students: 4500 },
  { month: "Aug", sessions: 183, revenue: 18300, mentors: 330, students: 4800 },
  { month: "Sep", sessions: 198, revenue: 19800, mentors: 334, students: 4900 },
  { month: "Oct", sessions: 220, revenue: 22000, mentors: 338, students: 5000 },
  { month: "Nov", sessions: 232, revenue: 23200, mentors: 340, students: 5200 },
  { month: "Dec", sessions: 240, revenue: 24000, mentors: 340, students: 5400 },
];

const CATEGORY_DATA = [
  { name: "Programming", sessions: 96, fill: "#C9A96E" },
  { name: "Career Guidance", sessions: 60, fill: "#8A6A3E" },
  { name: "Interview Prep", sessions: 48, fill: "#E2C99A" },
  { name: "Design", sessions: 24, fill: "#6A5A3E" },
  { name: "Other", sessions: 12, fill: "#3A3028" },
];



const TOP_MENTORS = [
  { name: "Karan Patel", sessions: 58, earnings: 52200, category: "Interview Prep", growth: "+18%" },
  { name: "Arjun Mehta", sessions: 44, earnings: 52800, category: "Full Stack Dev", growth: "+12%" },
  { name: "Ananya Krishnan", sessions: 38, earnings: 49400, category: "Product Mgmt", growth: "+24%" },
  { name: "Vivek Sharma", sessions: 31, earnings: 34100, category: "DevOps", growth: "+9%" },
  { name: "Lavanya Pillai", sessions: 40, earnings: 28000, category: "HR & Career", growth: "+31%" },
];

const FUTURE_STREAMS = [
  { icon: "⭐", title: "Featured Listings", desc: "Mentors pay ₹500/mo for premium placement in search results.", est: "₹1.7L / mo", status: "Q1 2026", color: "var(--gold)" },
  { icon: "♻️", title: "Subscription Plans", desc: "Students pay ₹299/mo for unlimited discovery + priority booking.", est: "₹14.9L / mo", status: "Q2 2026", color: "var(--green)" },
  { icon: "🏢", title: "Corporate Mentorship", desc: "B2B packages for companies to upskill teams — ₹50K/team/quarter.", est: "₹25L / qtr", status: "Q2 2026", color: "var(--blue)" },
  { icon: "🎓", title: "Skill-based Bootcamps", desc: "Live cohort programs: ₹5,000–₹25,000 per student seat.", est: "₹40L / cohort", status: "Q3 2026", color: "var(--purple)" },
];

// ─── Cursor ─────────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const mouse = useRef({ x: 0, y: 0 }), lag = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mv = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener("mousemove", mv);
    let raf;
    const loop = () => {
      lag.current.x += (mouse.current.x - lag.current.x) * 0.1;
      lag.current.y += (mouse.current.y - lag.current.y) * 0.1;
      if (dot.current) dot.current.style.transform = `translate(${mouse.current.x}px,${mouse.current.y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${lag.current.x}px,${lag.current.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);
  return <><div id="cur" ref={dot} /><div id="cur-ring" ref={ring} /></>;
}

// ─── Custom Tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = "₹", suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "linear-gradient(145deg,#1A1714,#100E0C)", border: "1px solid rgba(201,169,110,.25)", borderRadius: 3, padding: "12px 16px", fontFamily: "'Outfit',sans-serif", boxShadow: "0 16px 48px rgba(0,0,0,.8)", minWidth: 120 }}>
      <div style={{ fontSize: 11, color: "#7A7570", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: i < payload.length - 1 ? 4 : 0 }}>
          <span style={{ fontSize: 12, color: p.color || "#C9A96E" }}>{p.name}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#E2C99A", fontFamily: "'Cormorant Garamond',serif" }}>
            {prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}{suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────────
function SectionHeader({ tag, title, sub, vis, centered = false }) {
  return (
    <div style={{ marginBottom: 36, textAlign: centered ? "center" : "left" }}>
      <div className={`rv d0 ${vis ? "in" : ""}`} style={{ marginBottom: 14 }}>
        <span className="tag-pill">
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
          {tag}
        </span>
      </div>
      <h2 className={`serif rv d1 ${vis ? "in" : ""}`} style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, letterSpacing: "-.02em", lineHeight: 1.1 }}>
        {title}
      </h2>
      {sub && <p className={`rv d2 ${vis ? "in" : ""}`} style={{ fontSize: 14, color: "var(--muted)", marginTop: 10, fontWeight: 300, lineHeight: 1.7, maxWidth: centered ? 480 : "100%" }}>{sub}</p>}
    </div>
  );
}

// ─── Metric Card ─────────────────────────────────────────────────────────────────
function MetricCard({ label, value, prefix = "", suffix = "", growth, icon, sub, color, started, delay = 0, large = false }) {
  const num = useCountUp(typeof value === "number" ? value : 0, 1400, started);
  const isPos = growth?.startsWith("+");
  return (
    <div className={`g-card metric-card rv d${delay} ${started ? "in" : ""}`} style={{ padding: "28px 24px", flex: 1 }}>
      <div className="m-glow" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".12em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {growth && (
            <span className={`badge ${isPos ? "badge-green" : "badge-red"}`} style={{ fontSize: 9 }}>
              {isPos ? "▲" : "▼"} {growth}
            </span>
          )}
          <span style={{ fontSize: 22, opacity: .6 }}>{icon}</span>
        </div>
      </div>
      <div className="serif" style={{ fontSize: large ? 52 : 44, fontWeight: 400, letterSpacing: "-.03em", lineHeight: 1, color: color || "var(--gold-lt)", marginBottom: 8 }}>
        {prefix}{typeof value === "number" ? num.toLocaleString("en-IN") : value}{suffix}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{sub}</div>}
      <div style={{ marginTop: 18, height: 1, background: `linear-gradient(90deg,${color || "var(--gold-dk)"},transparent)` }} />
    </div>
  );
}

// ─── Progress Row ─────────────────────────────────────────────────────────────
function ProgRow({ label, value, max, color, pct, vis, delay = 0 }) {
  const displayPct = pct ?? Math.round(value / max * 100);
  return (
    <div style={{ marginBottom: 16 }} className={`rv d${delay} ${vis ? "in" : ""}`}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 500, fontFamily: "'Cormorant Garamond',serif" }}>{typeof value === "number" ? value.toLocaleString("en-IN") : value}</span>
      </div>
      <div className="prog-bg">
        <div className="prog-fill" style={{ width: vis ? `${displayPct}%` : "0%", background: `linear-gradient(90deg,${color}99,${color})`, transitionDelay: `${delay * 100}ms` }} />
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────────
function Nav() {
  const [sc, setSc] = useState(false);
  useEffect(() => { const fn = () => setSc(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav
      className="nav-wrap"
      style={{
        transition: "all .4s",
        animation: "fadeIn .6s ease",
        background: sc ? "rgba(10,10,10,.9)" : "transparent",
        backdropFilter: sc ? "blur(10px)" : "none",
        borderBottom: sc ? "1px solid var(--border)" : "none"
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", height: 64, gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, border: "1px solid var(--gold-dk)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,.08)" }}>
            <span className="serif" style={{ color: "var(--gold)", fontSize: 16, fontWeight: 500, lineHeight: 1 }}>M</span>
          </div>
          <span className="serif" style={{ fontSize: 18, fontWeight: 500, letterSpacing: ".06em" }}>MENTORA</span>
        </div>
        <div style={{ flex: 1, textAlign: "center" }} className="hide-mob">
          <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".14em", textTransform: "uppercase" }}>Platform Analytics</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
            <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".05em" }}>Live · Dec 2025</span>
          </div>
          <div style={{ width: 1, height: 22, background: "var(--border2)" }} />
          <div style={{ padding: "6px 14px", border: "1px solid var(--border2)", borderRadius: 2, fontSize: 11, color: "var(--muted)", letterSpacing: ".06em" }}>Admin</div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold-dk),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(201,169,110,.3)", cursor: "none" }}>
            <span className="serif" style={{ fontSize: 13, fontWeight: 600, color: "#080808" }}>A</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── SECTION 1: Hero + Key Metrics ────────────────────────────────────────────
function HeroMetrics() {
  const [ref, vis] = useInView(0.15);
  return (
    <div ref={ref}>
      {/* Hero header */}
      <div style={{ padding: "56px 48px 40px", maxWidth: 1320, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(201,169,110,.07),transparent 70%)", top: -100, right: -100, animationDelay: "0s" }} />
        <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(201,169,110,.04),transparent 70%)", bottom: 0, left: -50, animationDelay: "-3s" }} />
        <div className={`rv d0 ${vis ? "in" : ""}`} style={{ marginBottom: 16 }}>
          <span className="tag-pill">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />
            Business Intelligence
          </span>
        </div>
        <h1 className={`serif rv d1 ${vis ? "in" : ""}`} style={{ fontSize: "clamp(38px,5vw,68px)", fontWeight: 400, letterSpacing: "-.03em", lineHeight: 1.0, marginBottom: 14 }}>
          Platform <span className="gold-text" style={{ fontStyle: "italic" }}>Revenue</span><br />
          Analytics
        </h1>
        <p className={`rv d2 ${vis ? "in" : ""}`} style={{ fontSize: 15, color: "var(--muted)", fontWeight: 300, lineHeight: 1.8, maxWidth: 520, marginBottom: 8 }}>
          A real-time view of how Mentora's 10% commission model generates scalable, recurring revenue from every mentorship session.
        </p>
        <div className={`rv d3 ${vis ? "in" : ""}`} style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 24 }}>
          {[
            { label: "Commission rate", val: "10%", color: "var(--gold)" },
            { label: "YTD Revenue", val: "₹1.71L", color: "var(--gold-lt)" },
            { label: "Active mentors", val: "340", color: "var(--green)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {i > 0 && <div style={{ width: 1, height: 24, background: "var(--border2)" }} />}
              <div>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>{s.label}</div>
                <div className="serif" style={{ fontSize: 20, color: s.color, fontWeight: 400, lineHeight: 1.1 }}>{s.val}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Metric cards */}
      <div className="sec">
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <MetricCard label="Total Sessions" value={240} growth="+12%" icon="🎯" sub="This month · Dec 2025" color="var(--text)" started={vis} delay={0} />
          <MetricCard label="Avg Session Price" value={1000} growth="+5%" icon="💎" sub="Across all categories" prefix="₹" color="var(--gold-lt)" started={vis} delay={1} />
          <MetricCard label="Commission Rate" value={10} icon="⚙️" suffix="%" sub="Fixed across all sessions" color="var(--muted)" started={vis} delay={2} />
          <MetricCard label="Platform Revenue" value={24000} growth="+18%" icon="📈" sub="Net from 10% commission" prefix="₹" color="var(--gold)" started={vis} delay={3} large />
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 2: Revenue Charts ──────────────────────────────────────────────
function RevenueCharts() {
  const [ref, vis] = useInView(0.1);
  return (
    <div className="sec" ref={ref}>
      <SectionHeader tag="Revenue Trends" title={<>Monthly Revenue <span className="gold-text" style={{ fontStyle: "italic" }}>Growth</span></>} sub="Tracking platform commission earnings since launch — exponential growth driven by mentor supply expansion." vis={vis} />

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Area chart: revenue */}
        <div className={`g-card rv d2 ${vis ? "in" : ""}`} style={{ padding: "28px 24px 16px" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Commission Revenue</div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>₹ Monthly Earnings</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="month" tick={{ fill: "#7A7570", fontSize: 10, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7A7570", fontSize: 10, fontFamily: "Outfit" }} axisLine={false} tickLine={false} tickFormatter={v => "₹" + (v / 1000) + "K"} />
              <Tooltip content={<CustomTooltip prefix="₹" />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C9A96E" strokeWidth={2} fill="url(#rev)" dot={false} activeDot={{ r: 5, fill: "#E2C99A", stroke: "#080808", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart: sessions */}
        <div className={`g-card rv d3 ${vis ? "in" : ""}`} style={{ padding: "28px 24px 16px" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Session Volume</div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Monthly Sessions</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E2C99A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8A6A3E" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#7A7570", fontSize: 10, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7A7570", fontSize: 10, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip prefix="" />} />
              <Bar dataKey="sessions" name="Sessions" fill="url(#barGrad)" radius={[3, 3, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line: user growth */}
        <div className={`g-card rv d2 ${vis ? "in" : ""}`} style={{ padding: "28px 24px 16px" }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Platform Growth</div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>Mentors vs Students</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_REVENUE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="mLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#C9A96E" />
                  <stop offset="100%" stopColor="#E2C99A" />
                </linearGradient>
                <linearGradient id="sLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity=".5" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
              <XAxis dataKey="month" tick={{ fill: "#7A7570", fontSize: 10, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#7A7570", fontSize: 10, fontFamily: "Outfit" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip prefix="" />} />
              <Legend wrapperStyle={{ paddingTop: 8, fontFamily: "Outfit", fontSize: 11, color: "#7A7570" }} />
              <Line type="monotone" dataKey="mentors" name="Mentors" stroke="url(#mLine)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#E2C99A", stroke: "#080808", strokeWidth: 2 }} />
              <Line type="monotone" dataKey="students" name="Students" stroke="url(#sLine)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#4ADE80", stroke: "#080808", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie: category breakdown */}
        <div className={`g-card rv d3 ${vis ? "in" : ""}`} style={{ padding: "28px 24px 16px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Session Mix</div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>By Category</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="sessions" paddingAngle={3}>
                  {CATEGORY_DATA.map((e, i) => <Cell key={i} fill={e.fill} stroke="rgba(0,0,0,.3)" strokeWidth={1} />)}
                </Pie>
                <Tooltip content={<CustomTooltip prefix="" suffix=" sessions" />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {CATEGORY_DATA.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: d.fill, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--muted)", flex: 1 }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{d.sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 3: Revenue Formula ───────────────────────────────────────────────
function RevenueFormula() {
  const [ref, vis] = useInView(0.15);
  return (
    <div className="sec" ref={ref}>
      <SectionHeader tag="Revenue Model" title={<>The <span className="gold-text" style={{ fontStyle: "italic" }}>10% Formula</span></>} sub="Every session generates automatic revenue. No ads. No subscriptions. Pure commission from value created." vis={vis} />

      <div className={`formula-box rv d2 ${vis ? "in" : ""}`} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          {/* Formula visual */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Sessions", val: "240", icon: "🎯", color: "var(--text)" },
              { op: "×" },
              { label: "Avg Price", val: "₹1,000", icon: "💰", color: "var(--gold-lt)" },
              { op: "×" },
              { label: "Commission", val: "10%", icon: "⚙️", color: "var(--muted)" },
              { op: "=" },
              { label: "Revenue", val: "₹24,000", icon: "📈", color: "var(--gold)", big: true },
            ].map((item, i) => (
              <div key={i}>
                {item.op ? (
                  <div className="serif" style={{ fontSize: 32, color: "var(--muted2)", fontWeight: 300, padding: "0 4px" }}>{item.op}</div>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px 20px", background: "rgba(255,255,255,.03)", border: `1px solid ${item.big ? "rgba(201,169,110,.3)" : "var(--border)"}`, borderRadius: 3, minWidth: item.big ? 130 : 100, boxShadow: item.big ? "0 0 30px rgba(201,169,110,.1)" : "none" }}>
                    <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                    <div className="serif" style={{ fontSize: item.big ? 28 : 22, fontWeight: 400, color: item.color, letterSpacing: "-.01em", lineHeight: 1 }}>{item.val}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 4 }}>{item.label}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className={`g-card rv d2 ${vis ? "in" : ""}`} style={{ padding: "24px" }}>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Per Session Split</div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>Mentor vs Platform</div>
          {[
            { label: "Mentor earns", val: "₹900", pct: 90, color: "#C9A96E" },
            { label: "Platform earns", val: "₹100", pct: 10, color: "#F87171" },
          ].map((r, i) => (
            <div key={i} style={{ marginBottom: i < 1 ? 20 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{r.label}</span>
                <span className="serif" style={{ fontSize: 18, color: r.color }}>{r.val}</span>
              </div>
              <div className="prog-bg" style={{ height: 6 }}>
                <div className="prog-fill" style={{ width: vis ? `${r.pct}%` : "0%", background: `linear-gradient(90deg,${r.color}80,${r.color})`, transitionDelay: `${i * 0.15 + 0.3}s` }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 20, padding: "12px 14px", background: "rgba(201,169,110,.04)", border: "1px solid rgba(201,169,110,.12)", borderRadius: 2 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Mentors keep <span style={{ color: "var(--gold-lt)", fontWeight: 600 }}>90%</span> — best payout in industry</span>
          </div>
        </div>

        <div className={`g-card rv d3 ${vis ? "in" : ""}`} style={{ padding: "24px" }}>
          <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Revenue Milestones</div>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}>Scale Projections</div>
          {[
            { sessions: 500, rev: "₹50K/mo", label: "Tier 1", color: "var(--muted3)" },
            { sessions: 1000, rev: "₹1L/mo", label: "Tier 2", color: "var(--gold-dk)" },
            { sessions: 5000, rev: "₹5L/mo", label: "Tier 3", color: "var(--gold)" },
            { sessions: 10000, rev: "₹10L/mo", label: "Tier 4", color: "var(--gold-lt)" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <span style={{ width: 28, height: 28, borderRadius: 2, border: `1px solid ${t.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: t.color, fontWeight: 600, letterSpacing: ".06em", flexShrink: 0 }}>{t.label}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", flex: 1 }}>{t.sessions.toLocaleString("en-IN")} sessions/mo</span>
              <span className="serif" style={{ fontSize: 16, color: t.color, fontWeight: 400 }}>{t.rev}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SECTION 4: Growth Insights ───────────────────────────────────────────────
const GROWTH_RADIAL = [
  { name: "Conversion", value: 32, fill: "#C9A96E" },
  { name: "Retention", value: 78, fill: "#4ADE80" },
  { name: "Completion", value: 91, fill: "#60A5FA" },
];
function GrowthCard({ data, delay, vis }) {
  const num = useCountUp(data.val, 1200, vis);

  return (
    <div
      className={`g-card rv d${delay} ${vis ? "in" : ""}`}
      style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}
    >
      <span style={{ fontSize: 26, opacity: 0.7 }}>{data.icon}</span>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          {data.label}
        </div>

        <div
          className="serif"
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: data.color,
            letterSpacing: "-.02em",
          }}
        >
          {num.toLocaleString("en-IN")}
          {data.suffix}
        </div>
      </div>

      <span className="badge badge-green" style={{ fontSize: 9 }}>
        ▲ {data.growth}
      </span>
    </div>
  );
}

function GrowthInsights() {
  const [ref, vis] = useInView(0.12);
  return (
    <div className="sec" ref={ref}>
      <SectionHeader
        tag="Growth Insights"
        title={
          <>
            Platform{" "}
            <span className="gold-text" style={{ fontStyle: "italic" }}>
              Health
            </span>
          </>
        }
        sub="Key engagement and operational metrics showing platform momentum and efficiency."
        vis={vis}
      />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 20 }}
      >
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              label: "Active Mentors",
              val: 340,
              suffix: "",
              color: "var(--gold-lt)",
              growth: "+8%",
              icon: "👤",
            },
            {
              label: "Active Students",
              val: 5000,
              suffix: "+",
              color: "#4ADE80",
              growth: "+23%",
              icon: "🎓",
            },
            {
              label: "Avg Sessions / Mentor",
              val: 15,
              suffix: "/mo",
              color: "var(--text)",
              growth: "+5%",
              icon: "📅",
            },
            {
              label: "Conversion Rate",
              val: 32,
              suffix: "%",
              color: "#60A5FA",
              growth: "+3%",
              icon: "🔁",
            },
          ].map((s, i) => (
            <GrowthCard key={i} data={s} delay={i} vis={vis} />
          ))}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Radial KPI Card */}
          <div
            className={`g-card rv d3 ${vis ? "in" : ""}`}
            style={{ padding: "24px" }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Core KPIs
            </div>

            <div
              className="serif"
              style={{ fontSize: 18, fontWeight: 500, marginBottom: 20 }}
            >
              Platform Efficiency
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
              }}
            >
              {/* FIXED CHART WRAPPER */}
              <div style={{ width: "55%", minHeight: 240 }}>
                <ResponsiveContainer width="100%" height={240}>
                  <RadialBarChart
                    data={GROWTH_RADIAL}
                    innerRadius="30%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={6}
                      fill="#C9A96E"
                    />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

              {/* KPI Legend */}
              <div>
                {GROWTH_RADIAL.map((k, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: k.fill,
                      }}
                    />
                    <div>
                      <div
                        style={{ fontSize: 11, color: "var(--muted)" }}
                      >
                        {k.name}
                      </div>
                      <div
                        className="serif"
                        style={{
                          fontSize: 20,
                          color: k.fill,
                          fontWeight: 400,
                        }}
                      >
                        {k.value}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Placeholder */}
          <div
            className={`g-card rv d4 ${vis ? "in" : ""}`}
            style={{ padding: "24px" }}
          >
            <div
              style={{
                fontSize: 10,
                color: "var(--muted)",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Leaderboard
            </div>
            <div
              className="serif"
              style={{ fontSize: 18, fontWeight: 500 }}
            >
              Top Mentors
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 13,
                color: "var(--muted)",
              }}
            >
              Mentor leaderboard data appears here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── SECTION 5: Future Streams ─────────────────────────────────────────────────
function FutureMonetization() {
  const [ref, vis] = useInView(0.1);
  return (
    <div className="sec" ref={ref} style={{ marginBottom: 80 }}>
      <div className="gold-line" style={{ marginBottom: 48 }} />
      <SectionHeader tag="Roadmap" title={<>Future Revenue <span className="gold-text" style={{ fontStyle: "italic" }}>Streams</span></>} sub="Beyond the core 10% commission, four additional revenue engines are planned for 2026 to diversify and accelerate growth." vis={vis} centered />

      <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {FUTURE_STREAMS.map((s, i) => (
          <div key={i} className={`stream-card rv d${i} ${vis ? "in" : ""}`}>
            <div style={{ fontSize: 28, marginBottom: 14 }}>{s.icon}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-.01em", color: "var(--text)", lineHeight: 1.3 }}>{s.title}</h3>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, fontWeight: 300, marginBottom: 16 }}>{s.desc}</p>
            <div style={{ height: 1, background: "var(--border)", margin: "0 0 14px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".07em", marginBottom: 2 }}>Est. potential</div>
                <div className="serif" style={{ fontSize: 18, fontWeight: 400, color: s.color }}>{s.est}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", border: `1px solid ${s.color}30`, borderRadius: 2, color: s.color, background: `${s.color}0A`, letterSpacing: ".07em" }}>{s.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Total future potential */}
      <div className={`rv d4 ${vis ? "in" : ""}`} style={{ marginTop: 24, padding: "24px 32px", background: "linear-gradient(145deg,rgba(201,169,110,.06),rgba(201,169,110,.02))", border: "1px solid rgba(201,169,110,.2)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>Combined upside potential by 2026</div>
          <div className="serif" style={{ fontSize: 36, fontWeight: 400, letterSpacing: "-.02em" }}>
            <span className="gold-text">₹80L+ / month</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, fontWeight: 300 }}>Across all planned revenue streams + core commission model</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["₹24K core", "₹1.7L featured", "₹14.9L subscriptions", "₹25L corporate"].map((l, i) => (
            <div key={i} style={{ padding: "8px 14px", border: "1px solid rgba(201,169,110,.2)", borderRadius: 2, fontSize: 11, color: "var(--gold)", letterSpacing: ".04em", background: "rgba(201,169,110,.04)" }}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Summary Stats Row ────────────────────────────────────────────────────────
function SummaryRow() {
  const [ref, vis] = useInView(0.2);
  const stats = [
    { n: 171360, label: "YTD Revenue", prefix: "₹", color: "var(--gold-lt)" },
    { n: 1567, label: "Total Sessions", color: "var(--text)" },
    { n: 340, label: "Active Mentors", color: "var(--gold)" },
    { n: 5000, label: "Learners", suffix: "+", color: "var(--green)" },
    { n: 91, label: "Completion Rate", suffix: "%", color: "var(--blue)" },
  ];
  function StatItem({ stat, delay, vis }) {
    const num = useCountUp(stat.n, 1500, vis);

    return (
      <div
        className={`rv d${delay} ${vis ? "in" : ""}`}
        style={{ textAlign: "center" }}
      >
        <div
          className="serif"
          style={{
            fontSize: 52,
            fontWeight: 300,
            letterSpacing: "-.04em",
            lineHeight: 1,
            background: `linear-gradient(135deg,${stat.color},${stat.color}99)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {stat.prefix}
          {num.toLocaleString("en-IN")}
          {stat.suffix}
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            marginTop: 6,
          }}
        >
          {stat.label}
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} style={{ background: "var(--bg3)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "48px", marginBottom: 0, position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 32 }}>
        {stats.map((s, i) => (
          <StatItem key={i} stat={s} delay={i} vis={vis} />
        ))}



      </div>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#060606", borderTop: "1px solid var(--border)", padding: "40px 48px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, border: "1px solid var(--gold-dk)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,.08)" }}>
            <span className="serif" style={{ color: "var(--gold)", fontSize: 13, fontWeight: 500 }}>M</span>
          </div>
          <span className="serif" style={{ fontSize: 16, letterSpacing: ".06em", color: "var(--text)" }}>MENTORA</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted2)", letterSpacing: ".06em" }}>
          Internal Analytics · Confidential · © 2025
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
          <span style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".05em" }}>Data as of December 2025</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{STYLES}</style>
      <Cursor />
      <Nav />
      <main style={{ position: "relative", zIndex: 1 }}>
        <HeroMetrics />
        <SummaryRow />
        <div style={{ paddingTop: 56 }}>
          <RevenueCharts />
          <RevenueFormula />
          <GrowthInsights />
          <FutureMonetization />
        </div>
      </main>
      <Footer />
    </>
  );
}