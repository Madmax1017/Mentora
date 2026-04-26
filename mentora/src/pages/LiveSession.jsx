import { useState, useEffect, useRef, useCallback,useMemo, } from "react";
import { useNavigate } from "react-router-dom";

// ─── DESIGN SYSTEM ─────────────────────────────────────────────────────────────
// Philosophy: "Readable Luxury" — dark slate (not pure black), warm ivory text,
// gold for hierarchy signals. High contrast for text (WCAG AA+), subtle
// gold for decorative elements. Think Notion meets a private members' club.
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  /* Slate base — easier on eyes than pure black */
  --bg:      #111318;
  --bg1:     #181B22;
  --bg2:     #1E222C;
  --bg3:     #252A36;
  --bg4:     #2D3340;

  /* Borders */
  --bo:      rgba(255,255,255,.07);
  --bo2:     rgba(255,255,255,.12);
  --bo3:     rgba(255,255,255,.20);

  /* Gold — warmer, more readable */
  --gold:    #C8A45A;
  --glt:     #E8CC90;
  --gdk:     #8C6E32;
  --gxs:     rgba(200,164,90,.10);

  /* Text — ivory, never pure white (reduces eye strain) */
  --tx:      #EAE6DE;
  --tx2:     #B8B3A8;
  --tx3:     #807A72;
  --tx4:     #4A4840;

  /* Semantic */
  --gr:      #3ECE82;
  --gr2:     rgba(62,206,130,.12);
  --re:      #E07070;
  --re2:     rgba(224,112,112,.10);
  --bl:      #78AEDD;

  /* Shadows */
  --sh1: 0 2px 8px rgba(0,0,0,.4);
  --sh2: 0 8px 32px rgba(0,0,0,.55);
  --sh3: 0 24px 72px rgba(0,0,0,.7);
}

html, body, #root { height: 100%; }
body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg);
  color: var(--tx);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  line-height: 1.5;
  cursor: none;
}
::selection { background: rgba(200,164,90,.25); color: var(--tx); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg1); }
::-webkit-scrollbar-thumb { background: var(--gdk); border-radius: 4px; }

/* Fonts */
.pf { font-family: 'Playfair Display', serif; }
.mo { font-family: 'DM Mono', monospace; }

/* Custom cursor */
#_cur  { position:fixed; top:0; left:0; z-index:9999; pointer-events:none; width:8px; height:8px; border-radius:50%; background:var(--gold); transform:translate(-50%,-50%); }
#_curR { position:fixed; top:0; left:0; z-index:9998; pointer-events:none; width:32px; height:32px; border-radius:50%; border:1.5px solid rgba(200,164,90,.4); transform:translate(-50%,-50%); transition:transform .12s cubic-bezier(.22,1,.36,1); }

/* Gold text gradient */
.gt { background: linear-gradient(135deg, var(--glt) 0%, var(--gold) 55%, var(--gdk) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

/* Live pulse */
@keyframes livePulse { 0%{box-shadow:0 0 0 0 rgba(62,206,130,.55)} 70%{box-shadow:0 0 0 8px rgba(62,206,130,0)} 100%{box-shadow:0 0 0 0 rgba(62,206,130,0)} }
.live-dot { width:8px; height:8px; border-radius:50%; background:var(--gr); animation:livePulse 2s ease-in-out infinite; flex-shrink:0; }

/* Glow ring on video */
@keyframes glowRing { 0%,100%{opacity:.18} 50%{opacity:.45} }

/* Audio wave */
@keyframes waveBar { 0%,100%{transform:scaleY(.25)} 50%{transform:scaleY(1)} }

/* Page transitions */
@keyframes slideUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
@keyframes fadeIn     { from{opacity:0} to{opacity:1} }
@keyframes pageExit   { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(.97)} }
@keyframes pageEnter  { from{opacity:0;transform:scale(1.03) translateY(20px)} to{opacity:1;transform:none} }
@keyframes msgSlide   { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:none} }
@keyframes starPop    { 0%{transform:scale(1)} 40%{transform:scale(1.35)} 70%{transform:scale(.9)} 100%{transform:scale(1)} }
@keyframes confetti   { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(120px) rotate(720deg);opacity:0} }
@keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }

/* Buttons */
.btn-gold {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  background: linear-gradient(135deg, var(--glt), var(--gold));
  color: #1A1400; font-family:'DM Sans',sans-serif;
  font-size:13px; font-weight:600; letter-spacing:.04em;
  border:none; border-radius:6px; padding:11px 24px;
  cursor:none; transition:all .25s cubic-bezier(.22,1,.36,1);
  position:relative; overflow:hidden;
}
.btn-gold::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,.15); transform:translateX(-110%) skewX(-15deg); transition:transform .45s cubic-bezier(.22,1,.36,1); }
.btn-gold:hover::after { transform:translateX(110%) skewX(-15deg); }
.btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(200,164,90,.3); }

.btn-ghost {
  display:inline-flex; align-items:center; gap:6px;
  background:transparent; color:var(--tx3);
  border:1px solid var(--bo2); border-radius:6px;
  padding:10px 20px; font-family:'DM Sans',sans-serif;
  font-size:13px; cursor:none; transition:all .2s;
}
.btn-ghost:hover { border-color:var(--bo3); color:var(--tx2); }

.btn-danger {
  display:inline-flex; align-items:center; gap:7px;
  background:rgba(224,112,112,.08); color:var(--re);
  border:1px solid rgba(224,112,112,.22); border-radius:6px;
  padding:9px 18px; font-family:'DM Sans',sans-serif;
  font-size:12px; font-weight:500; cursor:none; transition:all .2s; letter-spacing:.02em;
}
.btn-danger:hover { background:rgba(224,112,112,.16); border-color:rgba(224,112,112,.4); }

/* Card base */
.card {
  background: var(--bg2);
  border: 1px solid var(--bo);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  transition: border-color .3s;
}

/* Chat input */
.chat-input {
  background: rgba(255,255,255,.05);
  border: 1px solid var(--bo2);
  border-radius: 6px;
  color: var(--tx);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; padding: 10px 14px;
  outline: none; width: 100%;
  transition: border-color .2s, background .2s;
}
.chat-input::placeholder { color: var(--tx4); }
.chat-input:focus { border-color: rgba(200,164,90,.4); background: rgba(200,164,90,.04); }

/* Notes textarea */
.notes-ta {
  background: transparent;
  border: none; outline: none; resize: none;
  color: var(--tx2); font-family: 'DM Sans', sans-serif;
  font-size: 14px; line-height: 1.8; width: 100%;
  min-height: 110px; letter-spacing: .01em;
}
.notes-ta::placeholder { color: var(--tx4); }

/* Star */
.star { font-size:32px; cursor:none; transition:transform .18s, filter .18s; display:inline-block; line-height:1; }
.star.lit  { filter:drop-shadow(0 0 8px rgba(200,164,90,.6)); }
.star:hover { transform:scale(1.2); }
.star.popped { animation:starPop .35s cubic-bezier(.22,1,.36,1); }

/* Modal overlay */
.modal-ov {
  position:fixed; inset:0; z-index:600;
  background:rgba(10,12,18,.85);
  backdrop-filter:blur(20px) saturate(1.5);
  display:flex; align-items:center; justify-content:center;
  padding:24px; animation:fadeIn .3s ease;
}
.modal-box {
  background: linear-gradient(160deg, var(--bg2), var(--bg1));
  border: 1px solid rgba(200,164,90,.22);
  border-radius: 14px; width:100%; max-width:560px;
  max-height:92vh; overflow-y:auto;
  box-shadow: var(--sh3), inset 0 1px 0 rgba(200,164,90,.12);
  animation: slideUp .45s cubic-bezier(.22,1,.36,1);
}
.modal-box::-webkit-scrollbar { width:3px; }
.modal-box::-webkit-scrollbar-thumb { background:var(--gdk); border-radius:3px; }

/* Session exiting */
.page-exit { animation: pageExit .5s cubic-bezier(.22,1,.36,1) forwards; }
.page-enter { animation: pageEnter .65s cubic-bezier(.22,1,.36,1) forwards; }

/* Post-session page */
.post-bg {
  min-height:100vh;
  background: radial-gradient(ellipse at 20% 0%, rgba(200,164,90,.06) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 80%, rgba(62,206,130,.04) 0%, transparent 50%),
              var(--bg);
}

/* Shimmer text */
.shimmer-text {
  background: linear-gradient(90deg, var(--gold), var(--glt), var(--gold), var(--gdk), var(--gold));
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

/* Confetti piece */
.confetti-piece {
  position: absolute;
  width: 8px; height: 8px;
  border-radius: 2px;
  animation: confetti 1.2s ease-out forwards;
}

/* Responsive */
@media (max-width: 900px) {
  .session-row { flex-direction: column !important; }
  .chat-col { width: 100% !important; height: 360px !important; }
  .video-col { width: 100% !important; }
}
@media (max-width: 600px) {
  .hide-sm { display: none !important; }
  .hdr-topic { display: none !important; }
}
`;

// ─── HOOKS ─────────────────────────────────────────────────────────────────────
function useTimer(running) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setS(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const fmt = n => `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
  return [s, fmt(s)];
}

function useCursor() {
  const dot = useRef(null), ring = useRef(null);
  const m = useRef({x:0,y:0}), l = useRef({x:0,y:0});
  useEffect(() => {
    const mv = e => { m.current = {x:e.clientX,y:e.clientY}; };
    document.addEventListener('mousemove', mv);
    let raf;
    const loop = () => {
      l.current.x += (m.current.x - l.current.x) * .1;
      l.current.y += (m.current.y - l.current.y) * .1;
      if (dot.current)  dot.current.style.transform  = `translate(${m.current.x}px,${m.current.y}px) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate(${l.current.x}px,${l.current.y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener('mousemove',mv); cancelAnimationFrame(raf); };
  }, []);
  return { dot, ring };
}

// ─── INITIAL MESSAGES ──────────────────────────────────────────────────────────
const INIT_MSGS = [
  { id:1, from:'mentor', text:"Welcome! I've reviewed your portfolio ahead of today's session. Overall strong work — let's sharpen the narrative.", ts:'00:08' },
  { id:2, from:'student', text:"Thank you! I felt the case studies were a bit process-heavy. Should I lead with outcomes instead?", ts:'00:42' },
  { id:3, from:'mentor', text:"Exactly right. Hiring managers scan fast — impact first, then process. Let's restructure your onboarding case study together.", ts:'01:18' },
  { id:4, from:'student', text:"That makes sense. How specific should the metrics be if I don't have exact data?", ts:'02:05' },
  { id:5, from:'mentor', text:"Reasonable estimates with a clear methodology are fine. Frame it as 'estimated X% improvement based on Y'. Credibility comes from the reasoning.", ts:'02:51' },
];

const MENTOR = { name:'Shriya Rao', title:'Senior Product Designer · Figma', initials:'SR' };

// ─── CURSOR ────────────────────────────────────────────────────────────────────
function Cursor() {
  const { dot, ring } = useCursor();
  return <><div id="_cur" ref={dot}/><div id="_curR" ref={ring}/></>;
}

// ─── AUDIO WAVE ────────────────────────────────────────────────────────────────
function AudioWave({ active }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:2, height:18 }}>
      {[.3,.7,1,.5,.85,.4,.9,.6,.3,.75,.55,1].map((h,i) => (
        <div key={i} style={{
          width:2.5, height:`${h*100}%`, borderRadius:2,
          background: active ? 'var(--gr)' : 'var(--bg4)',
          transformOrigin:'bottom',
          animation: active ? `waveBar ${.4+i*.07}s ease-in-out infinite alternate` : 'none',
          animationDelay:`${i*.055}s`,
          transition:'background .3s',
        }}/>
      ))}
    </div>
  );
}

// ─── VIDEO PANEL ───────────────────────────────────────────────────────────────
function VideoPanel({ micOn, camOn, onMic, onCam, sessionEnded }) {
  return (
    <div className="video-col card" style={{
      flex:'0 0 69%', aspectRatio:'16/9',
      background:'linear-gradient(140deg,#0E1118 0%,#181B22 50%,#0C0F15 100%)',
      borderRadius:12, position:'relative', overflow:'hidden',
      border:'1px solid rgba(200,164,90,.12)',
      animation:'slideUp .55s cubic-bezier(.22,1,.36,1) .05s both',
    }}>
      {/* Grid overlay */}
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(200,164,90,.018) 1px, transparent 1px), linear-gradient(90deg,rgba(200,164,90,.018) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none' }}/>

      {/* Glow rings */}
      {[200,270,340].map((size,i) => (
        <div key={i} style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:size, height:size, borderRadius:'50%', border:'1px solid rgba(200,164,90,.12)', animation:'glowRing 3.5s ease-in-out infinite', animationDelay:`${i*.8}s`, pointerEvents:'none' }}/>
      ))}

      {/* Centre content */}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
        <div style={{
          width:100, height:100, borderRadius:'50%',
          background:'linear-gradient(135deg,#4A3872,#8A68C4)',
          border:'2px solid rgba(200,164,90,.45)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 48px rgba(200,164,90,.14), 0 0 100px rgba(200,164,90,.06)',
          fontFamily:'Playfair Display,serif', fontSize:34, fontWeight:500, color:'#EAE6DE',
        }}>{MENTOR.initials}</div>
        <div style={{ textAlign:'center' }}>
          <div className="pf" style={{ fontSize:20, fontWeight:500, letterSpacing:'-.01em', color:'var(--tx)' }}>{MENTOR.name}</div>
          <div style={{ fontSize:12, color:'var(--tx3)', marginTop:3, letterSpacing:'.02em' }}>{MENTOR.title}</div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 16px', background:'rgba(62,206,130,.08)', border:'1px solid rgba(62,206,130,.22)', borderRadius:20 }}>
          <span className="live-dot"/>
          <span style={{ fontSize:11, color:'var(--gr)', fontWeight:500, letterSpacing:'.06em' }}>
            {sessionEnded ? 'Session Ended' : 'Live Video Stream — Connected'}
          </span>
        </div>
      </div>

      {/* Signal indicator */}
      <div style={{ position:'absolute', top:14, right:14, display:'flex', alignItems:'flex-end', gap:2 }}>
        {[.4,.6,.8,1].map((h,i) => <div key={i} style={{ width:3, height:`${h*14}px`, background:'var(--gr)', borderRadius:1, opacity:.75 }}/>)}
        <span className="mo" style={{ fontSize:9, color:'var(--gr)', marginLeft:5, letterSpacing:'.04em', opacity:.8 }}>HD</span>
      </div>

      {/* Student PiP */}
      <div style={{ position:'absolute', bottom:58, right:14, width:110, height:74, borderRadius:8, background:'linear-gradient(135deg,#1A1E28,#0E1118)', border:'1px solid rgba(200,164,90,.18)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5 }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#2A5A3A,#4A9A6A)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:13, color:'var(--tx)' }}>Y</div>
        <span style={{ fontSize:9, color:'var(--tx3)' }}>You</span>
      </div>

      {/* Controls */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 16px', background:'linear-gradient(to top, rgba(10,12,18,.95), transparent)', display:'flex', alignItems:'center', gap:10 }}>
        <AudioWave active={micOn}/>
        <div style={{ flex:1 }}/>
        {[
          { icon: micOn ? '🎙' : '🔇', active:micOn, fn:onMic, label:'Mic' },
          { icon: camOn ? '📹' : '🚫', active:camOn, fn:onCam, label:'Cam' },
          { icon:'🖥', active:true, fn:()=>{}, label:'Share' },
        ].map((b,i) => (
          <button key={i} onClick={b.fn} style={{ width:36, height:36, borderRadius:'50%', background:b.active?'rgba(62,206,130,.1)':'rgba(224,112,112,.1)', border:`1px solid ${b.active?'rgba(62,206,130,.28)':'rgba(224,112,112,.28)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'none', fontSize:15, transition:'all .2s' }}>{b.icon}</button>
        ))}
      </div>
    </div>
  );
}

// ─── CHAT PANEL ────────────────────────────────────────────────────────────────
function ChatPanel({ messages, onSend, timerDisplay }) {
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = () => {
    const txt = input.trim();
    if (!txt) return;
    onSend(txt, timerDisplay);
    setInput('');
  };

  return (
    <div className="chat-col card" style={{ flex:'0 0 29%', display:'flex', flexDirection:'column', borderRadius:12, animation:'slideUp .55s cubic-bezier(.22,1,.36,1) .12s both' }}>
      {/* Header */}
      <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--bo)', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <span className="live-dot" style={{ width:6, height:6 }}/>
        <span style={{ fontSize:11, color:'var(--tx3)', letterSpacing:'.08em', textTransform:'uppercase', fontWeight:500 }}>Session Chat</span>
        <span style={{ marginLeft:'auto', fontSize:11, color:'var(--tx4)' }} className="mo">{messages.length}</span>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 14px', display:'flex', flexDirection:'column', gap:12 }}>
        {messages.map((msg, i) => {
          const isMe = msg.from === 'student';
          return (
            <div key={msg.id} style={{ display:'flex', flexDirection:'column', alignItems:isMe?'flex-end':'flex-start', animation:i>=messages.length-1?'msgSlide .3s cubic-bezier(.22,1,.36,1)':'none' }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, flexDirection:isMe?'row-reverse':'row' }}>
                <div style={{ width:18, height:18, borderRadius:'50%', background:isMe?'linear-gradient(135deg,#2A5A3A,#4A9A6A)':'linear-gradient(135deg,#4A3872,#8A68C4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:7, color:'var(--tx)', flexShrink:0 }}>
                  {isMe?'Y':'SR'}
                </div>
                <span style={{ fontSize:10, color:'var(--tx3)' }}>{isMe?'You':MENTOR.name}</span>
                <span className="mo" style={{ fontSize:9, color:'var(--tx4)' }}>{msg.ts}</span>
              </div>
              <div style={{ maxWidth:'90%', padding:'9px 13px', background:isMe?'rgba(200,164,90,.1)':'rgba(255,255,255,.045)', border:`1px solid ${isMe?'rgba(200,164,90,.2)':'var(--bo)'}`, borderRadius:isMe?'10px 3px 10px 10px':'3px 10px 10px 10px', fontSize:13, color:isMe?'var(--tx)':'var(--tx2)', lineHeight:1.65 }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{ padding:'12px', borderTop:'1px solid var(--bo)', display:'flex', gap:8, flexShrink:0 }}>
        <input className="chat-input" placeholder="Type a message…" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
        <button onClick={send} style={{ width:36, height:36, borderRadius:6, flexShrink:0, background:input.trim()?'linear-gradient(135deg,var(--glt),var(--gold))':'var(--bg3)', border:'none', cursor:'none', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:input.trim()?'#1A1400':'var(--tx4)', transition:'all .2s' }}>↑</button>
      </div>
    </div>
  );
}

// ─── NOTES PANEL ───────────────────────────────────────────────────────────────
function NotesPanel() {
  const [notes, setNotes] = useState('• Improve portfolio storytelling — lead with impact metrics, not process steps\n• Restructure case studies: Problem → Impact → Solution → How\n• Apply to 3 mid-size startups this week: Razorpay, Zepto, CRED\n• Add quantified outcomes to onboarding redesign project\n• Schedule portfolio review before next session');
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ animation:'slideUp .55s cubic-bezier(.22,1,.36,1) .22s both' }}>
      <div className="card" style={{ borderRadius:10, border:`1px solid ${focus?'rgba(200,164,90,.32)':'var(--bo)'}`, boxShadow:focus?'0 0 0 3px rgba(200,164,90,.07)':'none', transition:'border-color .25s, box-shadow .25s' }}>
        {/* Header */}
        <div style={{ padding:'13px 18px', borderBottom:`1px solid ${focus?'rgba(200,164,90,.15)':'var(--bo)'}`, display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.015)', transition:'border-color .25s' }}>
          <span style={{ fontSize:14, opacity:.65 }}>📝</span>
          <span className="pf" style={{ fontSize:16, fontWeight:500, letterSpacing:'-.01em' }}>Session Notes</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--gr)' }}/>
            <span className="mo" style={{ fontSize:10, color:'var(--tx3)' }}>Auto-saved</span>
          </div>
        </div>
        {/* Area */}
        <div style={{ padding:'14px 18px' }}>
          <textarea className="notes-ta" value={notes} onChange={e=>setNotes(e.target.value)} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} placeholder="Add notes, action items, key insights…"/>
        </div>
        {/* Footer */}
        <div style={{ padding:'9px 18px', borderTop:'1px solid var(--bo)', display:'flex', gap:14, background:'rgba(255,255,255,.01)' }}>
          <span style={{ fontSize:11, color:'var(--tx4)' }}>{notes.split('\n').filter(Boolean).length} items</span>
          <span style={{ fontSize:11, color:'var(--tx4)' }}>·</span>
          <span style={{ fontSize:11, color:'var(--tx4)' }}>{notes.length} chars</span>
        </div>
      </div>
    </div>
  );
}

// ─── STAR RATING ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const [popped, setPopped] = useState(0);
  const pick = n => { onChange(n); setPopped(n); setTimeout(()=>setPopped(0),400); };
  const labels = ['','Needs work','Fair','Good','Great','Outstanding ✦'];
  return (
    <div style={{ textAlign:'center' }}>
      <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:10 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} className={`star ${n<=(hover||value)?'lit':''} ${popped===n?'popped':''}`}
            style={{ color:n<=(hover||value)?'var(--gold)':'var(--bg4)' }}
            onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)}
            onClick={()=>pick(n)}>★</span>
        ))}
      </div>
      {(hover||value) > 0 && <div style={{ fontSize:13, color:'var(--tx3)', animation:'fadeIn .2s ease' }}>{labels[hover||value]}</div>}
    </div>
  );
}

// ─── END SESSION MODAL ──────────────────────────────────────────────────────────
function EndModal({ duration, onRate, onClose }) {

  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const mm = Math.floor(duration/60), ss = duration%60;
  const durStr = `${mm}m ${ss}s`;

  const handleRate = n => {
    setRating(n);
    setSubmitted(true);
    setTimeout(() => onRate(n), 1200);
  };

  return (
   
    <div className="modal-ov">
      <div className="modal-box">
        {/* Gold top bar */}
        <div style={{ height:3, background:'linear-gradient(90deg,transparent,var(--gdk),var(--gold),var(--gdk),transparent)', borderRadius:'14px 14px 0 0' }}/>

        {/* Header */}
        <div style={{ padding:'28px 32px 22px', borderBottom:'1px solid var(--bo)', textAlign:'center' }}>
          <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(62,206,130,.1)', border:'1px solid rgba(62,206,130,.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22 }}>✓</div>
          <h2 className="pf" style={{ fontSize:28, fontWeight:500, letterSpacing:'-.02em', marginBottom:8 }}>
            Session <span className="gt" style={{ fontStyle:'italic' }}>Completed</span>
          </h2>
          <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
            <div style={{ padding:'5px 14px', background:'rgba(255,255,255,.04)', border:'1px solid var(--bo2)', borderRadius:20, fontSize:12, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:'var(--tx3)' }}>Duration</span>
              <span className="mo" style={{ color:'var(--glt)', fontWeight:500 }}>{durStr}</span>
            </div>
            <div style={{ padding:'5px 14px', background:'rgba(62,206,130,.06)', border:'1px solid rgba(62,206,130,.2)', borderRadius:20, fontSize:12, color:'var(--gr)' }}>✓ Session recorded</div>
          </div>
        </div>

        <div style={{ padding:'24px 32px' }}>
          {/* AI Summary */}
          <div style={{ marginBottom:22 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
              <span style={{ fontSize:12, opacity:.55 }}>✦</span>
              <span className="mo" style={{ fontSize:10, color:'var(--gold)', letterSpacing:'.12em', textTransform:'uppercase' }}>AI-Generated Summary</span>
            </div>

            {/* Key takeaways */}
            <div style={{ marginBottom:14 }}>
              <div className="mo" style={{ fontSize:10, color:'var(--tx3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>Key Takeaways</div>
              {[
                'Lead case studies with measurable impact — recruiters scan for outcomes first',
                'Your SaaS onboarding work is a strong niche; frame it as your design specialisation',
                'Impact-first structure: Problem → Metric → Solution → Process',
              ].map((t,i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'10px 13px', background:'rgba(255,255,255,.03)', border:'1px solid var(--bo)', borderRadius:7, marginBottom:7, fontSize:13, color:'var(--tx2)', lineHeight:1.6 }}>
                  <span style={{ color:'var(--gdk)', flexShrink:0, marginTop:1 }}>◈</span> {t}
                </div>
              ))}
            </div>

            {/* Action items */}
            <div style={{ marginBottom:14 }}>
              <div className="mo" style={{ fontSize:10, color:'var(--tx3)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>Action Items</div>
              {[
                'Restructure top 2 portfolio case studies using impact-first framework (7 days)',
                'Apply to Razorpay, CRED, Zepto this week — prepare tailored cover note',
              ].map((a,i) => (
                <div key={i} style={{ display:'flex', gap:10, padding:'10px 13px', background:'rgba(200,164,90,.05)', border:'1px solid rgba(200,164,90,.14)', borderRadius:7, marginBottom:7, fontSize:13, color:'var(--tx2)', lineHeight:1.6 }}>
                  <span style={{ color:'var(--gold)', flexShrink:0, fontWeight:600, marginTop:1 }}>{i+1}.</span> {a}
                </div>
              ))}
            </div>

            {/* Next topic */}
            <div style={{ padding:'13px 16px', background:'rgba(120,174,221,.05)', border:'1px solid rgba(120,174,221,.15)', borderRadius:7 }}>
              <div className="mo" style={{ fontSize:10, color:'var(--bl)', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:5 }}>Suggested Next Session</div>
              <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.6 }}>Portfolio deep-dive: revised case study review + job application pitch workshop</div>
            </div>
          </div>

          {/* Rating */}
          {!submitted ? (
            <div style={{ textAlign:'center', marginBottom:22, padding:'20px', background:'rgba(255,255,255,.02)', borderRadius:10, border:'1px solid var(--bo)' }}>
              <div style={{ fontSize:13, color:'var(--tx3)', marginBottom:14 }}>How was your session with {MENTOR.name}?</div>
              <StarRating value={rating} onChange={handleRate}/>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'18px', background:'rgba(62,206,130,.06)', border:'1px solid rgba(62,206,130,.18)', borderRadius:10, marginBottom:22, animation:'fadeIn .3s ease' }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{'★'.repeat(rating)}</div>
              <div style={{ fontSize:13, color:'var(--gr)' }}>Thank you! Redirecting…</div>
            </div>
          )}

          {!submitted && (
            
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-ghost" onClick={onClose} style={{ flex:1, justifyContent:'center' }}>Close</button>
              <button  className="btn-gold" style={{ flex:1.4 }}>Book Next Session →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── POST-SESSION PAGE ──────────────────────────────────────────────────────────
function ConfettiPiece({ style }) {
  return <div className="confetti-piece" style={style}/>;
}

function PostSessionPage({ duration, rating }) {
  const navigate = useNavigate();
  // 1. Logic & Variables
  const mm = Math.floor(duration / 60);
  const ss = duration % 60;

  const pieces = useMemo(() => {
    const rand = (seed) => {
      const x = Math.sin(seed * 999) * 10000;
      return x - Math.floor(x);
    };
  
    return Array.from({ length: 18 }).map((_, i) => {
      const r1 = rand(i + 1);
      const r2 = rand(i + 2);
      const r3 = rand(i + 3);
      const r4 = rand(i + 4);
      const r5 = rand(i + 5);
  
      return {
        left: `${r1 * 90 + 5}%`,
        top: `${r2 * 30 - 5}%`,
        background: [
          "var(--gold)",
          "var(--gold-lt)",
          "var(--green)",
          "var(--blue)",
          "rgba(200,164,90,.6)"
        ][i % 5],
        animationDelay: `${r3 * 0.8}s`,
        animationDuration: `${1 + r4 * 0.6}s`,
        transform: `rotate(${r5 * 360}deg)`,
        width: `${6 + r1 * 6}px`,
        height: `${6 + r2 * 6}px`,
        borderRadius: r3 > 0.5 ? "50%" : "2px",
      };
    });
  }, []);
  

  const nextSlots = [
    { day: 'Mon, 3 Feb', time: '4:00 PM', avail: true },
    { day: 'Wed, 5 Feb', time: '2:00 PM', avail: true },
    { day: 'Thu, 6 Feb', time: '6:00 PM', avail: false },
    { day: 'Fri, 7 Feb', time: '10:00 AM', avail: true },
  ];
  
  // 2. ONE Return Statement
  return (
    <div className="post-bg page-enter" style={{ minHeight: '100vh', padding: '0 0 80px' }}>
      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {pieces.map((p, i) => (
          <div key={i} className="confetti-piece" style={{ ...p, position: 'absolute' }} />
        ))}
      </div>
  
      {/* Nav */}
      <div style={{ height: 58, display: 'flex', alignItems: 'center', padding: '0 40px', borderBottom: '1px solid var(--border)', background: 'rgba(11,13,17,.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, border: '1px solid var(--gold-dk)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,164,90,.08)', borderRadius: 4 }}>
            <span className="pf" style={{ color: 'var(--gold)', fontSize: 14, fontWeight: 600 }}>M</span>
          </div>
          <span className="pf" style={{ fontSize: 15, fontWeight: 500, letterSpacing: '.05em', color: 'var(--text)' }}>MENTORA</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '5px 14px', background: 'rgba(62,206,130,.07)', border: '1px solid rgba(62,206,130,.2)', borderRadius: 20, fontSize: 11, color: 'var(--green)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
          Session Complete
        </div>
      </div>
  
      

      <div style={{ maxWidth:920, margin:'0 auto', padding:'56px 32px 0', position:'relative', zIndex:1 }}>

        {/* Hero */}
        <div style={{ textAlign:'center', marginBottom:56 }}>
          {/* Gold circle */}
          <div style={{ width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,rgba(200,164,90,.18),rgba(200,164,90,.06))', border:'1px solid rgba(200,164,90,.35)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:34, boxShadow:'0 0 48px rgba(200,164,90,.12)' }}>✦</div>

          <h1 className="pf shimmer-text" style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:500, letterSpacing:'-.02em', lineHeight:1.1, marginBottom:16 }}>
            Great session!
          </h1>
          <p style={{ fontSize:15, color:'var(--tx3)', maxWidth:440, margin:'0 auto', lineHeight:1.75 }}>
            Your session with <span style={{ color:'var(--tx2)', fontWeight:500 }}>{MENTOR.name}</span> has ended. Here's a full recap of what you covered.
          </p>

          {/* Stats row */}
          <div style={{ display:'flex', justifyContent:'center', gap:0, marginTop:36, background:'var(--bg2)', border:'1px solid var(--bo)', borderRadius:12, overflow:'hidden', maxWidth:520, marginLeft:'auto', marginRight:'auto' }}>
            {[
              { label:'Duration', val:`${mm}m ${ss}s` },
              { label:'Your Rating', val:'★'.repeat(rating) || '—' },
              { label:'Action Items', val:'2' },
              { label:'Next Session', val:'Scheduled' },
            ].map((s,i) => (
              <div key={i} style={{ flex:1, padding:'16px 12px', textAlign:'center', borderRight:i<3?'1px solid var(--bo)':'' }}>
                <div className="mo" style={{ fontSize:10, color:'var(--tx3)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
                <div className="pf" style={{ fontSize:18, color:'var(--glt)', letterSpacing:'-.01em' }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-col layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>

          {/* Left: recap */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Takeaways */}
            <div className="card" style={{ padding:'22px', borderRadius:10 }}>
              <div style={{ display:'flex', align:'center', gap:8, marginBottom:16 }}>
                <span style={{ fontSize:16 }}>💡</span>
                <span className="pf" style={{ fontSize:17, fontWeight:500 }}>Key Takeaways</span>
              </div>
              {[
                'Lead portfolio with impact metrics — outcomes before process',
                'SaaS onboarding is your design niche — own it explicitly',
                'Impact-first case study structure resonates with hiring managers',
              ].map((t,i) => (
                <div key={i} style={{ display:'flex', gap:10, marginBottom:10, fontSize:13, color:'var(--tx2)', lineHeight:1.65 }}>
                  <span style={{ color:'var(--gdk)', flexShrink:0, marginTop:2 }}>◈</span> {t}
                </div>
              ))}
            </div>

            {/* Action items */}
            <div className="card" style={{ padding:'22px', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span style={{ fontSize:16 }}>✅</span>
                <span className="pf" style={{ fontSize:17, fontWeight:500 }}>Action Items</span>
              </div>
              {[
                { task:'Restructure top 2 portfolio case studies', due:'7 days', done:false },
                { task:'Apply to Razorpay, CRED, Zepto', due:'This week', done:false },
              ].map((a,i) => (
                <div key={i} style={{ display:'flex', gap:12, padding:'10px 13px', background:a.done?'rgba(62,206,130,.05)':'rgba(200,164,90,.04)', border:`1px solid ${a.done?'rgba(62,206,130,.18)':'rgba(200,164,90,.14)'}`, borderRadius:7, marginBottom:8 }}>
                  <div style={{ width:18, height:18, borderRadius:4, border:`1.5px solid ${a.done?'var(--gr)':'var(--gdk)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                    {a.done && <span style={{ color:'var(--gr)', fontSize:11 }}>✓</span>}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.5 }}>{a.task}</div>
                    <div className="mo" style={{ fontSize:10, color:'var(--tx4)', marginTop:2 }}>Due: {a.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mentor + next booking */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Mentor card */}
            <div className="card" style={{ padding:'22px', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#4A3872,#8A68C4)', border:'2px solid rgba(200,164,90,.35)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:18, color:'var(--tx)', flexShrink:0 }}>SR</div>
                <div>
                  <div className="pf" style={{ fontSize:17, fontWeight:500 }}>{MENTOR.name}</div>
                  <div style={{ fontSize:12, color:'var(--tx3)' }}>{MENTOR.title}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:4 }}>
                    {'★★★★★'.split('').map((_,i) => <span key={i} style={{ color:'var(--gold)', fontSize:12 }}>★</span>)}
                    <span style={{ fontSize:11, color:'var(--tx3)', marginLeft:4 }}>4.97 · 312 sessions</span>
                  </div>
                </div>
              </div>
              <div style={{ padding:'10px 13px', background:'rgba(120,174,221,.05)', border:'1px solid rgba(120,174,221,.15)', borderRadius:7 }}>
                <div className="mo" style={{ fontSize:10, color:'var(--bl)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:4 }}>Suggested Next Topic</div>
                <div style={{ fontSize:13, color:'var(--tx2)', lineHeight:1.6 }}>Portfolio deep-dive: revised case study review + job application pitch workshop</div>
              </div>
            </div>

            {/* Book next */}
            <div className="card" style={{ padding:'22px', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span style={{ fontSize:16 }}>📅</span>
                <span className="pf" style={{ fontSize:17, fontWeight:500 }}>Book Next Session</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {nextSlots.map((sl,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 13px', background:sl.avail?'rgba(255,255,255,.03)':'rgba(255,255,255,.01)', border:`1px solid ${sl.avail?'var(--bo2)':'var(--bo)'}`, borderRadius:7, opacity:sl.avail?1:.45 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:sl.avail?'var(--tx2)':'var(--tx4)', fontWeight:500 }}>{sl.day}</div>
                      <div className="mo" style={{ fontSize:11, color:'var(--tx3)' }}>{sl.time} IST</div>
                    </div>
                    {sl.avail
                      ? <button className="btn-gold" style={{ padding:'6px 14px', fontSize:11 }}>Book</button>
                      : <span style={{ fontSize:11, color:'var(--tx4)' }}>Booked</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="card" style={{ padding:'22px', borderRadius:10, marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:16 }}>📚</span>
            <span className="pf" style={{ fontSize:17, fontWeight:500 }}>Resources from this Session</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { icon:'📄', title:'Case Study Template', sub:'Impact-first structure', tag:'PDF' },
              { icon:'🔗', title:'Portfolio Examples', sub:'Curated by Shriya', tag:'Link' },
              { icon:'📝', title:'Your Session Notes', sub:'Auto-saved, editable', tag:'Notes' },
            ].map((r,i) => (
              <div key={i} style={{ padding:'14px', background:'rgba(255,255,255,.03)', border:'1px solid var(--bo)', borderRadius:8, cursor:'none', transition:'border-color .2s' }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{r.icon}</div>
                <div style={{ fontSize:13, color:'var(--tx2)', fontWeight:500, marginBottom:3 }}>{r.title}</div>
                <div style={{ fontSize:11, color:'var(--tx4)', marginBottom:8 }}>{r.sub}</div>
                <span style={{ fontSize:10, padding:'3px 9px', background:'rgba(200,164,90,.08)', border:'1px solid rgba(200,164,90,.18)', borderRadius:4, color:'var(--gold)' }}>{r.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{ textAlign:'center', paddingTop:20 }}>
          <p style={{ fontSize:13, color:'var(--tx3)', marginBottom:16 }}>Ready to continue your journey?</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate("/student")} className="btn-gold" style={{ padding:'12px 28px', fontSize:14 }}>Book Next Session ↗</button>
            <button  onClick={() => navigate("/student")}className="btn-ghost" style={{ padding:'12px 24px', fontSize:14 }}>View All Sessions</button>
            <button className="btn-ghost" style={{ padding:'12px 24px', fontSize:14 }}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SESSION PAGE ───────────────────────────────────────────────────────────────
function SessionPage({ onEnd }) {
  const [timerOn, setTimerOn] = useState(true);
  const [secs, timerDisplay] = useTimer(timerOn);
  const [messages, setMessages] = useState(INIT_MSGS);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ended, setEnded] = useState(false);

  const handleEndClick = () => { setTimerOn(false); setEnded(true); setShowModal(true); };

  const handleSend = useCallback((txt, ts) => {
    const newMsg = { id:Date.now(), from:'student', text:txt, ts };
    setMessages(p => [...p, newMsg]);
    setTimeout(() => {
      const replies = [
        "That's a really sharp question. Let me break that down — the key is making your reasoning visible, not just your output.",
        "Exactly — the more you quantify your decisions, the more credible the narrative becomes.",
        "Good instinct. Document your thought process as you go; retrospective write-ups always feel thinner.",
        "Yes, and keep the language outcome-oriented throughout. 'Reduced drop-off' lands better than 'redesigned flow'.",
      ];
      setMessages(p => [...p, { id:Date.now()+1, from:'mentor', text:replies[Math.floor(Math.random()*replies.length)], ts }]);
    }, 1600);
  }, []);

  const handleRate = (n) => {
    setShowModal(false);
    onEnd(secs, n);
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* ── HEADER ── */}
      <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(17,19,24,.92)', backdropFilter:'blur(24px)', borderBottom:'1px solid var(--bo)', animation:'slideUp .5s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(200,164,90,.2),transparent)' }}/>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'0 28px', height:58, display:'flex', alignItems:'center', gap:16 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <div style={{ width:24, height:24, border:'1px solid var(--gdk)', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(200,164,90,.08)', borderRadius:4 }}>
              <span className="pf" style={{ color:'var(--gold)', fontSize:13, fontWeight:600 }}>M</span>
            </div>
            <span className="pf" style={{ fontSize:14, fontWeight:500, letterSpacing:'.05em' }}>MENTORA</span>
          </div>

          <div style={{ width:1, height:18, background:'var(--bo3)', flexShrink:0 }}/>

          {/* Mentor */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#4A3872,#8A68C4)', border:'1.5px solid rgba(200,164,90,.35)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Playfair Display,serif', fontSize:11, color:'var(--tx)' }}>SR</div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, letterSpacing:'-.01em' }}>{MENTOR.name}</div>
              <div style={{ fontSize:10, color:'var(--tx3)' }}>{MENTOR.title}</div>
            </div>
          </div>

          {/* Topic */}
          <div className="hdr-topic" style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontSize:11, color:'var(--tx3)', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:1 }}>Topic</div>
            <div className="pf" style={{ fontSize:14, color:'var(--tx2)', letterSpacing:'-.01em' }}>Product Design Career Strategy</div>
          </div>

          {/* Right */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginLeft:'auto', flexShrink:0 }}>
            {!ended ? (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 13px', background:'rgba(62,206,130,.07)', border:'1px solid rgba(62,206,130,.2)', borderRadius:20 }}>
                <span className="live-dot" style={{ width:6, height:6 }}/>
                <span style={{ fontSize:10, color:'var(--gr)', fontWeight:600, letterSpacing:'.08em' }}>LIVE</span>
              </div>
            ) : (
              <div style={{ padding:'5px 13px', background:'rgba(224,112,112,.07)', border:'1px solid rgba(224,112,112,.2)', borderRadius:20, fontSize:10, color:'var(--re)', fontWeight:600, letterSpacing:'.08em' }}>ENDED</div>
            )}
            <div style={{ padding:'5px 14px', background:'var(--bg2)', border:'1px solid var(--bo2)', borderRadius:20 }}>
              <span className="mo" style={{ fontSize:13, color:'var(--glt)', letterSpacing:'.06em' }}>{timerDisplay}</span>
            </div>
            {!ended && <button className="btn-danger" onClick={handleEndClick}><span style={{ fontSize:9 }}>■</span> End Session</button>}
          </div>
        </div>
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(200,164,90,.1),transparent)' }}/>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex:1, maxWidth:1400, margin:'0 auto', width:'100%', padding:'18px 28px 24px' }}>
        {/* Video + Chat row */}
        <div className="session-row" style={{ display:'flex', gap:16, marginBottom:16 }}>
          <VideoPanel micOn={micOn} camOn={camOn} onMic={()=>setMicOn(v=>!v)} onCam={()=>setCamOn(v=>!v)} sessionEnded={ended}/>
          <ChatPanel messages={messages} onSend={handleSend} timerDisplay={timerDisplay}/>
        </div>
        {/* Notes */}
        <NotesPanel/>
        {/* Meta strip */}
        <div style={{ marginTop:12, padding:'9px 16px', background:'rgba(255,255,255,.02)', border:'1px solid var(--bo)', borderRadius:8, display:'flex', alignItems:'center', gap:18, flexWrap:'wrap', animation:'slideUp .5s .3s both' }}>
          {[
            { label:'Session ID', val:'MNT-2025-1147', mono:true },
            { label:'Type', val:'1:1 Career Mentoring' },
            { label:'Scheduled', val:'60 minutes' },
            { label:'Elapsed', val:timerDisplay, mono:true },
            { label:'Encryption', val:'End-to-end' },
          ].map((m,i) => (
            <div key={i} style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontSize:9, color:'var(--tx4)', letterSpacing:'.07em', textTransform:'uppercase' }}>{m.label}</span>
              <span style={{ width:1, height:8, background:'var(--bo2)' }}/>
              <span className={m.mono?'mo':''} style={{ fontSize:11, color:'var(--tx3)' }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>

      {showModal && <EndModal duration={secs} onRate={handleRate} onClose={()=>setShowModal(false)}/>}
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState('session'); // 'session' | 'transitioning' | 'post'
  const [sessionData, setSessionData] = useState({ duration:0, rating:0 });

  const handleEnd = (duration, rating) => {
    setSessionData({ duration, rating });
    setPhase('transitioning');
    setTimeout(() => setPhase('post'), 600);
  };

  return (
    <>
      <style>{STYLES}</style>
      <Cursor/>
      {phase === 'session' && <SessionPage onEnd={handleEnd}/>}
      {phase === 'transitioning' && (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)' }}>
          <div style={{ textAlign:'center', animation:'fadeIn .3s ease' }}>
            <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(200,164,90,.1)', border:'1px solid rgba(200,164,90,.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:22, animation:'glowRing 1s ease-in-out infinite' }}>✦</div>
            <div className="pf" style={{ fontSize:18, color:'var(--tx2)' }}>Generating your session recap…</div>
          </div>
        </div>
      )}
      {phase === 'post' && <PostSessionPage duration={sessionData.duration} rating={sessionData.rating}/>}
    </>
  );
}