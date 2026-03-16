import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
    
function useScrollReveal(threshold = 0.12) {
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
    const raf = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0A0A; --bg2:#111111; --bg3:#161616;
  --surface:rgba(255,255,255,0.03);
  --border:rgba(255,255,255,0.07); --border2:rgba(255,255,255,0.13);
  --gold:#C9A96E; --gold-lt:#E2C99A; --gold-dk:#8A6A3E; --gold-glow:rgba(201,169,110,0.18);
  --text:#F0EDE8; --muted:#7A7570; --muted2:#444;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
::selection{background:var(--gold-dk);color:var(--text)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold-dk)}

body::before{
  content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  opacity:.4;
}

.serif{font-family:'Cormorant Garamond',serif}

/* cursor */
#cur{position:fixed;top:0;left:0;z-index:9999;pointer-events:none;width:8px;height:8px;border-radius:50%;background:var(--gold);transform:translate(-50%,-50%);transition:width .3s,height .3s}
#cur-ring{position:fixed;top:0;left:0;z-index:9998;pointer-events:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(201,169,110,0.5);transform:translate(-50%,-50%);transition:all .15s cubic-bezier(.22,1,.36,1)}

/* reveals */
.rv{opacity:0;transform:translateY(36px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
.rv.in{opacity:1;transform:translateY(0)}
.rv-l{opacity:0;transform:translateX(-36px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
.rv-l.in{opacity:1;transform:translateX(0)}
.rv-r{opacity:0;transform:translateX(36px);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
.rv-r.in{opacity:1;transform:translateX(0)}
.rv-s{opacity:0;transform:scale(.93);transition:opacity .85s cubic-bezier(.22,1,.36,1),transform .85s cubic-bezier(.22,1,.36,1)}
.rv-s.in{opacity:1;transform:scale(1)}
.d0{transition-delay:0ms}.d1{transition-delay:100ms}.d2{transition-delay:200ms}.d3{transition-delay:300ms}.d4{transition-delay:420ms}.d5{transition-delay:540ms}

/* line-by-line reveal */
.ln{overflow:hidden;display:block}
.ln span{display:block;transform:translateY(108%);transition:transform 1.1s cubic-bezier(.22,1,.36,1)}
.ln.in span{transform:translateY(0)}

.gold-text{background:linear-gradient(135deg,var(--gold-lt) 0%,var(--gold) 50%,var(--gold-dk) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* buttons */
.btn-g{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--gold-lt),var(--gold));color:#0A0A0A;border:none;border-radius:1px;padding:15px 36px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:none;transition:all .35s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden}
.btn-g::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.2);transform:translateX(-105%) skewX(-20deg);transition:transform .55s cubic-bezier(.22,1,.36,1)}
.btn-g:hover::after{transform:translateX(110%) skewX(-20deg)}
.btn-g:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(201,169,110,.35)}
.btn-o{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--gold);border:1px solid var(--gold-dk);border-radius:1px;padding:15px 36px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;cursor:none;transition:all .35s cubic-bezier(.22,1,.36,1)}
.btn-o:hover{background:rgba(201,169,110,.07);border-color:var(--gold);transform:translateY(-2px)}

/* nav */
nav{position:fixed;top:0;left:0;right:0;z-index:100;transition:all .4s}
.nav-s{background:rgba(10,10,10,.92);backdrop-filter:blur(24px) saturate(1.5);border-bottom:1px solid var(--border)}
.nav-in{max-width:1200px;margin:0 auto;padding:28px 48px;display:flex;align-items:center;justify-content:space-between;transition:padding .4s}
.nav-s .nav-in{padding-top:16px;padding-bottom:16px}
.nav-lk{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-decoration:none;transition:color .25s;cursor:none}
.nav-lk:hover{color:var(--gold)}

/* section */
.sec{padding:120px 48px;position:relative;z-index:1}
.con{max-width:1200px;margin:0 auto}

/* orb */
.orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
@keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
.orb{animation:glow 5s ease-in-out infinite}

/* tag */
.tag{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(201,169,110,.25);border-radius:1px;padding:5px 14px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:500;background:rgba(201,169,110,.04)}

/* cards */
.g-card{background:linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.01));border:1px solid var(--border);border-radius:3px;position:relative;overflow:hidden;transition:all .45s cubic-bezier(.22,1,.36,1)}
.g-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,169,110,.06),transparent 60%);opacity:0;transition:opacity .45s}
.g-card:hover::before{opacity:1}
.g-card:hover{border-color:rgba(201,169,110,.15);transform:translateY(-8px);box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(201,169,110,.08)}

/* floating */
@keyframes lev1{0%,100%{transform:translateY(0) rotate(-.4deg)}50%{transform:translateY(-14px) rotate(.4deg)}}
@keyframes lev2{0%,100%{transform:translateY(0) rotate(.3deg)}50%{transform:translateY(-10px) rotate(-.3deg)}}
@keyframes lev3{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.fl1{animation:lev1 7s ease-in-out infinite}
.fl2{animation:lev2 9s ease-in-out infinite}
.fl3{animation:lev3 6s ease-in-out infinite;animation-delay:-2s}

/* marquee */
@keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.mq-w{overflow:hidden}
.mq-i{display:flex;width:max-content;animation:mq 24s linear infinite}
.mq-t{font-family:'Cormorant Garamond',serif;font-size:60px;font-weight:300;letter-spacing:-.02em;padding:0 40px;white-space:nowrap;color:transparent;-webkit-text-stroke:1px rgba(201,169,110,.15)}
.mq-t.fill{-webkit-text-stroke:0;color:rgba(201,169,110,.07)}

/* stat */
.stat-n{font-family:'Cormorant Garamond',serif;font-size:68px;font-weight:300;letter-spacing:-.04em;line-height:1;background:linear-gradient(135deg,var(--gold-lt),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

/* rev */
.rev-row{display:flex;align-items:center;justify-content:space-between;padding:24px 0;border-bottom:1px solid var(--border);transition:background .3s}
.rev-row:hover{background:rgba(201,169,110,.03)}
.rev-row:last-child{border-bottom:none}

/* grid bg */
.grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(201,169,110,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(201,169,110,.025) 1px,transparent 1px);background-size:80px 80px;pointer-events:none}

@media(max-width:900px){
  .sec{padding:80px 24px}
  .nav-in{padding:16px 24px}
  .hcols{flex-direction:column!important}
  .hmob{display:none!important}
  .tcols{flex-direction:column!important}
  .scols{flex-direction:column!important}
  .mq-t{font-size:38px}
  .rvcrd{padding:32px 24px!important}
}
`;

function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const lag = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const mv = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
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

function Nav() {
  const navigate = useNavigate();

  const [sc, setSc] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    
    <nav className={sc ? "nav-s" : ""}>
      <div className="nav-in">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, border: "1px solid var(--gold-dk)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,.08)" }}>
            <span className="serif" style={{ color: "var(--gold)", fontSize: 17, fontWeight: 500, lineHeight: 1 }}>M</span>
          </div>
          <span className="serif" style={{ fontSize: 19, fontWeight: 500, letterSpacing: ".06em", color: "var(--text)" }}>MENTORA</span>
        </div>
        <div className="hmob" style={{ display: "flex", gap: 36 }}>
          {["How It Works", "For Mentors", "Pricing"].map(l => <a key={l} href="#" className="nav-lk">{l}</a>)}
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#" className="nav-lk hmob">Sign in</a>
          <button
  className="btn-g"
  style={{ padding: "10px 24px" }}
  onClick={() => navigate("/live-session")}
>
  Try Demo
</button>
        </div>
      </div>
    </nav>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: "relative", width: "100%", height: 520 }}>
      {/* Main mentor card */}
      <div className="fl1" style={{
        position: "absolute", top: 30, left: 0, right: 20,
        background: "linear-gradient(145deg,rgba(26,22,18,.97),rgba(16,14,12,.98))",
        border: "1px solid rgba(201,169,110,.22)", borderRadius: 6,
        padding: "24px 28px", boxShadow: "0 32px 80px rgba(0,0,0,.85), inset 0 1px 0 rgba(201,169,110,.12)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid rgba(201,169,110,.1)" }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#8A6A3E,#C9A96E)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span className="serif" style={{ fontSize: 18, fontWeight: 500, color: "#0A0A0A" }}>SR</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 15, color: "var(--text)" }}>Shriya Rao</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Product Design · ex-Google · 6 yrs</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", display: "inline-block", boxShadow: "0 0 8px #4ADE80" }} />
              <span style={{ fontSize: 11, color: "#4ADE80" }}>Available</span>
            </div>
            <div style={{ fontSize: 13, color: "var(--gold-lt)", fontWeight: 500, marginTop: 4 }}>₹1,000 / hr</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
          {["UX Research", "Design Systems", "Figma", "Career"].map(t => (
            <span key={t} style={{ fontSize: 10, padding: "3px 10px", border: "1px solid rgba(201,169,110,.18)", borderRadius: 2, color: "var(--gold)", letterSpacing: ".06em", background: "rgba(201,169,110,.04)" }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-g" style={{ flex: 1, justifyContent: "center", padding: "10px 16px", fontSize: 11 }}>Book Session</button>
          <button style={{ width: 40, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(201,169,110,.2)", borderRadius: 2, background: "transparent", color: "var(--gold)", fontSize: 14, cursor: "none", flexShrink: 0 }}>♡</button>
        </div>
      </div>

      {/* Stats card */}
      <div className="fl2" style={{
        position: "absolute", bottom: 90, right: -10, width: 185,
        background: "linear-gradient(145deg,rgba(26,22,18,.97),rgba(16,14,12,.98))",
        border: "1px solid rgba(201,169,110,.2)", borderRadius: 6, padding: "18px 20px",
        boxShadow: "0 20px 60px rgba(0,0,0,.7), inset 0 1px 0 rgba(201,169,110,.1)"
      }}>
        <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 10 }}>This week</div>
        <div className="serif" style={{ fontSize: 44, fontWeight: 300, lineHeight: 1, color: "var(--gold-lt)", letterSpacing: "-.02em" }}>186</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, marginBottom: 14 }}>sessions booked</div>
        <div style={{ height: 2, borderRadius: 1, background: "rgba(201,169,110,.12)" }}>
          <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,var(--gold-dk),var(--gold-lt))", borderRadius: 1 }} />
        </div>
        <div style={{ fontSize: 10, color: "#4ADE80", marginTop: 8 }}>↑ 12% vs last week</div>
      </div>

      {/* Review card */}
      <div className="fl3" style={{
        position: "absolute", bottom: 20, left: -10, width: 220,
        background: "linear-gradient(145deg,rgba(26,22,18,.97),rgba(16,14,12,.98))",
        border: "1px solid rgba(201,169,110,.18)", borderRadius: 6, padding: "18px 20px",
        boxShadow: "0 20px 60px rgba(0,0,0,.7), inset 0 1px 0 rgba(201,169,110,.08)"
      }}>
        <div style={{ display: "flex", gap: 2, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => <span key={i} style={{ color: "var(--gold)", fontSize: 13 }}>★</span>)}
        </div>
        <p className="serif" style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, fontStyle: "italic" }}>
          "Completely transformed how I approach design problems."
        </p>
        <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 10 }}>— Arjun M., Product Designer</div>
      </div>

      {/* Vertical line */}
      <div style={{ position: "absolute", top: 0, left: "50%", width: 1, height: "100%", background: "linear-gradient(180deg,transparent,rgba(201,169,110,.06),transparent)", pointerEvents: "none" }} />
    </div>
  );
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);
  const T = (delay, children, extra = {}) => (
    <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)", transition: `all .9s cubic-bezier(.22,1,.36,1) ${delay}s`, ...extra }}>{children}</div>
  );
  return (
    <section className="sec" style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 140, overflow: "hidden" }}>
      <div className="orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(201,169,110,.07) 0%,transparent 70%)", top: "5%", right: "-15%", animationDelay: "0s" }} />
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(201,169,110,.04) 0%,transparent 70%)", bottom: "10%", left: "-10%", animationDelay: "-2.5s" }} />
      <div className="con">
        <div className="hcols" style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <div style={{ flex: "0 0 52%", maxWidth: "52%" }}>
            {T(0.1, <span className="tag"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)" }} />Mentorship Redefined</span>, { marginBottom: 28 })}

            <h1 className="serif" style={{ fontSize: "clamp(52px, 6.5vw, 86px)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-.02em", marginBottom: 30 }}>
              {[
                { text: "Personalized", delay: ".2s", italic: false, gold: false },
                { text: "Mentorship.", delay: ".32s", italic: false, gold: false },
                { text: "Real Growth.", delay: ".44s", italic: true, gold: true },
              ].map((l, i) => (
                <div key={i} className="ln" ref={el => el && setTimeout(() => el.classList.add("in"), 150)} style={{ transitionDelay: l.delay }}>
                  <span style={{ display: "block" }}>
                    {l.gold ? <span className="gold-text" style={{ fontStyle: "italic" }}>{l.text}</span> : l.text}
                  </span>
                </div>
              ))}
            </h1>

            {T(0.6, <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.85, maxWidth: 430, fontWeight: 300 }}>Connect with verified professionals for 1:1 mentorship. Accelerate your career with guidance crafted precisely around your goals.</p>, { marginBottom: 44 })}

            {T(0.75, <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}><button className="btn-g">Find a Mentor ↗</button><button className="btn-o">Become a Mentor</button></div>, {})}

            {T(1.0, (
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 52, paddingTop: 36, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex" }}>
                  {["#C4A882","#B8956A","#D4B896","#C9A96E"].map((c, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: "2px solid var(--bg)", marginLeft: i === 0 ? 0 : -9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0A0A0A" }}>{["S","A","K","+"][i]}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>5,000+ learners</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", display: "flex", gap: 4, alignItems: "center" }}>
                    <span style={{ color: "var(--gold)" }}>★★★★★</span> 4.9 avg rating
                  </div>
                </div>
                <div style={{ width: 1, height: 32, background: "var(--border2)" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>2,400 sessions/mo</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>across 40+ domains</div>
                </div>
              </div>
            ), {})}
          </div>

          <div className="hmob" style={{ flex: 1 }}>
            {T(0.4, <HeroVisual />, {})}
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Grow","Learn","Mentor","Excel","Rise","Connect","Accelerate","Discover"];
  const doubled = [...words, ...words, ...words, ...words];
  return (
    <div style={{ padding: "52px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden", position: "relative", zIndex: 1, background: "var(--bg2)" }}>
      <div className="mq-w">
        <div className="mq-i">
          {doubled.map((w, i) => (
            <span key={i} className={`mq-t ${i % 3 === 1 ? "fill" : ""}`}>{w} <span style={{ color: "rgba(201,169,110,.2)" }}>·</span> </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Problem() {
  const [ref, vis] = useScrollReveal();
  const items = [
    { sym: "◈", n: "01", title: "Generic courses lack personalization", body: "Mass-market content cannot adapt to your career context, timeline, or skill gaps. You pay for what you already know." },
    { sym: "◎", n: "02", title: "Finding trusted mentors is broken", body: "Cold LinkedIn messages, unverified profiles, zero accountability. The signal-to-noise ratio makes real mentorship nearly impossible." },
    { sym: "◇", n: "03", title: "Skilled professionals can't monetize", body: "Experts want to share knowledge but lack a structured, trusted platform to do it professionally and at scale." },
  ];
  return (
    <section className="sec">
      <div className="orb" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(201,169,110,.04),transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div className="con" ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div className={`rv d0 ${vis ? "in" : ""}`}><span className="tag" style={{ marginBottom: 22, display: "inline-flex" }}>The Problem</span></div>
          <h2 className={`serif rv d1 ${vis ? "in" : ""}`} style={{ fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 400, letterSpacing: "-.02em", lineHeight: 1.1, marginTop: 18 }}>What's holding you back</h2>
        </div>
        <div className="tcols" style={{ display: "flex", gap: 20 }}>
          {items.map((p, i) => (
            <div key={i} className={`g-card rv d${i + 2} ${vis ? "in" : ""}`} style={{ flex: 1, padding: "40px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 30 }}>
                <span className="serif" style={{ fontSize: 52, fontWeight: 300, color: "rgba(201,169,110,.13)", lineHeight: 1 }}>{p.sym}</span>
                <span style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: ".14em" }}>{p.n}</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 14, lineHeight: 1.4 }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.85, fontWeight: 300 }}>{p.body}</p>
              <div style={{ marginTop: 32, height: 1, background: "linear-gradient(90deg,var(--gold-dk),transparent)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


    function StatItem({ n, sfx, label, vis, delay }) {
        const val = useCountUp(n, 1600, vis);
      
        return (
          <div className={`rv d${delay} ${vis ? "in" : ""}`} style={{ textAlign: "center" }}>
            <div className="stat-n">
              {val.toLocaleString("en-IN")}
              {sfx}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 8 }}>
              {label}
            </div>
          </div>
        );
      }
      
      function Stats() {
        const [ref, vis] = useScrollReveal();
      
        const data = [
          { n: 5000, sfx: "+", label: "Active Learners" },
          { n: 340, sfx: "+", label: "Verified Mentors" },
          { n: 98, sfx: "%", label: "Satisfaction Rate" },
          { n: 40, sfx: "+", label: "Domains Covered" },
        ];
      
        return (
          <section
            style={{
              padding: "72px 48px",
              background: "var(--bg3)",
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div className="con" ref={ref}>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 40 }}>
                {data.map((d, i) => (
                  <StatItem
                    key={i}
                    n={d.n}
                    sfx={d.sfx}
                    label={d.label}
                    vis={vis}
                    delay={i + 1}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      } 
function HowItWorks() {
  const [ref, vis] = useScrollReveal();
  const steps = [
    { n: "01", icon: "⊙", title: "Browse & Discover", body: "Filter verified mentors by expertise, availability, and communication style. Read real community reviews." },
    { n: "02", icon: "◻", title: "Book a Session", body: "Choose your slot, pay securely. No subscriptions, no lock-in. Pure pay-per-session simplicity." },
    { n: "03", icon: "△", title: "Learn & Grow", body: "Attend focused 1:1 video sessions. Get actionable feedback and a clear, personalized growth path." },
  ];
  return (
    <section className="sec" id="how" style={{ background: "var(--bg2)" }}>
      <div className="con" ref={ref}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24 }}>
          <div>
            <div className={`rv d0 ${vis ? "in" : ""}`}><span className="tag" style={{ marginBottom: 22, display: "inline-flex" }}>How It Works</span></div>
            <h2 className={`serif rv d1 ${vis ? "in" : ""}`} style={{ fontSize: "clamp(34px,4.5vw,58px)", fontWeight: 400, letterSpacing: "-.02em", lineHeight: 1.1, marginTop: 18 }}>
              Three steps to your<br />
              <span className="gold-text" style={{ fontStyle: "italic" }}>first breakthrough</span>
            </h2>
          </div>
          <p className={`rv d2 ${vis ? "in" : ""}`} style={{ maxWidth: 280, fontSize: 14, color: "var(--muted)", lineHeight: 1.85, fontWeight: 300 }}>
            No complexity, no lengthy onboarding. Start learning from an expert within 24 hours.
          </p>
        </div>
        <div className="scols" style={{ display: "flex" }}>
          {steps.map((s, i) => (
            <div key={i} className={`rv d${i + 2} ${vis ? "in" : ""}`}
              style={{ flex: 1, padding: "44px 36px", border: "1px solid var(--border)", position: "relative", transition: "all .4s cubic-bezier(.22,1,.36,1)", marginLeft: i > 0 ? -1 : 0, background: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,169,110,.03)"; e.currentTarget.style.zIndex = 2; e.currentTarget.querySelector(".step-bar").style.transform = "scaleX(1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.zIndex = 1; e.currentTarget.querySelector(".step-bar").style.transform = "scaleX(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 44 }}>
                <span style={{ fontSize: 10, color: "var(--gold)", letterSpacing: ".14em" }}>{s.n}</span>
                <span className="serif" style={{ fontSize: 38, color: "rgba(201,169,110,.2)", lineHeight: 1 }}>{s.icon}</span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-.02em", marginBottom: 14 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.85, fontWeight: 300 }}>{s.body}</p>
              <div className="step-bar" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,var(--gold-dk),var(--gold))", transform: "scaleX(0)", transformOrigin: "left", transition: "transform .45s cubic-bezier(.22,1,.36,1)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Revenue() {
  const [ref, vis] = useScrollReveal();
  const s = useCountUp(1000, 1200, vis);
  const p = useCountUp(100, 1200, vis);
  const m = useCountUp(900, 1200, vis);
  const rows = [
    { label: "Student pays", sub: "Per session · no subscription", val: s, big: false },
    { label: "Platform fee", sub: "10% transparent commission", val: p, big: false, dim: true },
    { label: "Mentor receives", sub: "Directly to bank account", val: m, big: true },
  ];
  return (
    <section className="sec" id="pricing">
      <div className="orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(201,169,110,.06),transparent 70%)", top: "50%", right: "-20%", transform: "translateY(-50%)" }} />
      <div className="con" ref={ref}>
        <div style={{ display: "flex", alignItems: "center", gap: 80, flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 44%", maxWidth: "44%" }}>
            <div className={`rv d0 ${vis ? "in" : ""}`}><span className="tag" style={{ marginBottom: 22, display: "inline-flex" }}>Revenue Model</span></div>
            <h2 className={`serif rv d1 ${vis ? "in" : ""}`} style={{ fontSize: "clamp(34px,4vw,54px)", fontWeight: 400, letterSpacing: "-.02em", lineHeight: 1.1, marginTop: 18, marginBottom: 22 }}>
              Transparent.<br />
              <span className="gold-text" style={{ fontStyle: "italic" }}>Radically fair.</span>
            </h2>
            <p className={`rv d2 ${vis ? "in" : ""}`} style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.85, fontWeight: 300, marginBottom: 32 }}>
              Mentors keep 90% of every session. No hidden charges, no lock-in. The most mentor-first model in the industry.
            </p>
            <div className={`rv d3 ${vis ? "in" : ""}`} style={{ padding: "20px 24px", border: "1px solid rgba(201,169,110,.2)", background: "rgba(201,169,110,.03)", borderRadius: 3 }}>
              <div style={{ fontSize: 10, color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 8 }}>Industry comparison</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>Standard platforms take 20–40%. Mentora takes just 10%. The rest is entirely yours.</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className={`rv-s d2 ${vis ? "in" : ""}`}>
              <div className="rvcrd" style={{
                background: "linear-gradient(145deg,rgba(22,18,14,.98),rgba(14,12,10,.99))",
                border: "1px solid rgba(201,169,110,.22)", borderRadius: 6, padding: "48px 44px",
                boxShadow: "0 40px 100px rgba(0,0,0,.85), inset 0 1px 0 rgba(201,169,110,.12)"
              }}>
                {rows.map((r, i) => (
                  <div key={i} className="rev-row">
                    <div>
                      <div style={{ fontSize: r.big ? 15 : 13, fontWeight: 500, color: r.dim ? "var(--muted)" : "var(--text)", letterSpacing: "-.01em" }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 3 }}>{r.sub}</div>
                    </div>
                    <div className="serif" style={{ fontSize: r.big ? 42 : 30, fontWeight: 400, lineHeight: 1, letterSpacing: "-.02em", color: r.big ? "var(--gold-lt)" : r.dim ? "var(--muted)" : "var(--text)" }}>
                      ₹{r.val.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--border)", textAlign: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--muted2)", letterSpacing: ".05em" }}>
                    Instant payout · No minimum threshold · UPI & bank transfer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const [ref, vis] = useScrollReveal(0.2);
  return (
    <section className="sec" style={{ background: "var(--bg2)", textAlign: "center", overflow: "hidden" }}>
      <div className="orb" style={{ width: 900, height: 900, background: "radial-gradient(circle,rgba(201,169,110,.07),transparent 60%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div className="grid-bg" />
      <div className="con" ref={ref} style={{ position: "relative", zIndex: 1 }}>
        <div className={`rv d0 ${vis ? "in" : ""}`}><span className="tag" style={{ marginBottom: 28, display: "inline-flex" }}>Begin Today</span></div>
        <h2 className={`serif rv d1 ${vis ? "in" : ""}`} style={{ fontSize: "clamp(52px,7.5vw,100px)", fontWeight: 400, letterSpacing: "-.03em", lineHeight: 1.0, marginTop: 20, marginBottom: 32 }}>
          Start Learning<br />
          <span className="gold-text" style={{ fontStyle: "italic" }}>Smarter.</span>
        </h2>
        <p className={`rv d2 ${vis ? "in" : ""}`} style={{ fontSize: 17, color: "var(--muted)", maxWidth: 460, margin: "0 auto 52px", lineHeight: 1.85, fontWeight: 300 }}>
          Join thousands of ambitious professionals growing with world-class mentors on Mentora.
        </p>
        <div className={`rv d3 ${vis ? "in" : ""}`} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <Link 
  to="/login/student" 
  className="btn-g" 
  style={{ padding: "18px 52px", fontSize: 12 }}
>
  Find a Mentor ↗
</Link>

<Link 
  to="/Login/mentor" 
  className="btn-o" 
  style={{ padding: "18px 52px", fontSize: 12 }}
>
  Become a Mentor
</Link>
<Link 
  to="/admin" 
  className="btn-g" 
  style={{ padding: "18px 52px", fontSize: 12 }}
>
 View analytics
</Link>
        </div>
        <p className={`rv d4 ${vis ? "in" : ""}`} style={{ marginTop: 32, fontSize: 11, color: "var(--muted2)", letterSpacing: ".08em", textTransform: "uppercase" }}>
          No subscription · Sessions from ₹500 · Cancel anytime
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: "Platform", links: ["Browse Mentors", "Become a Mentor", "How It Works", "Pricing"] },
    { title: "Company", links: ["About Us", "Blog", "Careers", "Press"] },
    { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
  ];
  return (
    <footer style={{ background: "#060606", borderTop: "1px solid var(--border)", padding: "80px 48px 48px", position: "relative", zIndex: 1 }}>
      <div className="con">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 48, marginBottom: 64 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 30, height: 30, border: "1px solid var(--gold-dk)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,169,110,.08)" }}>
                <span className="serif" style={{ color: "var(--gold)", fontSize: 17, fontWeight: 500, lineHeight: 1 }}>M</span>
              </div>
              <span className="serif" style={{ fontSize: 19, fontWeight: 500, letterSpacing: ".06em", color: "var(--text)" }}>MENTORA</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.8, fontWeight: 300 }}>
              The mentorship marketplace for professionals who want to grow with intention and precision.
            </p>
            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
              {["𝕏","in","ig"].map(s => (
                <div key={s} style={{ width: 34, height: 34, border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none", fontSize: 13, color: "var(--muted)", transition: "all .2s", borderRadius: 2 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold-dk)"; e.currentTarget.style.color = "var(--gold)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--muted)"; }}
                >{s}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 64, flexWrap: "wrap" }}>
            {cols.map(c => (
              <div key={c.title}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em", color: "var(--gold)", marginBottom: 20, fontWeight: 500 }}>{c.title}</div>
                {c.links.map(l => (
                  <div key={l} style={{ fontSize: 14, color: "var(--muted)", marginBottom: 12, cursor: "none", transition: "color .25s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}
                  >{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontSize: 12, color: "var(--muted2)", letterSpacing: ".04em" }}>© 2025 Mentora Technologies Pvt. Ltd.</span>
          <span style={{ fontSize: 12 }}><span className="gold-text">hello@mentora.in</span></span>
          <span style={{ fontSize: 12, color: "var(--muted2)" }}>Crafted with care in India 🇮🇳</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <style>{STYLES}</style>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <Stats />
        <HowItWorks />
        <Revenue />
        <CTA />
      </main>
      <Footer />
    </>
  );
}