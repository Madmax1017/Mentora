import { useState, useEffect, useRef,  } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED EVENT BUS  (works cross-tab via BroadcastChannel + same-tab via custom events)
// Student dashboard listens for "mentora:mentor_cancel" events
// ─────────────────────────────────────────────────────────────────────────────
const BUS_CHANNEL = "mentora_bus";
let _bc = null;
function getBus() {
  if (!_bc && typeof BroadcastChannel !== "undefined") _bc = new BroadcastChannel(BUS_CHANNEL);
  return _bc;
}
function emit(type, payload) {
  const msg = { type, payload, ts: Date.now() };
  // same-tab
  window.dispatchEvent(new CustomEvent("mentora_bus", { detail: msg }));
  // cross-tab
  try {
    getBus()?.postMessage(msg);
  } catch {
    // ignore bus errors
  }
}
// ─── Global Styles ────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0A0A;--bg2:#111111;--bg3:#161616;--bg4:#1A1A1A;
  --border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.13);--border3:rgba(255,255,255,.2);
  --gold:#C9A96E;--gold-lt:#E2C99A;--gold-dk:#8A6A3E;
  --text:#F0EDE8;--muted:#7A7570;--muted2:#3A3530;--muted3:#555;
  --green:#4ADE80;--red:#F87171;--blue:#60A5FA;--amber:#FBBF24;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
::selection{background:var(--gold-dk);color:var(--text)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--gold-dk);border-radius:2px}
.serif{font-family:'Cormorant Garamond',serif}
.gold-text{background:linear-gradient(135deg,var(--gold-lt) 0%,var(--gold) 50%,var(--gold-dk) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");opacity:.35}

/* cursor */
#cur{position:fixed;top:0;left:0;z-index:9999;pointer-events:none;width:8px;height:8px;border-radius:50%;background:var(--gold);transform:translate(-50%,-50%)}
#cur-ring{position:fixed;top:0;left:0;z-index:9998;pointer-events:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(201,169,110,.5);transform:translate(-50%,-50%);transition:all .15s cubic-bezier(.22,1,.36,1)}

/* orbs */
.orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
@keyframes glow{0%,100%{opacity:.4}50%{opacity:.9}} .orb{animation:glow 5s ease-in-out infinite}

/* nav */
.nav-wrap{position:sticky;top:0;z-index:100;background:rgba(10,10,10,.92);backdrop-filter:blur(24px) saturate(1.5);border-bottom:1px solid var(--border)}
.nav-in{max-width:1280px;margin:0 auto;padding:0 40px;display:flex;align-items:center;height:64px;gap:20}

/* tag */
.tag-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(201,169,110,.25);border-radius:1px;padding:5px 14px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:500;background:rgba(201,169,110,.04)}

/* sections */
.page{max-width:1280px;margin:0 auto;padding:40px 40px 80px;position:relative;z-index:1}

/* glass cards */
.g-card{background:linear-gradient(145deg,rgba(26,22,18,.96),rgba(16,14,12,.98));border:1px solid var(--border);border-radius:4px;position:relative;overflow:hidden;transition:border-color .35s}
.g-card:hover{border-color:var(--border2)}
.g-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,169,110,.05),transparent 55%);opacity:0;transition:opacity .4s;pointer-events:none}
.g-card:hover::before{opacity:1}

/* metric card hover lift */
.metric-card{transition:all .45s cubic-bezier(.22,1,.36,1)}
.metric-card:hover{transform:translateY(-5px);box-shadow:0 24px 60px rgba(0,0,0,.6),0 0 0 1px rgba(201,169,110,.1)}

/* badges */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:1px;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.badge-green{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);color:var(--green)}
.badge-gold{background:rgba(201,169,110,.1);border:1px solid rgba(201,169,110,.2);color:var(--gold)}
.badge-muted{background:rgba(122,117,112,.1);border:1px solid rgba(122,117,112,.2);color:var(--muted)}
.badge-red{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);color:var(--red)}
.badge-blue{background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.2);color:var(--blue)}
.badge-amber{background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);color:var(--amber)}

/* buttons */
.btn-g{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--gold-lt),var(--gold));color:#0A0A0A;border:none;border-radius:1px;padding:11px 24px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:none;transition:all .35s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden}
.btn-g::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.2);transform:translateX(-105%) skewX(-20deg);transition:transform .55s cubic-bezier(.22,1,.36,1)}
.btn-g:hover::after{transform:translateX(110%) skewX(-20deg)}
.btn-g:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(201,169,110,.3)}
.btn-o{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--gold);border:1px solid var(--gold-dk);border-radius:1px;padding:8px 18px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:none;transition:all .3s}
.btn-o:hover{background:rgba(201,169,110,.07);border-color:var(--gold);transform:translateY(-1px)}
.btn-red{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--red);border:1px solid rgba(248,113,113,.3);border-radius:1px;padding:8px 18px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:none;transition:all .3s}
.btn-red:hover{background:rgba(248,113,113,.08);border-color:var(--red);transform:translateY(-1px)}

/* avatar */
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-weight:500;color:#0A0A0A;border:2px solid rgba(201,169,110,.3);flex-shrink:0}

/* table */
.tbl{width:100%;border-collapse:collapse}
.tbl thead th{padding:10px 16px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:500;text-align:left;border-bottom:1px solid var(--border)}
.tbl tbody tr{border-bottom:1px solid var(--border);transition:background .25s}
.tbl tbody tr:last-child{border-bottom:none}
.tbl tbody tr:hover{background:rgba(255,255,255,.02)}
.tbl tbody td{padding:14px 16px;font-size:13px;vertical-align:middle}

/* modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);z-index:400;display:flex;align-items:center;justify-content:center;padding:24px}
.modal-box{background:linear-gradient(145deg,#1A1814,#120F0C);border:1px solid rgba(201,169,110,.2);border-radius:6px;width:100%;max-width:520px;overflow:hidden;position:relative;box-shadow:0 40px 120px rgba(0,0,0,.9),inset 0 1px 0 rgba(201,169,110,.1)}

/* toast */
@keyframes toastIn{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
@keyframes toastOut{from{opacity:1}to{opacity:0;transform:translateX(110%)}}
.toast{position:fixed;bottom:32px;right:32px;z-index:999;background:linear-gradient(135deg,#1A1814,#120F0C);border:1px solid rgba(201,169,110,.3);border-radius:4px;padding:16px 24px;display:flex;align-items:center;gap:12px;box-shadow:0 20px 60px rgba(0,0,0,.8);animation:toastIn .4s cubic-bezier(.22,1,.36,1) both;min-width:300px}
.toast.out{animation:toastOut .35s ease forwards}
.toast-red{border-color:rgba(248,113,113,.3)}
.toast-green{border-color:rgba(74,222,128,.3)}

/* reveal animations */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes barGrow{from{width:0}to{width:var(--w)}}

/* chart */
.chart-bar{border-radius:2px 2px 0 0;transition:opacity .25s}
.chart-bar:hover{opacity:.75}

/* toggle */
.toggle{position:relative;width:44px;height:24px;cursor:none}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.toggle-track{position:absolute;inset:0;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid var(--border2);transition:background .3s}
.toggle input:checked ~ .toggle-track{background:rgba(201,169,110,.3);border-color:var(--gold-dk)}
.toggle-thumb{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--muted);transition:all .3s}
.toggle input:checked ~ .toggle-thumb{transform:translateX(20px);background:var(--gold)}

/* stat-mini */
.stat-mini{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:3px;padding:14px 18px;text-align:center}

@media(max-width:1024px){.page{padding:28px 24px 60px}}
@media(max-width:768px){
  .hide-mob{display:none!important}
  .nav-in{padding:0 20px}
  .page{padding:24px 16px 60px}
  .grid-3{grid-template-columns:1fr!important}
  .grid-2{grid-template-columns:1fr!important}
  .tbl thead th:nth-child(n+4){display:none}
  .tbl tbody td:nth-child(n+4){display:none}
}
`;

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MENTOR = {
  name: "Arjun Mehta", initials: "AM", title: "Senior SDE @ Amazon",
  expertise: "Full Stack Developer", gradient: "linear-gradient(135deg,#8A6A3E,#C9A96E)",
  rating: 4.9, reviewCount: 142,
};

const PRICE_PER_SESSION = 1200;
const COMMISSION_RATE   = 0.10;

const INITIAL_SESSIONS = [
  { id:1,  student:"Rahul Sharma",   avatar:"RS", date:"2025-08-04", time:"6:00 PM",  status:"confirmed",  amount:1200, topic:"System Design Fundamentals",    studentId:"s1" },
  { id:2,  student:"Priya Joshi",    avatar:"PJ", date:"2025-08-05", time:"7:30 PM",  status:"confirmed",  amount:1200, topic:"FAANG Interview Preparation",    studentId:"s2" },
  { id:3,  student:"Karan Singh",    avatar:"KS", date:"2025-08-06", time:"8:00 PM",  status:"confirmed",  amount:1200, topic:"React Architecture Deep-dive",   studentId:"s3" },
  { id:4,  student:"Ananya Gupta",   avatar:"AG", date:"2025-07-28", time:"6:30 PM",  status:"completed",  amount:1200, topic:"Node.js & REST API Design",      studentId:"s4" },
  { id:5,  student:"Dev Malhotra",   avatar:"DM", date:"2025-07-25", time:"5:00 PM",  status:"completed",  amount:1200, topic:"AWS Cloud Basics",               studentId:"s5" },
  { id:6,  student:"Meera Iyer",     avatar:"MI", date:"2025-07-20", time:"7:00 PM",  status:"completed",  amount:1200, topic:"TypeScript Best Practices",      studentId:"s6" },
  { id:7,  student:"Sameer Qureshi", avatar:"SQ", date:"2025-07-15", time:"6:00 PM",  status:"completed",  amount:1200, topic:"Docker & Kubernetes Intro",      studentId:"s7" },
  { id:8,  student:"Neha Joshi",     avatar:"NJ", date:"2025-08-07", time:"9:00 PM",  status:"confirmed",  amount:1200, topic:"Career Roadmap Planning",        studentId:"s8" },
  { id:9,  student:"Lavanya Pillai", avatar:"LP", date:"2025-07-10", time:"5:30 PM",  status:"cancelled",  amount:1200, topic:"Full Stack Portfolio Review",    studentId:"s9" },
  { id:10, student:"Vivek Nair",     avatar:"VN", date:"2025-08-08", time:"8:30 PM",  status:"confirmed",  amount:1200, topic:"Microservices Architecture",     studentId:"s10" },
];

const MONTHLY_DATA = [
  { month:"Jan", sessions:3,  earnings:3240 },
  { month:"Feb", sessions:4,  earnings:4320 },
  { month:"Mar", sessions:5,  earnings:5400 },
  { month:"Apr", sessions:4,  earnings:4320 },
  { month:"May", sessions:6,  earnings:6480 },
  { month:"Jun", sessions:7,  earnings:7560 },
  { month:"Jul", sessions:9,  earnings:9720 },
  { month:"Aug", sessions:4,  earnings:4320 },
];

const AVATAR_COLORS = {
  RS:"linear-gradient(135deg,#8A6A3E,#C9A96E)", PJ:"linear-gradient(135deg,#5A4A7A,#9A80C9)",
  KS:"linear-gradient(135deg,#2A5A4A,#5A9A80)", AG:"linear-gradient(135deg,#3A3A5A,#7A80C9)",
  DM:"linear-gradient(135deg,#4A3A1A,#AA8A3A)", MI:"linear-gradient(135deg,#5A3A2A,#C97A4E)",
  SQ:"linear-gradient(135deg,#3A1A4A,#8A5AAA)", NJ:"linear-gradient(135deg,#1A3A5A,#4A7AAA)",
  LP:"linear-gradient(135deg,#3A4A2A,#7A9A5A)", VN:"linear-gradient(135deg,#2A4A5A,#5A90C9)",
};

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200, start = false) {
    const [val, setVal] = useState(start ? target : 0);
  
    useEffect(() => {
      if (!start || target === 0) return;
  
      let frameId;
      let startTime = null;
  
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
  
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const next = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
  
        setVal(next);
  
        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        }
      };
  
      frameId = requestAnimationFrame(animate);
  
      return () => {
        if (frameId) cancelAnimationFrame(frameId);
      };
    }, [start, target, duration]);
  
    return val;
  }
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ─── Cursor ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const mouse = useRef({ x:0, y:0 }), lag = useRef({ x:0, y:0 });
  useEffect(() => {
    const mv = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
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
  return <><div id="cur" ref={dot}/><div id="cur-ring" ref={ring}/></>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => { const t = setTimeout(() => { setOut(true); setTimeout(onDone, 380); }, 4000); return () => clearTimeout(t); }, []);
  return (
    <div className={`toast ${msg.red ? "toast-red" : msg.green ? "toast-green" : ""} ${out ? "out" : ""}`}>
      <span style={{ fontSize:20 }}>{msg.icon}</span>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{msg.title}</div>
        <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{msg.body}</div>
      </div>
    </div>
  );
}

// ─── Unavailability / Notify Student Modal ────────────────────────────────────
function UnavailableModal({ session, onConfirm, onClose }) {
  const [step,    setStep]    = useState("reason");
  const [reason,  setReason]  = useState("");
  const [note,    setNote]    = useState("");
  const [sending, setSending] = useState(false);
  const [done,    setDone]    = useState(false);

  const REASONS = [
    { id:"emergency",  icon:"🚨", label:"Personal emergency",      sub:"Unexpected urgent circumstance" },
    { id:"health",     icon:"🏥", label:"Health issue",             sub:"Feeling unwell today"           },
    { id:"conflict",   icon:"🗓", label:"Schedule conflict",        sub:"Unavoidable meeting overlap"    },
    { id:"technical",  icon:"💻", label:"Technical problems",       sub:"Platform or internet issue"     },
    { id:"other",      icon:"✏️", label:"Other reason",             sub:"Describe in the note below"     },
  ];

  const refund = session.amount;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setDone(true);
      // Emit cross-page event so student dashboard can handle the refund
      emit("mentora:mentor_cancel", {
        sessionId:  session.id,
        studentId:  session.studentId,
        studentName:session.student,
        mentorName: MENTOR.name,
        slot:       `${session.date} ${session.time}`,
        topic:      session.topic,
        refundAmt:  refund,
        reason:     reason,
        note:       note,
      });
      setTimeout(() => { onConfirm(session.id); onClose(); }, 1600);
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !sending && onClose()}>
      <div className="modal-box" style={{ animation:"scaleIn .38s cubic-bezier(.22,1,.36,1)" }}>

        {/* Done */}
        {done && (
          <div style={{ padding:"52px 32px", textAlign:"center", animation:"fadeIn .4s ease" }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom:18, margin:"0 auto 18px" }}>
              <circle cx="28" cy="28" r="27" stroke="rgba(201,169,110,.3)" strokeWidth="1"/>
              <circle cx="28" cy="28" r="27" stroke="var(--gold)" strokeWidth="1.5"
                strokeDasharray="170" strokeDashoffset="170"
                style={{ animation:"dash .8s ease forwards" }}/>
              <polyline points="18,28 25,35 38,20" stroke="var(--gold-lt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray:30, strokeDashoffset:30, animation:"dash .5s ease .2s forwards" }}/>
            </svg>
            <style>{`@keyframes dash{to{stroke-dashoffset:0}}`}</style>
            <div className="serif" style={{ fontSize:26, fontWeight:500, marginBottom:10 }}>Notification Sent</div>
            <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7 }}>
              Student has been notified. A full refund of <span style={{ color:"var(--gold-lt)" }}>₹{refund.toLocaleString("en-IN")}</span> will be processed automatically.
            </div>
          </div>
        )}

        {/* Processing */}
        {sending && !done && (
          <div style={{ padding:"52px 32px", textAlign:"center" }}>
            <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:20 }}>Sending Notification</div>
            <div style={{ width:"100%", height:2, background:"rgba(255,255,255,.06)", borderRadius:1, overflow:"hidden", marginBottom:20 }}>
              <div style={{ height:"100%", background:"linear-gradient(90deg,var(--gold-dk),var(--gold-lt))", animation:"processingBar 1.8s cubic-bezier(.4,0,.2,1) forwards" }}/>
            </div>
            <style>{`@keyframes processingBar{from{width:0}to{width:100%}}`}</style>
            <div style={{ fontSize:13, color:"var(--muted)" }}>Notifying {session.student} & processing refund…</div>
          </div>
        )}

        {/* Step: reason */}
        {!sending && step === "reason" && (
          <>
            <div style={{ padding:"24px 28px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:10, color:"var(--amber)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>Step 1 of 2 · Notify Student</div>
                <div className="serif" style={{ fontSize:22, fontWeight:500 }}>Why are you unavailable?</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>Student will receive a full refund automatically.</div>
              </div>
              <button onClick={onClose} style={{ width:30, height:30, border:"1px solid var(--border2)", borderRadius:2, background:"transparent", color:"var(--muted)", cursor:"none", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>✕</button>
            </div>

            {/* Session info */}
            <div style={{ margin:"16px 28px 12px", padding:"12px 14px", background:"rgba(255,255,255,.03)", border:"1px solid var(--border)", borderRadius:3, display:"flex", alignItems:"center", gap:12 }}>
              <div className="avatar" style={{ width:36, height:36, background: AVATAR_COLORS[session.avatar] || "var(--gold-dk)", fontSize:12 }}>{session.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500 }}>{session.student}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{session.date} · {session.time}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div className="serif" style={{ fontSize:18, color:"var(--gold-lt)" }}>₹{session.amount.toLocaleString("en-IN")}</div>
                <div style={{ fontSize:10, color:"var(--green)" }}>Full refund</div>
              </div>
            </div>

            {/* Reasons */}
            <div style={{ padding:"0 28px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {REASONS.map(r => (
                <div key={r.id} onClick={() => setReason(r.id)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:`1px solid ${reason===r.id?"var(--amber)":"var(--border2)"}`, borderRadius:3, cursor:"none", transition:"all .25s", background:reason===r.id?"rgba(251,191,36,.07)":"transparent" }}
                  onMouseEnter={e => { if(reason!==r.id) e.currentTarget.style.borderColor="rgba(251,191,36,.35)"; }}
                  onMouseLeave={e => { if(reason!==r.id) e.currentTarget.style.borderColor="var(--border2)"; }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:500, color:reason===r.id?"var(--text)":"var(--muted)", lineHeight:1.3 }}>{r.label}</div>
                    <div style={{ fontSize:10, color:"var(--muted2)", marginTop:1 }}>{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div style={{ padding:"14px 28px" }}>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add a personal note for the student (optional)…"
                style={{ width:"100%", minHeight:72, background:"rgba(255,255,255,.04)", border:"1px solid var(--border2)", borderRadius:2, color:"var(--text)", fontFamily:"'Outfit',sans-serif", fontSize:13, padding:"10px 12px", outline:"none", resize:"vertical", transition:"border-color .25s", lineHeight:1.6 }}
                onFocus={e => e.target.style.borderColor="rgba(251,191,36,.4)"}
                onBlur={e => e.target.style.borderColor="var(--border2)"}/>
            </div>

            <div style={{ padding:"0 28px 24px", display:"flex", gap:10, borderTop:"1px solid var(--border)", paddingTop:16 }}>
              <button className="btn-o" onClick={onClose} style={{ flex:1, justifyContent:"center" }}>Back</button>
              <button onClick={() => reason && setStep("confirm")}
                style={{ flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", background:"rgba(251,191,36,.12)", border:"1px solid rgba(251,191,36,.35)", borderRadius:1, padding:"8px 18px", fontFamily:"'Outfit',sans-serif", fontSize:11, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", cursor:"none", color:"var(--amber)", transition:"all .3s", opacity:reason?1:.4, pointerEvents:reason?"auto":"none" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(251,191,36,.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(251,191,36,.12)"; }}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* Step: confirm */}
        {!sending && step === "confirm" && (
          <>
            <div style={{ padding:"24px 28px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:14 }}>
              <button onClick={() => setStep("reason")} style={{ width:30, height:30, border:"1px solid var(--border2)", borderRadius:2, background:"transparent", color:"var(--muted)", cursor:"none", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>←</button>
              <div>
                <div style={{ fontSize:10, color:"var(--amber)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Step 2 of 2 · Confirm</div>
                <div className="serif" style={{ fontSize:22, fontWeight:500 }}>Review & Send</div>
              </div>
            </div>
            <div style={{ padding:"20px 28px" }}>
              <div style={{ padding:"14px", background:"rgba(251,191,36,.05)", border:"1px solid rgba(251,191,36,.2)", borderRadius:3, marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>⚡</span>
                <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.65 }}>
                  A notification email will be sent to <span style={{ color:"var(--text)", fontWeight:500 }}>{session.student}</span>. A full refund of <span style={{ color:"var(--gold-lt)", fontWeight:600 }}>₹{refund.toLocaleString("en-IN")}</span> will be automatically initiated to their original payment method.
                </div>
              </div>

              {[
                { label:"Student",    val:session.student },
                { label:"Session",    val:`${session.date} · ${session.time}` },
                { label:"Topic",      val:session.topic },
                { label:"Reason",     val:REASONS.find(r=>r.id===reason)?.label || reason, color:"var(--amber)" },
                { label:"Refund",     val:`₹${refund.toLocaleString("en-IN")} (100%)`, color:"var(--green)" },
              ].map((row,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<4?"1px solid var(--border)":"none" }}>
                  <span style={{ fontSize:12, color:"var(--muted)" }}>{row.label}</span>
                  <span style={{ fontSize:12, fontWeight:500, color:row.color||"var(--text)" }}>{row.val}</span>
                </div>
              ))}

              {note && (
                <div style={{ marginTop:14, padding:"10px 12px", background:"rgba(255,255,255,.03)", border:"1px solid var(--border)", borderRadius:2 }}>
                  <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:4 }}>Your note to student</div>
                  <div style={{ fontSize:13, color:"var(--muted)", fontStyle:"italic" }}>"{note}"</div>
                </div>
              )}

              <div style={{ display:"flex", gap:10, marginTop:20 }}>
                <button className="btn-o" onClick={() => setStep("reason")} style={{ flex:1, justifyContent:"center" }}>← Back</button>
                <button onClick={handleSend}
                  style={{ flex:1, display:"inline-flex", alignItems:"center", justifyContent:"center", background:"rgba(251,191,36,.12)", border:"1px solid rgba(251,191,36,.4)", borderRadius:1, padding:"10px 18px", fontFamily:"'Outfit',sans-serif", fontSize:11, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", cursor:"none", color:"var(--amber)", transition:"all .3s", gap:8 }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(251,191,36,.2)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(251,191,36,.12)"}>
                  📩 Notify & Refund Student
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, icon, color, started, delay = 0, isRupee = false }) {
  const num = useCountUp(value, 1300, started);
  return (
    <div className="g-card metric-card" style={{ padding:"28px 24px", flex:1, animation:`fadeUp .65s cubic-bezier(.22,1,.36,1) ${delay}s both` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase" }}>{label}</div>
        <span style={{ fontSize:22, opacity:.7 }}>{icon}</span>
      </div>
      <div className="serif" style={{ fontSize:48, fontWeight:400, letterSpacing:"-.03em", lineHeight:1, color: color || "var(--gold-lt)", marginBottom:6 }}>
        {isRupee ? "₹" : ""}{num.toLocaleString("en-IN")}
      </div>
      <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.5 }}>{sub}</div>
      <div style={{ marginTop:16, height:1, background:`linear-gradient(90deg,${color||"var(--gold-dk)"},transparent)` }}/>
    </div>
  );
}

// ─── Bar Chart (SVG, no deps) ──────────────────────────────────────────────
function EarningsChart({ started }) {
  const maxEarnings = Math.max(...MONTHLY_DATA.map(d => d.earnings));
  const W = 700, H = 200, PAD = { t:16, b:32, l:48, r:16 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;
  const barW = Math.floor(chartW / MONTHLY_DATA.length * 0.55);
  const gap  = chartW / MONTHLY_DATA.length;
  const [hovered, setHovered] = useState(null);
  const [revealPct, setRevealPct] = useState(0);

  useEffect(() => {
    if (!started) return;
    let s = null;
    const raf = ts => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / 900, 1);
      setRevealPct(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started]);

  // line path
  const points = MONTHLY_DATA.map((d, i) => {
    const x = PAD.l + gap * i + gap / 2;
    const y = PAD.t + chartH - (d.earnings / maxEarnings) * chartH * revealPct;
    return { x, y, d };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = points.length > 0
    ? `M ${points[0].x} ${PAD.t + chartH} ` + points.map(p => `L ${p.x} ${p.y}`).join(" ") + ` L ${points[points.length-1].x} ${PAD.t + chartH} Z`
    : "";

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PAD.t + chartH - t * chartH,
    label: "₹" + Math.round(maxEarnings * t / 1000) + "K"
  }));

  return (
    <div style={{ width:"100%", overflowX:"auto" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", minWidth:340, height:"auto", display:"block" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--gold)" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="var(--gold-dk)"/>
            <stop offset="100%" stopColor="var(--gold-lt)"/>
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={t.y} x2={W - PAD.r} y2={t.y} stroke="rgba(255,255,255,.05)" strokeWidth="1" strokeDasharray="4 4"/>
            <text x={PAD.l - 6} y={t.y + 4} textAnchor="end" fontSize="9" fill="rgba(122,117,112,.8)" fontFamily="Outfit">{t.label}</text>
          </g>
        ))}

        {/* Area */}
        {revealPct > 0 && <path d={areaPath} fill="url(#areaGrad)"/>}

        {/* Bars */}
        {MONTHLY_DATA.map((d, i) => {
          const x = PAD.l + gap * i + gap / 2 - barW / 2;
          const bH = (d.earnings / maxEarnings) * chartH * revealPct;
          const y  = PAD.t + chartH - bH;
          const isH = hovered === i;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={bH} rx="2"
                fill={isH ? "rgba(201,169,110,.3)" : "rgba(201,169,110,.12)"}
                stroke={isH ? "rgba(201,169,110,.6)" : "rgba(201,169,110,.2)"} strokeWidth="1"
                style={{ transition:"fill .2s, stroke .2s", cursor:"none" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}/>
              {isH && bH > 0 && (
                <g>
                  <rect x={x - 10} y={y - 30} width={barW + 20} height={22} rx="2" fill="rgba(26,22,18,.96)" stroke="rgba(201,169,110,.3)" strokeWidth="1"/>
                  <text x={x + barW/2} y={y - 14} textAnchor="middle" fontSize="10" fill="var(--gold-lt)" fontFamily="Outfit" fontWeight="500">₹{(d.earnings/1000).toFixed(1)}K</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Line */}
        {revealPct > 0 && (
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        )}

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hovered===i?5:3}
            fill={hovered===i?"var(--gold-lt)":"var(--gold)"} stroke="var(--bg)" strokeWidth="2"
            style={{ transition:"r .2s", cursor:"none" }}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}/>
        ))}

        {/* X labels */}
        {MONTHLY_DATA.map((d, i) => {
          const x = PAD.l + gap * i + gap / 2;
          return <text key={i} x={x} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(122,117,112,.8)" fontFamily="Outfit">{d.month}</text>;
        })}
      </svg>
    </div>
  );
}

// ─── Earnings Breakdown Card ──────────────────────────────────────────────────
function EarningsBreakdown({ started }) {
  const [ref, vis] = useInView();
  const barRef = useRef(null);

  useEffect(() => {
    if (!vis || !started || !barRef.current) return;
  
    barRef.current.style.setProperty("--w", "90%");
    barRef.current.style.animation =
      "barGrow .9s cubic-bezier(.22,1,.36,1) .2s both";
  }, [vis, started]);

  return (
    <div ref={ref} className="g-card" style={{ padding:"28px 24px", animation:"fadeUp .65s cubic-bezier(.22,1,.36,1) .3s both" }}>
      <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Per Session · Breakdown</div>
      <div className="serif" style={{ fontSize:20, fontWeight:500, marginBottom:24 }}>Earnings Split</div>

      {[
        { label:"Session Price",           val:PRICE_PER_SESSION,           pct:100,  color:"var(--text)"  },
        { label:"Platform Commission (10%)",val:PRICE_PER_SESSION*0.1,      pct:10,   color:"var(--red)"   },
        { label:"You Receive",             val:PRICE_PER_SESSION*0.9,       pct:90,   color:"var(--gold-lt)"},
      ].map((r, i) => (
        <div key={i} style={{ marginBottom: i < 2 ? 18 : 0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:13, color: i === 0 ? "var(--muted)" : i === 1 ? "var(--muted)" : "var(--text)", fontWeight: i===2?600:400 }}>{r.label}</span>
            <span className="serif" style={{ fontSize: i===2?22:18, fontWeight:i===2?500:400, color:r.color, letterSpacing:"-.01em" }}>₹{r.val.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ height:i===2?6:4, background:"rgba(255,255,255,.05)", borderRadius:3, overflow:"hidden" }}>
            <div ref={i===2?barRef:null} style={{ height:"100%", width: vis ? `${r.pct}%` : "0%", background: i===0?"rgba(255,255,255,.15)":i===1?"rgba(248,113,113,.4)":"linear-gradient(90deg,var(--gold-dk),var(--gold-lt))", borderRadius:3, transition: i!==2 ? `width .8s cubic-bezier(.22,1,.36,1) ${i*0.15+0.1}s` : "none" }}/>
          </div>
          {i < 2 && <div style={{ height:1, background:"var(--border)", margin:"18px 0 0" }}/>}
        </div>
      ))}

      <div style={{ marginTop:20, padding:"12px 14px", background:"rgba(201,169,110,.04)", border:"1px solid rgba(201,169,110,.15)", borderRadius:3, display:"flex", alignItems:"center", gap:8 }}>
        <span style={{ fontSize:14 }}>💡</span>
        <span style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>You keep <span style={{ color:"var(--gold-lt)", fontWeight:600 }}>90%</span> of every session — best payout rate in the industry.</span>
      </div>
    </div>
  );
}

// ─── Sessions Table ───────────────────────────────────────────────────────────
function SessionsTable({ sessions, onNotify, filter, setFilter }) {
  const [ref, vis] = useInView();
  const STATUS_FILTERS = ["All", "Confirmed", "Completed", "Cancelled"];
  const displayed = filter === "All" ? sessions : sessions.filter(s => s.status === filter.toLowerCase());

  const statusBadge = s => {
    const map = { confirmed:"badge-green", completed:"badge-gold", cancelled:"badge-red" };
    return <span className={`badge ${map[s]||"badge-muted"}`}>{s}</span>;
  };

  return (
    <div ref={ref} className="g-card" style={{ animation:"fadeUp .65s cubic-bezier(.22,1,.36,1) .15s both" }}>
      <div style={{ padding:"24px 24px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Schedule</div>
          <div className="serif" style={{ fontSize:20, fontWeight:500 }}>Sessions</div>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:"5px 14px", border:`1px solid ${filter===f?"var(--gold-dk)":"var(--border2)"}`, borderRadius:2, background:filter===f?"rgba(201,169,110,.1)":"transparent", color:filter===f?"var(--gold)":"var(--muted)", cursor:"none", fontSize:11, fontFamily:"'Outfit',sans-serif", letterSpacing:".06em", fontWeight:filter===f?500:400, transition:"all .25s" }}
              onMouseEnter={e => { if(filter!==f) e.currentTarget.style.borderColor="rgba(201,169,110,.3)"; }}
              onMouseLeave={e => { if(filter!==f) e.currentTarget.style.borderColor="var(--border2)"; }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX:"auto" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Student</th>
              <th>Topic</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th style={{ textAlign:"right" }}>Amount</th>
              <th style={{ textAlign:"center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign:"center", padding:"40px", color:"var(--muted2)", fontSize:13 }}>No sessions found.</td></tr>
            )}
            {displayed.map((s, i) => (
              <tr key={s.id} style={{ animation: vis ? `fadeUp .5s cubic-bezier(.22,1,.36,1) ${i*0.04}s both` : "none" }}>
                <td>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div className="avatar" style={{ width:32, height:32, background: AVATAR_COLORS[s.avatar]||"var(--gold-dk)", fontSize:11 }}>{s.avatar}</div>
                    <span style={{ fontWeight:500, fontSize:13 }}>{s.student}</span>
                  </div>
                </td>
                <td style={{ color:"var(--muted)", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.topic}</td>
                <td>
                  <div style={{ fontSize:13 }}>{s.date}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{s.time}</div>
                </td>
                <td>{statusBadge(s.status)}</td>
                <td style={{ textAlign:"right" }}>
                  <div className="serif" style={{ fontSize:16, color:s.status==="cancelled"?"var(--muted)":"var(--gold-lt)" }}>
                    {s.status==="cancelled" ? <span style={{ textDecoration:"line-through" }}>₹{s.amount.toLocaleString("en-IN")}</span> : `₹${s.amount.toLocaleString("en-IN")}`}
                  </div>
                  {s.status !== "cancelled" && <div style={{ fontSize:10, color:"var(--green)", marginTop:1 }}>+₹{(s.amount*0.9).toLocaleString("en-IN")} net</div>}
                </td>
                <td style={{ textAlign:"center" }}>
                  {s.status === "confirmed" ? (
                    <button className="btn-red" style={{ padding:"5px 12px", fontSize:10, whiteSpace:"nowrap" }} onClick={() => onNotify(s)}>
                      Mark Unavailable
                    </button>
                  ) : (
                    <span style={{ fontSize:11, color:"var(--muted2)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Availability Toggle ──────────────────────────────────────────────────────
function AvailabilityToggle({ available, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:"rgba(255,255,255,.03)", border:`1px solid ${available?"rgba(74,222,128,.25)":"var(--border2)"}`, borderRadius:3, transition:"border-color .3s" }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:available?"var(--green)":"var(--muted)", boxShadow:available?"0 0 10px var(--green)":"none", transition:"all .3s", flexShrink:0 }}/>
      <span style={{ fontSize:12, color:available?"var(--text)":"var(--muted)", fontWeight:available?500:400, letterSpacing:".03em", flex:1 }}>
        {available ? "Accepting new bookings" : "Not accepting bookings"}
      </span>
      <label className="toggle">
        <input type="checkbox" checked={available} onChange={e => onChange(e.target.checked)}/>
        <div className="toggle-track"/>
        <div className="toggle-thumb"/>
      </label>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [sessions,    setSessions]    = useState(INITIAL_SESSIONS);
  const [notify,      setNotify]      = useState(null);
  const [toast,       setToast]       = useState(null);
  const [statsVis,    setStatsVis]    = useState(false);
  const [chartVis,    setChartVis]    = useState(false);
  const [navVis,      setNavVis]      = useState(false);
  const [available,   setAvailable]   = useState(true);
  const [filter,      setFilter]      = useState("All");

  const statsRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => { setTimeout(() => setNavVis(true), 80); }, []);

  useEffect(() => {
    const obsStats = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold:0.2 });
    const obsChart = new IntersectionObserver(([e]) => { if (e.isIntersecting) setChartVis(true); }, { threshold:0.15 });
    if (statsRef.current) obsStats.observe(statsRef.current);
    if (chartRef.current) obsChart.observe(chartRef.current);
    return () => { obsStats.disconnect(); obsChart.disconnect(); };
  }, []);

  // Derived metrics
  const completedSessions   = sessions.filter(s => s.status === "completed");
  const confirmedSessions   = sessions.filter(s => s.status === "confirmed");
  const totalSessions       = completedSessions.length + confirmedSessions.length;
  const grossEarnings       = completedSessions.reduce((a, s) => a + s.amount, 0);
  const netEarnings         = Math.round(grossEarnings * 0.9);
  const commissionPaid      = Math.round(grossEarnings * 0.1);

  const handleNotifyConfirm = (sessionId) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status:"cancelled" } : s));
    setToast({ icon:"📩", title:"Student Notified", body:"Full refund has been initiated to the student.", green:true });
    setNotify(null);
  };

  const handleAvailability = (val) => {
    setAvailable(val);
    setToast({
      icon: val ? "✅" : "⏸",
      title: val ? "Now Accepting Bookings" : "Bookings Paused",
      body:  val ? "Students can book sessions with you." : "New bookings are temporarily disabled.",
    });
    if (!val) emit("mentora:mentor_availability", { mentorName: MENTOR.name, available: false });
    else      emit("mentora:mentor_availability", { mentorName: MENTOR.name, available: true });
  };

  // Upcoming = confirmed only
  const upcomingSessions = sessions.filter(s => s.status === "confirmed").slice(0, 5);

  return (
    <>
      <style>{STYLES}</style>
      <Cursor/>

      {/* ── NAV ── */}
      <nav className="nav-wrap" style={{ opacity: navVis ? 1 : 0, transition: "opacity .6s ease" }}>
        <div className="nav-in">
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, border:"1px solid var(--gold-dk)", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(201,169,110,.08)" }}>
              <span className="serif" style={{ color:"var(--gold)", fontSize:16, fontWeight:500, lineHeight:1 }}>M</span>
            </div>
            <span className="serif" style={{ fontSize:18, fontWeight:500, letterSpacing:".06em", color:"var(--text)" }}>MENTORA</span>
          </div>

          {/* Center title */}
          <div style={{ flex:1, textAlign:"center" }} className="hide-mob">
            <span style={{ fontSize:12, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase" }}>Mentor Dashboard</span>
          </div>

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginLeft:"auto" }}>
            <AvailabilityToggle available={available} onChange={handleAvailability}/>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ textAlign:"right" }} className="hide-mob">
                <div style={{ fontSize:13, fontWeight:500 }}>{MENTOR.name}</div>
                <div style={{ fontSize:11, color:"var(--gold)", marginTop:1 }}>★ {MENTOR.rating}</div>
              </div>
              <div className="avatar" style={{ width:36, height:36, background:MENTOR.gradient, fontSize:13 }}>{MENTOR.initials}</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <div className="page">
        <div className="orb" style={{ width:500, height:500, background:"radial-gradient(circle,rgba(201,169,110,.05),transparent 70%)", top:-80, right:-100 }}/>

        {/* ── HEADER ── */}
        <div style={{ marginBottom:40, animation:"fadeUp .7s cubic-bezier(.22,1,.36,1) .1s both" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
            <div>
              <span className="tag-pill" style={{ marginBottom:14, display:"inline-flex" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--gold)" }}/>
                Mentor Portal
              </span>
              <h1 className="serif" style={{ fontSize:"clamp(30px,4vw,48px)", fontWeight:400, letterSpacing:"-.02em", lineHeight:1.1, marginTop:4 }}>
                Welcome back, <span className="gold-text" style={{ fontStyle:"italic" }}>{MENTOR.name.split(" ")[0]}</span>
              </h1>
              <p style={{ fontSize:14, color:"var(--muted)", marginTop:10, fontWeight:300 }}>
                {MENTOR.title} · {MENTOR.expertise}
              </p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <div style={{ padding:"8px 16px", background:"rgba(74,222,128,.07)", border:"1px solid rgba(74,222,128,.2)", borderRadius:2, display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 8px var(--green)" }}/>
                <span style={{ fontSize:11, color:"var(--green)", letterSpacing:".06em" }}>{confirmedSessions.length} upcoming</span>
              </div>
              <div style={{ padding:"8px 16px", background:"rgba(201,169,110,.07)", border:"1px solid rgba(201,169,110,.2)", borderRadius:2, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:11, color:"var(--gold)", letterSpacing:".06em" }}>★ {MENTOR.rating} ({MENTOR.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── METRIC CARDS ── */}
        <div ref={statsRef} style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }} className="grid-3">
          <MetricCard label="Total Sessions"        value={totalSessions}   sub={`${confirmedSessions.length} upcoming · ${completedSessions.length} completed`} icon="🎯" color="var(--text)"    started={statsVis} delay={0}   />
          <MetricCard label="Gross Earnings"         value={grossEarnings}   sub="From completed sessions"               icon="📊" color="var(--gold-lt)" started={statsVis} delay={0.1} isRupee />
          <MetricCard label="Platform Commission"    value={commissionPaid}  sub="10% deducted by Mentora"               icon="⚙️" color="var(--muted)"    started={statsVis} delay={0.2} isRupee />
        </div>

        {/* ── NET EARNINGS HIGHLIGHT ── */}
        <div className="g-card" style={{ padding:"20px 24px", marginBottom:32, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16, animation:"fadeUp .65s cubic-bezier(.22,1,.36,1) .25s both", borderColor:"rgba(201,169,110,.15)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, border:"1px solid rgba(201,169,110,.3)", borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(201,169,110,.08)", fontSize:20 }}>💰</div>
            <div>
              <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Your Net Earnings (after 10% commission)</div>
              <div className="serif" style={{ fontSize:36, fontWeight:400, letterSpacing:"-.03em", lineHeight:1 }}>
                <span className="gold-text">₹{netEarnings.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ textAlign:"center", padding:"12px 20px", background:"rgba(255,255,255,.03)", border:"1px solid var(--border)", borderRadius:3 }}>
              <div style={{ fontSize:11, color:"var(--muted)", marginBottom:4 }}>Avg per session</div>
              <div className="serif" style={{ fontSize:20, color:"var(--gold-lt)" }}>₹{(PRICE_PER_SESSION*0.9).toLocaleString("en-IN")}</div>
            </div>
            <div style={{ textAlign:"center", padding:"12px 20px", background:"rgba(255,255,255,.03)", border:"1px solid var(--border)", borderRadius:3 }}>
              <div style={{ fontSize:11, color:"var(--muted)", marginBottom:4 }}>Payout rate</div>
              <div className="serif" style={{ fontSize:20, color:"var(--green)" }}>90%</div>
            </div>
          </div>
        </div>

        {/* ── SESSIONS TABLE ── */}
        <div style={{ marginBottom:32 }}>
          <SessionsTable sessions={sessions} onNotify={setNotify} filter={filter} setFilter={setFilter}/>
        </div>

        {/* ── BOTTOM GRID: breakdown + chart ── */}
        <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:20, marginBottom:32 }} className="grid-2">
          <EarningsBreakdown started={statsVis}/>

          {/* Chart */}
          <div ref={chartRef} className="g-card" style={{ padding:"28px 24px", animation:"fadeUp .65s cubic-bezier(.22,1,.36,1) .35s both" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
              <div>
                <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Trends</div>
                <div className="serif" style={{ fontSize:20, fontWeight:500 }}>Monthly Earnings</div>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                {[
                  { color:"var(--gold)", label:"Net earnings" },
                  { color:"rgba(201,169,110,.25)", label:"Session count" },
                ].map((l,i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:20, height:2, background:l.color, borderRadius:1, display:"inline-block" }}/>
                    <span style={{ fontSize:10, color:"var(--muted)", letterSpacing:".05em" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <EarningsChart started={chartVis}/>
            <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", padding:"12px 0", borderTop:"1px solid var(--border)" }}>
              {[
                { label:"Best month", val:"July · ₹9,720" },
                { label:"Avg monthly", val:"₹" + Math.round(MONTHLY_DATA.reduce((a,d)=>a+d.earnings,0)/MONTHLY_DATA.length).toLocaleString("en-IN") },
                { label:"Total YTD",   val:"₹" + MONTHLY_DATA.reduce((a,d)=>a+d.earnings,0).toLocaleString("en-IN") },
              ].map((s,i) => (
                <div key={i} style={{ textAlign:i===1?"center":i===2?"right":"left" }}>
                  <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".07em", textTransform:"uppercase", marginBottom:4 }}>{s.label}</div>
                  <div className="serif" style={{ fontSize:16, color:"var(--gold-lt)" }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── UPCOMING MINI ── */}
        <div className="g-card" style={{ padding:"24px", animation:"fadeUp .65s cubic-bezier(.22,1,.36,1) .4s both" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ fontSize:10, color:"var(--muted)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Next Up</div>
              <div className="serif" style={{ fontSize:18, fontWeight:500 }}>Upcoming Sessions</div>
            </div>
            <span className="badge badge-green" style={{ fontSize:11 }}>{upcomingSessions.length} confirmed</span>
          </div>
          {upcomingSessions.length === 0 ? (
            <div style={{ textAlign:"center", padding:"32px", color:"var(--muted2)", fontSize:13 }}>No upcoming sessions scheduled.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {upcomingSessions.map((s, i) => (
                <div key={s.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px", background:"rgba(255,255,255,.03)", border:"1px solid var(--border)", borderRadius:3, transition:"all .25s", animation:`fadeUp .5s cubic-bezier(.22,1,.36,1) ${i*0.06+0.4}s both` }}
                  onMouseEnter={e => e.currentTarget.style.borderColor="var(--border2)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                  <div className="avatar" style={{ width:36, height:36, background: AVATAR_COLORS[s.avatar]||"var(--gold-dk)", fontSize:12 }}>{s.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500, marginBottom:2 }}>{s.student}</div>
                    <div style={{ fontSize:11, color:"var(--muted)" }}>{s.topic}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:12, color:"var(--text)", fontWeight:500 }}>{s.date}</div>
                    <div style={{ fontSize:11, color:"var(--gold)" }}>{s.time}</div>
                  </div>
                  <button className="btn-red" style={{ padding:"5px 12px", fontSize:10, whiteSpace:"nowrap" }} onClick={() => setNotify(s)}>
                    Unavailable
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── UNAVAILABILITY MODAL ── */}
      {notify && (
        <UnavailableModal
          session={notify}
          onConfirm={handleNotifyConfirm}
          onClose={() => setNotify(null)}
        />
      )}

      {/* ── TOAST ── */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)}/>}
    </>
  );
}