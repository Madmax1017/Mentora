import { useState, useEffect, useRef } from "react";

// ─── Global Styles ────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0A0A;--bg2:#111111;--bg3:#161616;--bg4:#1A1A1A;
  --border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.13);--border3:rgba(255,255,255,.2);
  --gold:#C9A96E;--gold-lt:#E2C99A;--gold-dk:#8A6A3E;
  --text:#F0EDE8;--muted:#7A7570;--muted2:#3A3530;--muted3:#555;
  --green:#4ADE80;--red:#F87171;--blue:#60A5FA;
}
body.light-mode {
  --bg:#F5F5F0;--bg2:#FFFBF7;--bg3:#F0E8E0;--bg4:#F8F4EF;
  --border:rgba(0,0,0,.08);--border2:rgba(0,0,0,.14);--border3:rgba(0,0,0,.2);
  --text:#1A1815;--muted:#6B6560;--muted2:#999;--muted3:#AAA;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
::selection{background:var(--gold-dk);color:var(--text)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gold-dk);border-radius:2px}
.serif{font-family:'Cormorant Garamond',serif}
.gold-text{background:linear-gradient(135deg,var(--gold-lt) 0%,var(--gold) 50%,var(--gold-dk) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");opacity:.35}
#cur{position:fixed;top:0;left:0;z-index:9999;pointer-events:none;width:8px;height:8px;border-radius:50%;background:var(--gold);transform:translate(-50%,-50%)}
#cur-ring{position:fixed;top:0;left:0;z-index:9998;pointer-events:none;width:36px;height:36px;border-radius:50%;border:1px solid rgba(201,169,110,.5);transform:translate(-50%,-50%);transition:all .15s cubic-bezier(.22,1,.36,1)}
.orb{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
@keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
.orb{animation:glow 5s ease-in-out infinite}
.tag-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(201,169,110,.25);border-radius:1px;padding:5px 14px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:500;background:rgba(201,169,110,.04)}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes slideRight{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.nav-wrap{position:sticky;top:0;z-index:100;background:rgba(10,10,10,.92);backdrop-filter:blur(24px) saturate(1.5);border-bottom:1px solid var(--border)}
.search-input{background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:2px;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;padding:10px 16px 10px 42px;width:100%;outline:none;transition:all .3s;letter-spacing:.01em}
.search-input::placeholder{color:var(--muted)}
.search-input:focus{border-color:rgba(201,169,110,.35);background:rgba(201,169,110,.04);box-shadow:0 0 0 3px rgba(201,169,110,.06)}
.filter-select{background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:2px;color:var(--text);font-family:'Outfit',sans-serif;font-size:12px;padding:10px 36px 10px 14px;outline:none;cursor:none;appearance:none;-webkit-appearance:none;transition:all .3s;letter-spacing:.03em;white-space:nowrap;min-width:150px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7570' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center}
.filter-select:focus,.filter-select:hover{border-color:rgba(201,169,110,.35);background-color:rgba(201,169,110,.04)}
.filter-select option{background:#1A1A1A;color:var(--text)}
.mentor-card{background:linear-gradient(145deg,rgba(26,22,18,.95),rgba(16,14,12,.97));border:1px solid var(--border);border-radius:4px;padding:28px 24px;position:relative;overflow:hidden;transition:all .45s cubic-bezier(.22,1,.36,1);cursor:none}
.mentor-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(201,169,110,.06),transparent 60%);opacity:0;transition:opacity .45s}
.mentor-card:hover::before{opacity:1}
.mentor-card:hover{border-color:rgba(201,169,110,.2);transform:translateY(-8px);box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(201,169,110,.08)}
.mentor-card .bottom-bar{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold-dk),var(--gold));transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.22,1,.36,1)}
.mentor-card:hover .bottom-bar{transform:scaleX(1)}
.btn-g{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--gold-lt),var(--gold));color:#0A0A0A;border:none;border-radius:1px;padding:11px 24px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:none;transition:all .35s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden;width:100%}
.btn-g::after{content:'';position:absolute;inset:0;background:rgba(255,255,255,.2);transform:translateX(-105%) skewX(-20deg);transition:transform .55s cubic-bezier(.22,1,.36,1)}
.btn-g:hover::after{transform:translateX(110%) skewX(-20deg)}
.btn-g:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(201,169,110,.3)}
.btn-g:disabled{opacity:.4;pointer-events:none}
.btn-o{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--gold);border:1px solid var(--gold-dk);border-radius:1px;padding:8px 18px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:none;transition:all .3s}
.btn-o:hover{background:rgba(201,169,110,.07);border-color:var(--gold);transform:translateY(-1px)}
.btn-red{display:inline-flex;align-items:center;gap:6px;background:transparent;color:var(--red);border:1px solid rgba(248,113,113,.3);border-radius:1px;padding:8px 18px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:none;transition:all .3s}
.btn-red:hover{background:rgba(248,113,113,.07);border-color:var(--red)}
.avatar{border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:500;color:#0A0A0A;border:2px solid rgba(201,169,110,.3);flex-shrink:0}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:1px;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.badge-green{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);color:var(--green)}
.badge-gold{background:rgba(201,169,110,.1);border:1px solid rgba(201,169,110,.2);color:var(--gold)}
.badge-muted{background:rgba(122,117,112,.1);border:1px solid rgba(122,117,112,.2);color:var(--muted)}
.badge-red{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.2);color:var(--red)}
.badge-blue{background:rgba(96,165,250,.1);border:1px solid rgba(96,165,250,.2);color:var(--blue)}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);z-index:200;display:flex;align-items:center;justify-content:center;padding:24px}
.modal-box{background:linear-gradient(145deg,#1A1814,#120F0C);border:1px solid rgba(201,169,110,.2);border-radius:6px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:0 40px 120px rgba(0,0,0,.9),inset 0 1px 0 rgba(201,169,110,.1)}
.modal-box::-webkit-scrollbar{width:3px}
.modal-box::-webkit-scrollbar-thumb{background:var(--gold-dk)}
.modal-wide{max-width:820px}
.filter-row{display:flex;gap:12px;align-items:center;overflow-x:auto;padding-bottom:4px}
.filter-row::-webkit-scrollbar{display:none}
@keyframes cardIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
.card-in{animation:cardIn .6s cubic-bezier(.22,1,.36,1) both}
.modal-section{padding:20px 32px;border-bottom:1px solid var(--border)}
.modal-section:last-child{border-bottom:none}
.stat-mini{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:3px;padding:14px 18px;text-align:center}
.tab-btn{padding:10px 20px;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:none;background:transparent;border:none;color:var(--muted);transition:all .25s;border-bottom:2px solid transparent}
.tab-btn.active{color:var(--gold);border-bottom-color:var(--gold)}
.tab-btn:hover{color:var(--text)}
.slot-btn{padding:8px 16px;border:1px solid var(--border2);border-radius:2px;font-size:12px;cursor:none;background:transparent;color:var(--muted);transition:all .25s;font-family:'Outfit',sans-serif}
.slot-btn:hover{border-color:var(--gold-dk);color:var(--gold);background:rgba(201,169,110,.05)}
.slot-btn.selected{border-color:var(--gold);color:var(--gold);background:rgba(201,169,110,.1)}
@keyframes toastIn{from{opacity:0;transform:translateX(110%)}to{opacity:1;transform:translateX(0)}}
@keyframes toastOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(110%)}}
.toast{position:fixed;bottom:32px;right:32px;z-index:999;background:linear-gradient(135deg,#1A1814,#120F0C);border:1px solid rgba(201,169,110,.3);border-radius:4px;padding:16px 24px;display:flex;align-items:center;gap:12px;box-shadow:0 20px 60px rgba(0,0,0,.8);animation:toastIn .4s cubic-bezier(.22,1,.36,1) both;min-width:280px}
.toast.out{animation:toastOut .35s ease forwards}
.toast-red{border-color:rgba(248,113,113,.3)}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.shimmer{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.03) 75%);background-size:200% 100%;animation:shimmer 1.6s infinite}

/* Payment modal styles */
.pay-input{background:rgba(255,255,255,.04);border:1px solid var(--border2);border-radius:2px;color:var(--text);font-family:'Outfit',sans-serif;font-size:14px;padding:11px 14px;width:100%;outline:none;transition:all .3s;letter-spacing:.02em}
.pay-input::placeholder{color:var(--muted2)}
.pay-input:focus{border-color:rgba(201,169,110,.4);background:rgba(201,169,110,.04);box-shadow:0 0 0 3px rgba(201,169,110,.06)}
.pay-method{border:1px solid var(--border2);border-radius:3px;padding:14px 16px;cursor:none;transition:all .3s;display:flex;align-items:center;gap:12px;background:transparent}
.pay-method:hover{border-color:var(--gold-dk);background:rgba(201,169,110,.04)}
.pay-method.selected{border-color:var(--gold);background:rgba(201,169,110,.08)}
@keyframes processingBar{from{width:0}to{width:100%}}
.processing-bar{height:2px;background:linear-gradient(90deg,var(--gold-dk),var(--gold-lt));animation:processingBar 2.2s cubic-bezier(.4,0,.2,1) forwards}
@keyframes checkmark{0%{stroke-dashoffset:50}100%{stroke-dashoffset:0}}
.check-svg{stroke-dasharray:50;stroke-dashoffset:50;animation:checkmark .5s ease .1s forwards}

/* Booked sessions panel */
.sessions-panel{position:fixed;top:0;right:0;bottom:0;width:420px;background:linear-gradient(180deg,#141210,#0E0C0A);border-left:1px solid rgba(201,169,110,.2);z-index:300;box-shadow:-40px 0 100px rgba(0,0,0,.8);animation:slideRight .4s cubic-bezier(.22,1,.36,1)}
.session-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:3px;padding:16px 18px;transition:all .3s}
.session-card:hover{border-color:var(--border2);background:rgba(255,255,255,.05)}
.cancel-warning{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);border-radius:3px;padding:12px 14px;margin-top:10px}

@media(max-width:900px){
  .hide-mob{display:none!important}
  .grid-3{grid-template-columns:repeat(2,1fr)!important}
  .sessions-panel{width:100%}
}
@media(max-width:580px){
  .grid-3{grid-template-columns:1fr!important}
  .modal-box{margin:0;border-radius:0;max-height:100vh}
  .modal-section{padding:16px 20px}
}
`;

// ─── Mock Mentors ─────────────────────────────────────────────────────────────
const MENTORS = [
  { id:1,  name:"Arjun Mehta",    initials:"AM", expertise:"Full Stack Developer",    title:"Senior SDE @ Amazon",           bio:"8+ years building scalable systems. React, Node, AWS specialist.",                  rating:4.9, reviews:142, price:1200, category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#8A6A3E,#C9A96E)", sessions:340, tags:["React","Node.js","AWS","System Design"],      about:"Former SDE-II at Amazon, now mentoring passionate developers. I specialise in helping engineers level up their system design skills and crack FAANG interviews. Structured, actionable, focused on real outcomes.", slots:["Mon 6 PM","Mon 8 PM","Tue 7 PM","Wed 6 PM","Thu 7 PM","Fri 6 PM"] },
  { id:2,  name:"Shriya Rao",     initials:"SR", expertise:"Product Designer",         title:"Lead Designer @ Figma",         bio:"Helping designers build world-class portfolios and land dream roles.",                rating:4.8, reviews:98,  price:1000, category:"Career Guidance",  available:true,  gradient:"linear-gradient(135deg,#5A4A7A,#9A80C9)", sessions:210, tags:["UX Research","Figma","Design Systems","Portfolio"], about:"Lead product designer with 6 years at top companies. I help aspiring designers refine their craft, build compelling portfolios, and navigate the design hiring process with confidence.", slots:["Mon 5 PM","Tue 6 PM","Wed 5 PM","Thu 6 PM","Sat 11 AM","Sun 10 AM"] },
  { id:3,  name:"Karan Patel",    initials:"KP", expertise:"Interview Coach",          title:"Ex-Google | Career Coach",      bio:"300+ successful FAANG placements. Cracking interviews is a learnable skill.",           rating:5.0, reviews:203, price:1500, category:"Interview Prep",   available:false, gradient:"linear-gradient(135deg,#2A5A4A,#5A9A80)", sessions:580, tags:["DSA","System Design","FAANG Prep","Mock Interviews"],about:"Ex-Google engineer turned full-time career coach. I've helped 300+ candidates land offers at Google, Meta, Amazon, and Microsoft. My proven framework breaks interview prep into a clear, repeatable system.", slots:["Tue 8 PM","Wed 8 PM","Fri 7 PM","Sat 10 AM","Sun 11 AM"] },
  { id:4,  name:"Meera Iyer",     initials:"MI", expertise:"Data Scientist",           title:"ML Engineer @ Flipkart",        bio:"Python, ML, Deep Learning — from fundamentals to production-ready models.",           rating:4.7, reviews:76,  price:900,  category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#5A3A2A,#C97A4E)", sessions:145, tags:["Python","ML","Deep Learning","Data Analysis"],   about:"ML Engineer at Flipkart with expertise in recommendation systems and NLP. I help learners go from zero to deploying real machine learning models. Sessions are hands-on and project-driven.", slots:["Mon 7 PM","Wed 7 PM","Thu 5 PM","Fri 8 PM","Sat 2 PM"] },
  { id:5,  name:"Rohan Das",      initials:"RD", expertise:"Startup Founder",          title:"2x Founder | Angel Investor",   bio:"Built and exited two startups. Guiding founders from idea to PMF.",                  rating:4.9, reviews:55,  price:2000, category:"Career Guidance",  available:true,  gradient:"linear-gradient(135deg,#3A3A5A,#7A80C9)", sessions:90,  tags:["Entrepreneurship","Fundraising","Product Strategy","GTM"], about:"Two-time founder with a successful exit and now an angel investor. I work with early-stage founders on product strategy, fundraising narratives, and finding product-market fit.", slots:["Tue 7 PM","Thu 8 PM","Sat 3 PM","Sun 2 PM"] },
  { id:6,  name:"Priya Nair",     initials:"PN", expertise:"Backend Engineer",         title:"SDE-II @ Microsoft",            bio:"APIs, microservices, Kubernetes — backend excellence from first principles.",          rating:4.6, reviews:89,  price:800,  category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#2A4A5A,#5A90C9)", sessions:178, tags:["Java","Spring Boot","Microservices","K8s"],       about:"SDE-II at Microsoft with deep expertise in distributed backend systems. I help developers understand architecture decisions that separate good engineers from great ones. Practical, code-first sessions.", slots:["Mon 6 PM","Tue 5 PM","Wed 6 PM","Fri 5 PM","Sat 12 PM"] },
  { id:7,  name:"Vivek Sharma",   initials:"VS", expertise:"DevOps Engineer",          title:"Staff Engineer @ Razorpay",     bio:"CI/CD, Docker, Kubernetes, and cloud infra done right at scale.",                    rating:4.8, reviews:112, price:1100, category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#1A4A3A,#40907A)", sessions:220, tags:["DevOps","Docker","Kubernetes","CI/CD"],           about:"Staff engineer at Razorpay building infrastructure that processes millions of transactions. I simplify DevOps and cloud concepts, helping engineers confidently ship and scale their applications.", slots:["Mon 8 PM","Wed 8 PM","Thu 6 PM","Fri 7 PM","Sat 9 AM"] },
  { id:8,  name:"Ananya Krishnan",initials:"AK", expertise:"Product Manager",          title:"Sr. PM @ Swiggy",              bio:"0-to-1 product thinking. PRDs, roadmaps, and stakeholder alignment.",                 rating:4.9, reviews:134, price:1300, category:"Career Guidance",  available:true,  gradient:"linear-gradient(135deg,#5A2A4A,#C96A90)", sessions:195, tags:["Product Strategy","PRD","Roadmapping","Metrics"],  about:"Senior PM at Swiggy who has launched products used by 10M+ users. I help aspiring PMs build structured product thinking, nail PM interviews, and break into top product roles.", slots:["Tue 6 PM","Wed 7 PM","Thu 8 PM","Fri 6 PM","Sun 3 PM"] },
  { id:9,  name:"Dev Malhotra",   initials:"DM", expertise:"Frontend Architect",       title:"Tech Lead @ Razorpay",          bio:"React internals, performance, design systems — elegant UI engineering.",               rating:4.7, reviews:67,  price:950,  category:"Programming",     available:false, gradient:"linear-gradient(135deg,#4A3A1A,#AA8A3A)", sessions:130, tags:["React","TypeScript","Performance","Design Systems"],about:"Tech lead at Razorpay, obsessed with frontend performance and developer experience. I help engineers write cleaner, faster, more maintainable UI code and architect component systems properly.", slots:["Mon 7 PM","Tue 7 PM","Thu 7 PM","Sat 11 AM","Sun 2 PM"] },
  { id:10, name:"Neha Joshi",     initials:"NJ", expertise:"Data Analyst",             title:"Analytics Lead @ PhonePe",      bio:"SQL, Tableau, storytelling with data — turn numbers into decisions.",                 rating:4.6, reviews:58,  price:750,  category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#1A3A5A,#4A7AAA)", sessions:110, tags:["SQL","Tableau","Python","Business Analytics"],   about:"Analytics lead at PhonePe with 5 years turning raw data into product decisions. I mentor analysts who want to go beyond dashboards and develop a true product analytics mindset.", slots:["Mon 5 PM","Wed 5 PM","Fri 5 PM","Sat 10 AM","Sun 11 AM"] },
  { id:11, name:"Sameer Qureshi", initials:"SQ", expertise:"iOS Developer",             title:"Senior iOS @ CRED",             bio:"Swift, SwiftUI, and UIKit. Ship polished iOS apps from idea to App Store.",           rating:4.8, reviews:81,  price:1050, category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#3A1A4A,#8A5AAA)", sessions:160, tags:["Swift","SwiftUI","UIKit","App Store"],            about:"Senior iOS engineer at CRED crafting delightful mobile experiences. I help aspiring iOS developers go from Swift basics to shipping production apps with confidence — including all the App Store gotchas.", slots:["Tue 8 PM","Wed 6 PM","Thu 5 PM","Sat 2 PM","Sun 4 PM"] },
  { id:12, name:"Lavanya Pillai",  initials:"LP", expertise:"HR & Talent Coach",        title:"Head of People @ Zepto",        bio:"Resume, LinkedIn, salary negotiation — land offers with confidence.",                 rating:4.9, reviews:176, price:700,  category:"Career Guidance",  available:true,  gradient:"linear-gradient(135deg,#3A4A2A,#7A9A5A)", sessions:400, tags:["Resume","LinkedIn","Negotiation","Job Search"],   about:"Head of People at Zepto with a decade in talent acquisition. I've reviewed 10,000+ resumes and conducted 2,000+ interviews. I help candidates present themselves to land interviews at top companies.", slots:["Mon 6 PM","Tue 5 PM","Wed 6 PM","Thu 5 PM","Fri 6 PM","Sat 10 AM"] },
  { id:13, name:"Rahul Singhania", initials:"RS", expertise:"Blockchain Developer",     title:"Web3 Lead @ Polygon",           bio:"Smart contracts, DeFi, and Web3 fundamentals for serious builders.",                  rating:4.7, reviews:49,  price:1400, category:"Programming",     available:false, gradient:"linear-gradient(135deg,#2A1A5A,#6A4AAA)", sessions:75,  tags:["Solidity","Web3","DeFi","Smart Contracts"],       about:"Web3 lead at Polygon building the decentralized future. I help developers transition into blockchain development, understand smart contract security, and navigate the rapidly evolving DeFi ecosystem.", slots:["Wed 9 PM","Thu 9 PM","Sat 4 PM","Sun 5 PM"] },
  { id:14, name:"Pooja Tiwari",   initials:"PT", expertise:"Content & Growth",         title:"Growth Lead @ Razorpay",        bio:"SEO, content strategy, and viral growth — scale from zero to millions.",              rating:4.8, reviews:93,  price:850,  category:"Career Guidance",  available:true,  gradient:"linear-gradient(135deg,#4A2A2A,#AA5A5A)", sessions:185, tags:["SEO","Content Strategy","Growth","Social Media"],  about:"Growth lead at Razorpay who has built content channels from zero to millions of monthly readers. I mentor marketers and founders who want a no-fluff guide to organic growth and content strategy.", slots:["Mon 7 PM","Tue 7 PM","Thu 7 PM","Fri 7 PM","Sun 3 PM"] },
  { id:15, name:"Aditya Bose",    initials:"AB", expertise:"Cloud Architect",          title:"Principal Architect @ TCS",     bio:"AWS, Azure, GCP — design resilient, scalable cloud architectures.",                  rating:4.7, reviews:105, price:1600, category:"Programming",     available:true,  gradient:"linear-gradient(135deg,#1A3A4A,#3A7A9A)", sessions:240, tags:["AWS","Azure","Cloud Architecture","Terraform"],  about:"Principal cloud architect at TCS with certifications across AWS, Azure, and GCP. I help engineers design production-grade cloud architectures and pass cloud certification exams on the first attempt.", slots:["Tue 6 PM","Wed 7 PM","Fri 8 PM","Sat 11 AM","Sun 2 PM"] },
];

const CATEGORIES = ["All Categories","Programming","Interview Prep","Career Guidance"];
const PRICES     = ["Any Price","Under ₹1,000","₹1,000 – ₹1,500","Above ₹1,500"];
const RATINGS    = ["Any Rating","5.0 ★","4.8+ ★","4.5+ ★"];
const SORTS      = ["Featured","Highest Rated","Price: Low–High","Most Reviews"];

// Cancel policy: full refund if > 12h before, 50% if 6–12h, no refund if < 6h
const CANCEL_POLICY = [
  { threshold: 12, label: "> 12 hours before", refund: "Full refund", color: "var(--green)", pct: 100 },
  { threshold: 6,  label: "6–12 hours before", refund: "50% refund",  color: "var(--gold)",  pct: 50  },
  { threshold: 0,  label: "< 6 hours before",  refund: "No refund",   color: "var(--red)",   pct: 0   },
];

function getCancelPolicy(hoursLeft) {
  if (hoursLeft > 12) return CANCEL_POLICY[0];
  if (hoursLeft > 6)  return CANCEL_POLICY[1];
  return CANCEL_POLICY[2];
}

// ─── Cursor ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const mouse = useRef({ x:0, y:0 });
  const lag   = useRef({ x:0, y:0 });
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
  useEffect(() => {
    const t = setTimeout(() => { setOut(true); setTimeout(onDone, 380); }, 3400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`toast ${msg.red ? "toast-red" : ""} ${out ? "out" : ""}`}>
      <span style={{ fontSize:20 }}>{msg.icon}</span>
      <div>
        <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{msg.title}</div>
        <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{msg.body}</div>
      </div>
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ mentor, slot, onSuccess, onClose }) {
  const [method, setMethod]   = useState("card");
  const [step, setStep]       = useState("form"); // form | processing | success
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry]   = useState("");
  const [cvv, setCvv]         = useState("");
  const [name, setName]       = useState("");
  const [upi, setUpi]         = useState("");

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  const formatCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExp  = v => { const d = v.replace(/\D/g,"").slice(0,4); return d.length > 2 ? d.slice(0,2)+"/"+d.slice(2) : d; };

  const canPay = method === "card"
    ? cardNum.replace(/\s/g,"").length === 16 && expiry.length === 5 && cvv.length === 3 && name.length > 2
    : upi.includes("@");

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => { setStep("success"); setTimeout(() => { onSuccess(); onClose(); }, 1800); }, 2400);
  };

  const txId = "MNT" + crypto.randomUUID().slice(0,8).toUpperCase();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && step === "form" && onClose()}>
      <div className="modal-box" style={{ maxWidth:500, animation:"scaleIn .4s cubic-bezier(.22,1,.36,1)" }}>
        {/* Processing overlay */}
        {step === "processing" && (
          <div style={{ position:"absolute",inset:0,borderRadius:6,background:"rgba(10,8,6,.95)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24 }}>
            <div style={{ fontSize:12,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8 }}>Processing Payment</div>
            <div style={{ width:200,height:2,background:"rgba(255,255,255,.06)",borderRadius:1,overflow:"hidden" }}>
              <div className="processing-bar" />
            </div>
            <div className="serif" style={{ fontSize:36,fontWeight:300,color:"var(--gold-lt)",letterSpacing:"-.02em" }}>₹{mentor.price.toLocaleString("en-IN")}</div>
            <div style={{ fontSize:12,color:"var(--muted)",marginTop:-12 }}>Securing your transaction…</div>
          </div>
        )}

        {/* Success overlay */}
        {step === "success" && (
          <div style={{ position:"absolute",inset:0,borderRadius:6,background:"rgba(10,8,6,.97)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16 }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="29" stroke="rgba(201,169,110,.3)" strokeWidth="1"/>
              <circle cx="30" cy="30" r="29" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="182" strokeDashoffset="182" style={{ animation:"checkmark .7s ease forwards" }}/>
              <polyline points="18,30 26,38 42,22" stroke="var(--gold-lt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-svg" fill="none"/>
            </svg>
            <div className="serif" style={{ fontSize:28,fontWeight:400,color:"var(--text)" }}>Payment Successful</div>
            <div style={{ fontSize:13,color:"var(--muted)",textAlign:"center",maxWidth:260 }}>Session with {mentor.name} is confirmed for {slot}.</div>
            <div style={{ fontSize:11,color:"var(--muted2)",letterSpacing:".06em",marginTop:4 }}>TXN ID: {txId}</div>
          </div>
        )}

        {/* Header */}
        <div style={{ padding:"24px 28px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4 }}>Secure Checkout</div>
            <div className="serif" style={{ fontSize:22,fontWeight:500 }}>Complete Payment</div>
          </div>
          <button onClick={onClose} style={{ width:32,height:32,border:"1px solid var(--border2)",borderRadius:2,background:"transparent",color:"var(--muted)",cursor:"none",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>✕</button>
        </div>

        {/* Order summary */}
        <div style={{ padding:"16px 28px",background:"rgba(201,169,110,.04)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div className="avatar" style={{ width:40,height:40,background:mentor.gradient,fontSize:14 }}>{mentor.initials}</div>
            <div>
              <div style={{ fontSize:13,fontWeight:500 }}>{mentor.name}</div>
              <div style={{ fontSize:11,color:"var(--muted)" }}>{slot} · 60 min session</div>
            </div>
          </div>
          <div className="serif" style={{ fontSize:24,fontWeight:500,color:"var(--gold-lt)",letterSpacing:"-.01em" }}>₹{mentor.price.toLocaleString("en-IN")}</div>
        </div>

        {/* Payment methods */}
        <div style={{ padding:"20px 28px" }}>
          <div style={{ fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12 }}>Payment Method</div>
          <div style={{ display:"flex",gap:10,marginBottom:20 }}>
            {[
              { id:"card", icon:"💳", label:"Card"    },
              { id:"upi",  icon:"📱", label:"UPI"     },
              { id:"nb",   icon:"🏦", label:"Net Banking" },
            ].map(m => (
              <div key={m.id} className={`pay-method ${method===m.id?"selected":""}`} style={{ flex:1,justifyContent:"center",flexDirection:"column",textAlign:"center",padding:"12px 10px",gap:6 }} onClick={() => setMethod(m.id)}>
                <span style={{ fontSize:20 }}>{m.icon}</span>
                <span style={{ fontSize:11,color:method===m.id?"var(--gold)":"var(--muted)",fontWeight:500,letterSpacing:".06em" }}>{m.label}</span>
              </div>
            ))}
          </div>

          {method === "card" && (
            <div style={{ display:"flex",flexDirection:"column",gap:12,animation:"fadeIn .3s ease" }}>
              <input className="pay-input" placeholder="Cardholder name" value={name} onChange={e => setName(e.target.value)} />
              <input className="pay-input" placeholder="1234 5678 9012 3456" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} style={{ letterSpacing:".08em" }} />
              <div style={{ display:"flex",gap:12 }}>
                <input className="pay-input" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExp(e.target.value))} maxLength={5} />
                <input className="pay-input" placeholder="CVV" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,"").slice(0,3))} maxLength={3} type="password" />
              </div>
            </div>
          )}

          {method === "upi" && (
            <div style={{ animation:"fadeIn .3s ease" }}>
              <input className="pay-input" placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} />
              <div style={{ display:"flex",gap:8,marginTop:10,flexWrap:"wrap" }}>
                {["@okaxis","@ybl","@paytm","@oksbi"].map(s => (
                  <span key={s} onClick={() => setUpi("user"+s)} style={{ fontSize:11,padding:"4px 12px",border:"1px solid var(--border2)",borderRadius:2,color:"var(--muted)",cursor:"none",transition:"all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {method === "nb" && (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,animation:"fadeIn .3s ease" }}>
              {["SBI","HDFC","ICICI","Axis","Kotak","PNB"].map(b => (
                <div key={b} className="pay-method" style={{ justifyContent:"center",padding:"12px" }} onClick={() => setUpi(b)}>
                  <span style={{ fontSize:12,color:upi===b?"var(--gold)":"var(--muted)",fontWeight:500 }}>{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pay button */}
        <div style={{ padding:"0 28px 24px" }}>
          <button className="btn-g" onClick={handlePay} disabled={method==="card" ? !canPay : false} style={{ fontSize:13,padding:"14px 24px" }}>
            🔒 Pay ₹{mentor.price.toLocaleString("en-IN")} Securely
          </button>
          <div style={{ display:"flex",justifyContent:"center",gap:16,marginTop:12 }}>
            {["Razorpay Secured","256-bit SSL","PCI DSS"].map(l => (
              <span key={l} style={{ fontSize:10,color:"var(--muted2)",letterSpacing:".06em" }}>✓ {l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cancel Modal (multi-step: reason → confirm → done) ──────────────────────
const CANCEL_REASONS = [
  { id:"schedule",  icon:"🗓", label:"Schedule conflict",           sub:"Something came up at the same time" },
  { id:"personal",  icon:"🙁", label:"Personal emergency",          sub:"Unexpected personal circumstance"   },
  { id:"mentor",    icon:"👤", label:"Found a different mentor",     sub:"Someone more suited to my needs"    },
  { id:"topic",     icon:"📚", label:"Topic no longer relevant",     sub:"My learning goals have changed"     },
  { id:"budget",    icon:"💸", label:"Budget constraints",           sub:"Can't afford the session right now" },
  { id:"technical", icon:"💻", label:"Technical issues",             sub:"Platform or connectivity problems"  },
  { id:"other",     icon:"✏️", label:"Other reason",                 sub:"I'll describe it below"            },
];

function CancelModal({ session, onConfirm, onClose }) {
  const policy     = getCancelPolicy(session.hoursLeft);
  const refundAmt  = Math.floor(session.price * policy.pct / 100);
  const [step, setStep]       = useState("reason");   // reason | confirm | done
  const [reason, setReason]   = useState(null);
  const [otherTxt, setOther]  = useState("");
  

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const canProceed = reason && (reason !== "other" || otherTxt.trim().length > 3);

  const handleConfirm = () => {
    setStep("done");
    setTimeout(() => {
      onConfirm(session.id);
      onClose();
    }, 1900);
  };
  return (
    <div className="modal-overlay" style={{ zIndex: 500 }} onClick={e => e.target === e.currentTarget && step !== "done" && onClose()}>
      <div className="modal-box" style={{ maxWidth: 480, animation: "scaleIn .38s cubic-bezier(.22,1,.36,1)" }}>

        {/* ── Step: done (success animation) ── */}
        {step === "done" && (
          <div style={{ padding:"52px 32px", textAlign:"center", animation:"fadeIn .4s ease" }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom:20 }}>
              <circle cx="28" cy="28" r="27" stroke="rgba(248,113,113,.25)" strokeWidth="1"/>
              <circle cx="28" cy="28" r="27" stroke="var(--red)" strokeWidth="1.5"
                strokeDasharray="170" strokeDashoffset="170"
                style={{ animation:"checkmark .7s ease forwards" }}/>
              <line x1="20" y1="20" x2="36" y2="36" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"
                style={{ strokeDasharray:23, strokeDashoffset:23, animation:"checkmark .5s ease .15s forwards" }}/>
              <line x1="36" y1="20" x2="20" y2="36" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"
                style={{ strokeDasharray:23, strokeDashoffset:23, animation:"checkmark .5s ease .25s forwards" }}/>
            </svg>
            <div className="serif" style={{ fontSize:26, fontWeight:500, marginBottom:10, color:"var(--text)" }}>
              Session Cancelled
            </div>
            <div style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, maxWidth:300, margin:"0 auto" }}>
              {refundAmt > 0
                ? <>₹{refundAmt.toLocaleString("en-IN")} refund will be credited within <span style={{ color:"var(--gold-lt)" }}>3–5 business days.</span></>
                : <>This session is non-refundable per our cancellation policy.</>
              }
            </div>
            <div style={{ marginTop:20, fontSize:11, color:"var(--muted2)", letterSpacing:".06em" }}>
              Removing from your schedule…
            </div>
          </div>
        )}

        {/* ── Step: reason ── */}
        {step === "reason" && (
          <>
            {/* Header */}
            <div style={{ padding:"24px 28px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:10, color:"var(--red)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:6 }}>
                  Step 1 of 2
                </div>
                <div className="serif" style={{ fontSize:22, fontWeight:500 }}>Why are you cancelling?</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>This helps mentors improve their sessions.</div>
              </div>
              <button onClick={onClose} style={{ width:30, height:30, border:"1px solid var(--border2)", borderRadius:2, background:"transparent", color:"var(--muted)", cursor:"none", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>✕</button>
            </div>

            {/* Session mini-card */}
            <div style={{ margin:"16px 28px", display:"flex", alignItems:"center", gap:12, padding:"12px 14px", background:"rgba(255,255,255,.03)", border:"1px solid var(--border)", borderRadius:3 }}>
              <div className="avatar" style={{ width:38, height:38, background:session.gradient, fontSize:13 }}>{session.initials}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500 }}>{session.mentorName}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{session.slot}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div className="serif" style={{ fontSize:17, color:"var(--gold-lt)" }}>₹{session.price.toLocaleString("en-IN")}</div>
                <div style={{ fontSize:10, color:policy.color, fontWeight:500 }}>{policy.refund}</div>
              </div>
            </div>

            {/* Reason grid */}
            <div style={{ padding:"0 28px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {CANCEL_REASONS.map(r => (
                <div key={r.id}
                  onClick={() => setReason(r.id)}
                  style={{
                    display:"flex", alignItems:"center", gap:10, padding:"11px 13px",
                    border:`1px solid ${reason===r.id?"var(--red)":"var(--border2)"}`,
                    borderRadius:3, cursor:"none", transition:"all .25s",
                    background: reason===r.id ? "rgba(248,113,113,.07)" : "transparent",
                  }}
                  onMouseEnter={e => { if(reason!==r.id) e.currentTarget.style.borderColor="rgba(248,113,113,.35)"; }}
                  onMouseLeave={e => { if(reason!==r.id) e.currentTarget.style.borderColor="var(--border2)"; }}
                >
                  <span style={{ fontSize:18, flexShrink:0 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:500, color: reason===r.id ? "var(--text)" : "var(--muted)", lineHeight:1.3 }}>{r.label}</div>
                    <div style={{ fontSize:10, color:"var(--muted2)", marginTop:1 }}>{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Other text area */}
            {reason === "other" && (
              <div style={{ padding:"0 28px 16px", animation:"fadeIn .3s ease" }}>
                <textarea
                  value={otherTxt}
                  onChange={e => setOther(e.target.value)}
                  placeholder="Please describe your reason…"
                  style={{
                    width:"100%", minHeight:80, background:"rgba(255,255,255,.04)",
                    border:"1px solid rgba(248,113,113,.3)", borderRadius:2,
                    color:"var(--text)", fontFamily:"'Outfit',sans-serif", fontSize:13,
                    padding:"12px 14px", outline:"none", resize:"vertical",
                    transition:"border-color .25s", lineHeight:1.6,
                  }}
                  onFocus={e => e.target.style.borderColor="var(--red)"}
                  onBlur={e => e.target.style.borderColor="rgba(248,113,113,.3)"}
                />
              </div>
            )}

            {/* Footer */}
            <div style={{ padding:"16px 28px 24px", display:"flex", gap:10, borderTop:"1px solid var(--border)" }}>
              <button className="btn-o" onClick={onClose} style={{ flex:1, justifyContent:"center" }}>Keep Session</button>
              <button
                className="btn-red"
                onClick={() => canProceed && setStep("confirm")}
                style={{ flex:1, justifyContent:"center", opacity: canProceed ? 1 : 0.38, pointerEvents: canProceed ? "auto" : "none" }}>
                Continue →
              </button>
            </div>
          </>
        )}

        {/* ── Step: confirm ── */}
        {step === "confirm" && (
          <>
            <div style={{ padding:"24px 28px 18px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:14 }}>
              <button onClick={() => setStep("reason")} style={{ width:30, height:30, border:"1px solid var(--border2)", borderRadius:2, background:"transparent", color:"var(--muted)", cursor:"none", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>←</button>
              <div>
                <div style={{ fontSize:10, color:"var(--red)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:4 }}>Step 2 of 2</div>
                <div className="serif" style={{ fontSize:22, fontWeight:500 }}>Confirm cancellation</div>
              </div>
            </div>

            <div style={{ padding:"20px 28px" }}>
              {/* Selected reason */}
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"rgba(248,113,113,.05)", border:"1px solid rgba(248,113,113,.2)", borderRadius:3, marginBottom:20 }}>
                <span style={{ fontSize:18 }}>{CANCEL_REASONS.find(r=>r.id===reason)?.icon}</span>
                <div>
                  <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:".06em", marginBottom:2 }}>REASON SELECTED</div>
                  <div style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>
                    {reason === "other" ? otherTxt : CANCEL_REASONS.find(r=>r.id===reason)?.label}
                  </div>
                </div>
              </div>

              {/* Refund summary */}
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:"var(--muted)", letterSpacing:".08em", textTransform:"uppercase", marginBottom:12 }}>Cancellation Summary</div>
                {[
                  { label:"Session with",    val:session.mentorName },
                  { label:"Scheduled for",   val:session.slot },
                  { label:"Amount paid",     val:`₹${session.price.toLocaleString("en-IN")}` },
                  { label:"Refund amount",   val:`₹${refundAmt.toLocaleString("en-IN")}`, color: policy.color },
                  { label:"Refund timeline", val: refundAmt>0 ? "3–5 business days" : "No refund applicable" },
                ].map((row,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom: i<4 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ fontSize:12, color:"var(--muted)" }}>{row.label}</span>
                    <span style={{ fontSize:12, fontWeight:500, color: row.color || "var(--text)" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* Warning */}
              <div style={{ padding:"12px 14px", background:"rgba(248,113,113,.06)", border:"1px solid rgba(248,113,113,.18)", borderRadius:3, marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
                <span style={{ fontSize:16, flexShrink:0 }}>⚠</span>
                <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>
                  This action <span style={{ color:"var(--red)", fontWeight:600 }}>cannot be undone.</span> The session slot will be released and the mentor will be notified immediately.
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-o" onClick={() => setStep("reason")} style={{ flex:1, justifyContent:"center" }}>← Go Back</button>
                <button className="btn-red" onClick={handleConfirm} style={{ flex:1, justifyContent:"center" }}>
                  Confirm Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Booked Sessions Panel ────────────────────────────────────────────────────
function SessionsPanel({ sessions, onClose, onCancel }) {
  const [cancelTarget, setCancelTarget] = useState(null);

  return (
    <>
      <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.5)",backdropFilter:"blur(6px)",zIndex:299 }} onClick={onClose}/>
      <div className="sessions-panel">
        {/* Header */}
        <div style={{ padding:"28px 24px 20px",borderBottom:"1px solid rgba(201,169,110,.15)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:11,color:"var(--gold)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:4 }}>My Schedule</div>
            <div className="serif" style={{ fontSize:24,fontWeight:500 }}>Booked Sessions</div>
          </div>
          <button onClick={onClose} style={{ width:32,height:32,border:"1px solid var(--border2)",borderRadius:2,background:"transparent",color:"var(--muted)",cursor:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>✕</button>
        </div>

        {/* Stats row */}
        <div style={{ display:"flex",padding:"16px 24px",gap:12,borderBottom:"1px solid var(--border)" }}>
          {[
            { label:"Total",    val:sessions.length, color:"var(--text)"  },
            { label:"Upcoming", val:sessions.filter(s=>s.status==="confirmed").length, color:"var(--green)" },
            { label:"Spent",    val:"₹"+sessions.reduce((a,s)=>a+s.price,0).toLocaleString("en-IN"), color:"var(--gold-lt)" },
          ].map((s,i) => (
            <div key={i} className="stat-mini" style={{ flex:1 }}>
              <div style={{ fontSize:11,color:"var(--muted)",letterSpacing:".07em",marginBottom:4 }}>{s.label}</div>
              <div className="serif" style={{ fontSize:20,fontWeight:400,color:s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* List */}
        <div style={{ padding:"20px 24px",overflowY:"auto",maxHeight:"calc(100vh - 220px)" }}>
          {sessions.length === 0 ? (
            <div style={{ textAlign:"center",padding:"60px 20px" }}>
              <div className="serif" style={{ fontSize:48,color:"rgba(201,169,110,.1)",marginBottom:12 }}>◈</div>
              <div style={{ fontSize:14,color:"var(--muted)" }}>No sessions booked yet.</div>
              <div style={{ fontSize:12,color:"var(--muted2)",marginTop:6 }}>Browse mentors and book your first session.</div>
            </div>
          ) : (
            <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {sessions.map((s,i) => {
                const policy = getCancelPolicy(s.hoursLeft);
                return (
                  <div key={s.id} className="session-card" style={{ animation:`cardIn .5s cubic-bezier(.22,1,.36,1) ${i*.06}s both` }}>
                    <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:12 }}>
                      <div className="avatar" style={{ width:40,height:40,background:s.gradient,fontSize:13 }}>{s.initials}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
                          <span style={{ fontSize:13,fontWeight:600 }}>{s.mentorName}</span>
                          <span className={`badge ${s.status==="confirmed"?"badge-green":"badge-red"}`} style={{ fontSize:9 }}>{s.status}</span>
                        </div>
                        <div style={{ fontSize:11,color:"var(--gold)",fontWeight:500 }}>{s.expertise}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div className="serif" style={{ fontSize:18,color:"var(--gold-lt)",fontWeight:400 }}>₹{s.price.toLocaleString("en-IN")}</div>
                        <div style={{ fontSize:10,color:"var(--muted2)",marginTop:1 }}>TXN: {s.txId}</div>
                      </div>
                    </div>

                    <div style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"rgba(255,255,255,.03)",borderRadius:2,marginBottom:10 }}>
                      <span style={{ fontSize:12 }}>🗓</span>
                      <span style={{ fontSize:12,color:"var(--text)" }}>{s.slot}</span>
                      <span style={{ marginLeft:"auto",fontSize:11,color:"var(--muted)",display:"flex",alignItems:"center",gap:4 }}>
                        <span style={{ width:5,height:5,borderRadius:"50%",background:s.hoursLeft>12?"var(--green)":s.hoursLeft>6?"var(--gold)":"var(--red)",display:"inline-block" }}/>
                        {s.hoursLeft}h away
                      </span>
                    </div>

                    {s.status === "confirmed" && (
                      <>
                        <div style={{ fontSize:10,color:policy.color,padding:"4px 8px",background:`${policy.color}0F`,border:`1px solid ${policy.color}20`,borderRadius:2,marginBottom:8,display:"inline-flex",alignItems:"center",gap:5 }}>
                          <span>ℹ</span> Cancel now → {policy.refund}
                        </div>
                        <button className="btn-red" onClick={() => setCancelTarget(s)} style={{ width:"100%",justifyContent:"center",padding:"8px" }}>
                          Cancel Session
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {cancelTarget && (
        <CancelModal
          session={cancelTarget}
          onConfirm={id => onCancel(id)}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </>
  );
}

// ─── Mentor Profile Modal ─────────────────────────────────────────────────────
function MentorModal({ mentor, onClose, onPay }) {
  const [tab, setTab]           = useState("about");
  const [selectedSlot, setSlot] = useState(null);
  const [showPay, setShowPay]   = useState(false);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  return (
    <>
      <div className="modal-overlay" onClick={e => e.target===e.currentTarget && !showPay && onClose()}>
        <div className="modal-box" style={{ animation:"scaleIn .4s cubic-bezier(.22,1,.36,1)" }}>
          {/* Header */}
          <div style={{ padding:"28px 32px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"flex-start",gap:20,position:"relative" }}>
            <div className="avatar" style={{ width:68,height:68,background:mentor.gradient,fontSize:22 }}>{mentor.initials}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
                <h2 className="serif" style={{ fontSize:24,fontWeight:500 }}>{mentor.name}</h2>
                <span className={`badge ${mentor.available?"badge-green":"badge-muted"}`}>
                  <span style={{ width:5,height:5,borderRadius:"50%",background:mentor.available?"var(--green)":"var(--muted)",display:"inline-block" }}/>
                  {mentor.available?"Available":"Busy"}
                </span>
              </div>
              <div style={{ fontSize:13,color:"var(--muted)",marginBottom:10 }}>{mentor.title}</div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {mentor.tags.map(t => (
                  <span key={t} style={{ fontSize:10,padding:"3px 10px",border:"1px solid rgba(201,169,110,.18)",borderRadius:2,color:"var(--gold)",letterSpacing:".06em",background:"rgba(201,169,110,.04)" }}>{t}</span>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{ position:"absolute",top:20,right:20,width:32,height:32,border:"1px solid var(--border2)",borderRadius:2,background:"transparent",color:"var(--muted)",cursor:"none",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)"; }}>✕</button>
          </div>

          {/* Stats */}
          <div style={{ padding:"16px 32px",display:"flex",gap:12,borderBottom:"1px solid var(--border)" }}>
            {[
              { label:"Rating",      val:`${mentor.rating} ★`, gold:true  },
              { label:"Reviews",     val:mentor.reviews            },
              { label:"Sessions",    val:`${mentor.sessions}+`    },
              { label:"Per Session", val:`₹${mentor.price.toLocaleString("en-IN")}`, gold:true },
            ].map((s,i) => (
              <div key={i} className="stat-mini" style={{ flex:1 }}>
                <div style={{ fontSize:10,color:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:6 }}>{s.label}</div>
                <div className="serif" style={{ fontSize:20,fontWeight:400,color:s.gold?"var(--gold-lt)":"var(--text)" }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex",borderBottom:"1px solid var(--border)",padding:"0 20px" }}>
            {["about","book"].map(t => (
              <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>
                {t==="about"?"About":"Book Session"}
              </button>
            ))}
          </div>

          {tab === "about" && (
            <div className="modal-section">
              <p style={{ fontSize:14,color:"var(--muted)",lineHeight:1.85,fontWeight:300 }}>{mentor.about}</p>
              <div style={{ marginTop:20,padding:"14px 18px",border:"1px solid rgba(201,169,110,.15)",borderRadius:3,background:"rgba(201,169,110,.04)" }}>
                <div style={{ fontSize:10,color:"var(--gold)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6 }}>Expertise Area</div>
                <div style={{ fontSize:13,color:"var(--text)",fontWeight:500 }}>{mentor.expertise} · {mentor.category}</div>
              </div>
            </div>
          )}

          {tab === "book" && (
            <div className="modal-section">
              <div style={{ marginBottom:20 }}>
                <div style={{ fontSize:11,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12 }}>Available Time Slots</div>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {mentor.slots.map(s => (
                    <button key={s} className={`slot-btn ${selectedSlot===s?"selected":""}`} onClick={() => setSlot(s)}>{s}</button>
                  ))}
                </div>
              </div>
              {selectedSlot && (
                <div style={{ padding:"14px 18px",background:"rgba(201,169,110,.06)",border:"1px solid rgba(201,169,110,.2)",borderRadius:3,marginBottom:20,animation:"fadeIn .3s ease" }}>
                  <div style={{ fontSize:10,color:"var(--muted)",marginBottom:4,letterSpacing:".08em",textTransform:"uppercase" }}>Selected</div>
                  <div style={{ fontSize:14,color:"var(--gold-lt)",fontWeight:500 }}>{selectedSlot} · 60 min · ₹{mentor.price.toLocaleString("en-IN")}</div>
                </div>
              )}
              <button className="btn-g" onClick={() => selectedSlot && setShowPay(true)} style={{ opacity:selectedSlot?1:.5 }}>
                Proceed to Payment ₹{mentor.price.toLocaleString("en-IN")}
              </button>
              <p style={{ fontSize:11,color:"var(--muted2)",textAlign:"center",marginTop:10,letterSpacing:".04em" }}>
                Secure payment · Free reschedule up to 24h prior
              </p>
            </div>
          )}
        </div>
      </div>

      {showPay && (
        <PaymentModal
          mentor={mentor}
          slot={selectedSlot}
          onSuccess={() => onPay(mentor, selectedSlot)}
          onClose={() => setShowPay(false)}
        />
      )}
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background:"linear-gradient(145deg,rgba(26,22,18,.9),rgba(16,14,12,.95))",border:"1px solid var(--border)",borderRadius:4,padding:"28px 24px" }}>
      {[52,40,28,28,20,44].map((h,i) => (
        <div key={i} className="shimmer" style={{ height:h,borderRadius:2,marginBottom:12,width:i===0?"55%":i===1?"75%":"100%",background:"rgba(255,255,255,.04)" }}/>
      ))}
    </div>
  );
}

// ─── Mentor Card ──────────────────────────────────────────────────────────────
function MentorCard({ mentor, index, onClick }) {
  return (
    <div className="mentor-card card-in" style={{ animationDelay:`${index*0.07}s` }} onClick={() => onClick(mentor)}>
      <div style={{ display:"flex",alignItems:"flex-start",gap:14,marginBottom:16 }}>
        <div className="avatar" style={{ width:50,height:50,background:mentor.gradient,fontSize:16 }}>{mentor.initials}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
            <h3 style={{ fontSize:15,fontWeight:600,letterSpacing:"-.01em" }}>{mentor.name}</h3>
          </div>
          <div style={{ fontSize:12,color:"var(--gold)",fontWeight:500,marginBottom:1 }}>{mentor.expertise}</div>
          <div style={{ fontSize:11,color:"var(--muted)",letterSpacing:".01em" }}>{mentor.title}</div>
        </div>
        <span className={`badge ${mentor.available?"badge-green":"badge-muted"}`} style={{ marginTop:2,flexShrink:0 }}>
          <span style={{ width:5,height:5,borderRadius:"50%",background:mentor.available?"var(--green)":"var(--muted)",display:"inline-block" }}/>
          {mentor.available?"Live":"Busy"}
        </span>
      </div>

      <p style={{ fontSize:13,color:"var(--muted)",lineHeight:1.7,marginBottom:14,fontWeight:300,minHeight:34 }}>{mentor.bio}</p>

      <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:16 }}>
        {mentor.tags.slice(0,3).map(t => (
          <span key={t} style={{ fontSize:10,padding:"3px 9px",border:"1px solid var(--border2)",borderRadius:2,color:"var(--muted3)",letterSpacing:".04em" }}>{t}</span>
        ))}
      </div>

      <div style={{ height:1,background:"linear-gradient(90deg,var(--border),transparent)",marginBottom:14 }}/>

      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16 }}>
        <div style={{ display:"flex",alignItems:"center",gap:5 }}>
          <span style={{ color:"var(--gold)",fontSize:12 }}>{'★'.repeat(Math.floor(mentor.rating))}</span>
          <span style={{ fontSize:13,fontWeight:600 }}>{mentor.rating}</span>
          <span style={{ fontSize:11,color:"var(--muted)" }}>({mentor.reviews})</span>
        </div>
        <div>
          <span className="serif" style={{ fontSize:20,fontWeight:500,color:"var(--gold-lt)" }}>₹{mentor.price.toLocaleString("en-IN")}</span>
          <span style={{ fontSize:11,color:"var(--muted)" }}> / session</span>
        </div>
      </div>

      <button className="btn-g" onClick={e => { e.stopPropagation(); onClick(mentor); }}>
        View Profile ↗
      </button>
      <div className="bottom-bar"/>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All Categories");
  const [price,    setPrice]    = useState("Any Price");
  const [rating,   setRating]   = useState("Any Rating");
  const [sort,     setSort]     = useState("Featured");
  const [selected, setSelected] = useState(null);
  const [toast,    setToast]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [vis,      setVis]      = useState(false);
  const [view,     setView]     = useState("grid");
  const [sessions, setSessions] = useState([]);
  const [showPanel,setPanel]    = useState(false);
  const [lightMode, setLightMode] = useState(false);
  
  const toggleLightMode = () => {
    setLightMode(!lightMode);
    if (!lightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  useEffect(() => { setTimeout(() => setLoading(false), 900); }, []);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);

  // ── Listen for mentor-initiated cancellations from Mentor Dashboard ──
  useEffect(() => {
    const handle = (e) => {
      const msg = e.detail || e.data;
      if (!msg) return;
      if (msg.type === "mentora:mentor_cancel") {
        const { mentorName, slot, refundAmt } = msg.payload;
        setSessions(prev => prev.filter(s => !(s.mentorName === mentorName && s.slot === slot)));
        setToast({ icon:"📩", title:mentorName + " cancelled your session", body:"Full refund of ₹" + (refundAmt||0).toLocaleString("en-IN") + " initiated.", red:true });
        setPanel(true);
      }
    };
    window.addEventListener("mentora_bus", handle);
    let bc;
    try { 
        bc && bc.close(); 
      } catch {
        // ignore close errors
      }
      
      return () => {
        window.removeEventListener("mentora_bus", handle);
        try {
          bc?.close();
        } catch {
          // ignore close errors
        }
      };
      }, []);
  const filtered = MENTORS.filter(m => {
    const q = search.toLowerCase();
    const mQ = !q || m.name.toLowerCase().includes(q) || m.expertise.toLowerCase().includes(q) || m.tags.some(t => t.toLowerCase().includes(q)) || m.title.toLowerCase().includes(q);
    const mC = category === "All Categories" || m.category === category;
    const mP = price === "Any Price" || (price==="Under ₹1,000"&&m.price<1000) || (price==="₹1,000 – ₹1,500"&&m.price>=1000&&m.price<=1500) || (price==="Above ₹1,500"&&m.price>1500);
    const mR = rating === "Any Rating" || (rating==="5.0 ★"&&m.rating>=5.0) || (rating==="4.8+ ★"&&m.rating>=4.8) || (rating==="4.5+ ★"&&m.rating>=4.5);
    return mQ && mC && mP && mR;
  }).sort((a,b) => {
    if (sort==="Highest Rated")  return b.rating - a.rating;
    if (sort==="Price: Low–High") return a.price - b.price;
    if (sort==="Most Reviews")   return b.reviews - a.reviews;
    return 0;
  });

  const handlePay = (mentor, slot) => {
    const txId = "MNT" + Math.random().toString(36).slice(2,9).toUpperCase();
    const hoursLeft = Math.floor(Math.random() * 40) + 3; // 3–43 hours for demo
    const newSession = {
      id: Date.now(), mentorName: mentor.name, initials: mentor.initials,
      expertise: mentor.expertise, gradient: mentor.gradient,
      slot, price: mentor.price, status: "confirmed",
      txId, hoursLeft,
    };
    setSessions(prev => [newSession, ...prev]);
    setToast({ icon:"✦", title:"Session Booked!", body:`${mentor.name} · ${slot}` });
    setSelected(null);
  };

  const handleCancel = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    setToast({ icon:"✕", title:"Session Removed", body:"Refund will be processed per our policy.", red:true });
  };

  const clearFilters = () => { setSearch(""); setCategory("All Categories"); setPrice("Any Price"); setRating("Any Rating"); setSort("Featured"); };
  const hasFilters   = search || category!=="All Categories" || price!=="Any Price" || rating!=="Any Rating";
  const confirmedCount = sessions.filter(s=>s.status==="confirmed").length;

  return (
    <>
      <style>{STYLES}</style>
      <Cursor/>

      {/* ── Nav ── */}
      <nav className="nav-wrap" style={{ animation:"fadeIn .6s ease" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",gap:20,height:64 }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
            <div style={{ width:28,height:28,border:"1px solid var(--gold-dk)",display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(201,169,110,.08)" }}>
              <span className="serif" style={{ color:"var(--gold)",fontSize:16,fontWeight:500,lineHeight:1 }}>M</span>
            </div>
            <span className="serif" style={{ fontSize:18,fontWeight:500,letterSpacing:".06em",color:"var(--text)" }}>MENTORA</span>
          </div>

          <div style={{ flex:1,position:"relative",maxWidth:460 }}>
            <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"var(--muted)",fontSize:15,pointerEvents:"none" }}>⌕</span>
            <input className="search-input" placeholder="Search mentors, skills, topics…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>

          <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:14 }}>
            <div className="hide-mob" style={{ display:"flex",alignItems:"center",gap:7 }}>
              <span style={{ width:7,height:7,borderRadius:"50%",background:"var(--green)",boxShadow:"0 0 8px var(--green)" }}/>
              <span style={{ fontSize:11,color:"var(--muted)",letterSpacing:".05em" }}>{MENTORS.filter(m=>m.available).length} mentors online</span>
            </div>
            <div style={{ width:1,height:22,background:"var(--border2)" }} className="hide-mob"/>

            <button onClick={toggleLightMode} style={{ width:40,height:40,border:"1px solid var(--border)",background:"rgba(201,169,110,.08)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",cursor:"none",transition:"all .3s",fontSize:18 }} title="Toggle light mode">
              {lightMode ? "🌙" : "☀️"}
            </button>

            {/* Sessions button */}
            <button onClick={() => setPanel(true)} style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 14px",border:`1px solid ${confirmedCount>0?"rgba(201,169,110,.3)":"var(--border2)"}`,borderRadius:2,background:confirmedCount>0?"rgba(201,169,110,.07)":"transparent",color:confirmedCount>0?"var(--gold)":"var(--muted)",cursor:"none",fontSize:12,transition:"all .25s",fontFamily:"'Outfit',sans-serif",letterSpacing:".05em" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="var(--gold-dk)"; e.currentTarget.style.color="var(--gold)"; }}
              onMouseLeave={e => { if(!confirmedCount){e.currentTarget.style.borderColor="var(--border2)"; e.currentTarget.style.color="var(--muted)";} }}>
              🗓 My Sessions
              {confirmedCount > 0 && (
                <span style={{ width:18,height:18,borderRadius:"50%",background:"var(--gold)",color:"#0A0A0A",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>{confirmedCount}</span>
              )}
            </button>

            <div style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold-dk),var(--gold))",display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid rgba(201,169,110,.3)",cursor:"none",flexShrink:0 }}>
              <span className="serif" style={{ fontSize:14,fontWeight:500,color:"#0A0A0A" }}>A</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth:1200,margin:"0 auto",padding:"48px 32px 80px",position:"relative",zIndex:1 }}>
        <div className="orb" style={{ width:600,height:600,background:"radial-gradient(circle,rgba(201,169,110,.06),transparent 70%)",top:0,right:-100 }}/>

        {/* Header */}
        <div style={{ marginBottom:40,opacity:vis?1:0,transform:vis?"none":"translateY(24px)",transition:"all .8s cubic-bezier(.22,1,.36,1) .1s" }}>
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
            <div>
              <span className="tag-pill" style={{ marginBottom:14,display:"inline-flex" }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"var(--gold)" }}/>
                Mentor Discovery
              </span>
              <h1 className="serif" style={{ fontSize:"clamp(32px,4.5vw,54px)",fontWeight:400,letterSpacing:"-.02em",lineHeight:1.1,marginTop:4 }}>
                Find Your <span className="gold-text" style={{ fontStyle:"italic" }}>Mentor</span>
              </h1>
              <p style={{ fontSize:14,color:"var(--muted)",marginTop:10,fontWeight:300,lineHeight:1.7 }}>
                Connect with verified experts for personalized one-on-one guidance.
              </p>
            </div>
            <div style={{ display:"flex",gap:8 }}>
              {["grid","list"].map(v => (
                <button key={v} onClick={() => setView(v)} style={{ width:34,height:34,border:`1px solid ${view===v?"var(--gold-dk)":"var(--border2)"}`,borderRadius:2,background:view===v?"rgba(201,169,110,.1)":"transparent",color:view===v?"var(--gold)":"var(--muted)",cursor:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,transition:"all .25s" }}>
                  {v==="grid"?"⊞":"☰"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginBottom:28,opacity:vis?1:0,transform:vis?"none":"translateY(16px)",transition:"all .8s cubic-bezier(.22,1,.36,1) .25s" }}>
          <div style={{ padding:"16px 20px",background:"linear-gradient(145deg,rgba(26,22,18,.7),rgba(16,14,12,.8))",border:"1px solid var(--border)",borderRadius:4 }}>
            <div className="filter-row">
              <span style={{ fontSize:10,color:"var(--muted)",letterSpacing:".12em",textTransform:"uppercase",flexShrink:0 }}>Filter</span>
              <div style={{ width:1,height:18,background:"var(--border2)",flexShrink:0 }}/>
              {[
                { val:category, set:setCategory, opts:CATEGORIES },
                { val:price,    set:setPrice,    opts:PRICES     },
                { val:rating,   set:setRating,   opts:RATINGS    },
              ].map((f,i) => (
                <select key={i} className="filter-select" value={f.val} onChange={e => f.set(e.target.value)}>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
              <div style={{ width:1,height:18,background:"var(--border2)",flexShrink:0 }}/>
              <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)} style={{ minWidth:140 }}>
                {SORTS.map(o => <option key={o}>{o}</option>)}
              </select>
              {hasFilters && (
                <button onClick={clearFilters} className="btn-o" style={{ flexShrink:0,padding:"8px 14px" }}>✕ Clear</button>
              )}
              <div style={{ marginLeft:"auto",flexShrink:0 }}>
                <span style={{ fontSize:12,color:"var(--muted)" }}>
                  <span style={{ color:"var(--gold-lt)",fontWeight:600 }}>{filtered.length}</span> results
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        {hasFilters && (
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,animation:"fadeIn .3s ease" }}>
            {[
              category!=="All Categories" && category,
              price!=="Any Price" && price,
              rating!=="Any Rating" && rating,
              search && `"${search}"`,
            ].filter(Boolean).map(chip => (
              <span key={chip} style={{ fontSize:11,padding:"4px 12px",border:"1px solid rgba(201,169,110,.25)",borderRadius:100,color:"var(--gold)",background:"rgba(201,169,110,.06)",letterSpacing:".04em" }}>◆ {chip}</span>
            ))}
          </div>
        )}

        {/* Grid / List */}
        {loading ? (
          <div className="grid-3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
            {Array.from({length:6}).map((_,i) => <SkeletonCard key={i}/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center",padding:"80px 24px",animation:"fadeIn .5s ease" }}>
            <div className="serif" style={{ fontSize:52,color:"rgba(201,169,110,.12)",marginBottom:14 }}>◈</div>
            <h3 className="serif" style={{ fontSize:26,fontWeight:400,color:"var(--muted)",marginBottom:10 }}>No mentors found</h3>
            <p style={{ fontSize:14,color:"var(--muted2)",marginBottom:22 }}>Try adjusting your filters or search.</p>
            <button className="btn-o" onClick={clearFilters}>Clear all filters</button>
          </div>
        ) : view === "grid" ? (
          <div className="grid-3" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20 }}>
            {filtered.map((m,i) => <MentorCard key={m.id} mentor={m} index={i} onClick={setSelected}/>)}
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {filtered.map((m,i) => (
              <div key={m.id} className="mentor-card card-in" style={{ animationDelay:`${i*0.055}s`,display:"flex",alignItems:"center",gap:20,padding:"18px 22px" }} onClick={() => setSelected(m)}>
                <div className="avatar" style={{ width:46,height:46,background:m.gradient,fontSize:15,flexShrink:0 }}>{m.initials}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:2 }}>
                    <span style={{ fontSize:14,fontWeight:600 }}>{m.name}</span>
                    <span style={{ fontSize:11,color:"var(--gold)" }}>{m.expertise}</span>
                    <span className={`badge ${m.available?"badge-green":"badge-muted"}`} style={{ fontSize:9 }}>
                      <span style={{ width:4,height:4,borderRadius:"50%",background:m.available?"var(--green)":"var(--muted)",display:"inline-block" }}/>
                      {m.available?"Live":"Busy"}
                    </span>
                  </div>
                  <div style={{ fontSize:12,color:"var(--muted)",fontWeight:300,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{m.bio}</div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:20,flexShrink:0 }}>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:11,color:"var(--gold)",fontWeight:500 }}>★ {m.rating}</div>
                    <div style={{ fontSize:10,color:"var(--muted)" }}>{m.reviews} reviews</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div className="serif" style={{ fontSize:17,fontWeight:500,color:"var(--gold-lt)" }}>₹{m.price.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize:10,color:"var(--muted)" }}>per session</div>
                  </div>
                  <button className="btn-g" style={{ width:"auto",padding:"9px 18px",fontSize:10 }} onClick={e => { e.stopPropagation(); setSelected(m); }}>View ↗</button>
                </div>
                <div className="bottom-bar"/>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div style={{ marginTop:48,textAlign:"center",paddingTop:28,borderTop:"1px solid var(--border)" }}>
            <p style={{ fontSize:12,color:"var(--muted2)",letterSpacing:".06em" }}>
              Showing <span style={{ color:"var(--gold)" }}>{filtered.length}</span> of <span style={{ color:"var(--gold)" }}>{MENTORS.length}</span> mentors
            </p>
          </div>
        )}
      </main>

      {/* ── Mentor modal ── */}
      {selected && <MentorModal mentor={selected} onClose={() => setSelected(null)} onPay={handlePay}/>}

      {/* ── Sessions panel ── */}
      {showPanel && <SessionsPanel sessions={sessions} onClose={() => setPanel(false)} onCancel={handleCancel}/>}

      {/* ── Toast ── */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)}/>}
    </>
  );
}
