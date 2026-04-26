import React, { useState, useRef } from 'react';

const MentorAuth = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    expertise: 'Software Architecture'
  });

  const btnRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty('--mouse-x', `${x}px`);
    btnRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("role", "mentor");
    window.location.href = "/mentor";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030303] font-sans selection:bg-[#c5a059]/30 overflow-hidden text-white relative">
      
      {/* --- HYPNOTIC BACKGROUND ELEMENTS --- */}
      {/* Floating Gold Orb 1 */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#c5a059]/10 blur-[120px] rounded-full animate-[pulse_8s_infinite]" />
      {/* Floating Gold Orb 2 */}
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#8e794f]/10 blur-[100px] rounded-full animate-[pulse_10s_infinite_2s]" />
      
      {/* Subtle Animated Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#c5a059 1px, transparent 1px), linear-gradient(90deg, #c5a059 1px, transparent 1px)`, 
             backgroundSize: '80px 80px' 
           }} />

      {/* --- MAIN TWO-COLUMN CONTAINER --- */}
      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-6xl h-full md:h-[800px] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-1000">
        
        {/* LEFT SIDE: BRANDING & PRESTIGE */}
        <div className="w-full md:w-1/2 p-12 lg:p-20 flex flex-col justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
            <div className="relative z-10 animate-in slide-in-from-left-10 duration-1000 delay-300">
                <p className="text-[#c5a059] font-serif italic tracking-[0.5em] uppercase text-[10px] mb-6">Established 2026</p>
                <h1 className="text-6xl lg:text-8xl font-serif leading-none mb-6">
                    Share Your <br />
                    <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#c5a059] via-[#e5d5b7] to-[#c5a059] animate-gradient-x">Mastery</span>
                </h1>
                <div className="w-20 h-[2px] bg-gradient-to-r from-[#c5a059] to-transparent mb-10" />
                <p className="text-gray-400 text-lg font-light leading-relaxed max-w-sm">
                    Join an elite tier of mentors transforming the next generation of global leaders.
                </p>
            </div>
            {/* Visual background text */}
            <span className="absolute bottom-[-20px] left-[-20px] text-[150px] font-serif italic text-white/[0.02] select-none pointer-events-none">Expert</span>
        </div>

        {/* RIGHT SIDE: THE FORM */}
        <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative bg-gradient-to-b from-white/[0.02] to-transparent">
          
          <div className="max-w-md w-full mx-auto animate-in slide-in-from-right-10 duration-1000 delay-500">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-light tracking-tight text-white mb-2">Apply for Mentorship</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">Elevate your professional legacy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Eye-Catchy Input Box */}
              {[
                { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'Julian Voss' },
                { label: 'Professional Email', name: 'email', type: 'email', placeholder: 'voss@mentora.com' },
                { label: 'Security Key', name: 'password', type: 'password', placeholder: '••••••••' }
              ].map((field) => (
                <div key={field.name} className="group relative">
                  <label className="absolute -top-2.5 left-4 px-2 bg-[#080808] text-[9px] uppercase tracking-widest text-[#c5a059] z-20 group-focus-within:text-white transition-all">
                    {field.label}
                  </label>
                  <input 
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-sm tracking-wide focus:outline-none focus:border-[#c5a059] focus:bg-white/[0.07] focus:shadow-[0_0_20px_rgba(197,160,89,0.1)] transition-all duration-500 rounded-sm placeholder:text-gray-700"
                  />
                </div>
              ))}

              {/* Specialized Dropdown */}
              <div className="relative group">
                <label className="absolute -top-2.5 left-4 px-2 bg-[#080808] text-[9px] uppercase tracking-widest text-[#c5a059] z-20">Mastery Area</label>
                <select 
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/10 px-6 py-4 text-sm focus:outline-none focus:border-[#c5a059] appearance-none cursor-pointer transition-all duration-500 rounded-sm"
                >
                  <option className="bg-[#050505]" value="Software Architecture">Software Architecture</option>
                  <option className="bg-[#050505]" value="Venture Capital">Venture Capital</option>
                  <option className="bg-[#050505]" value="Product Leadership">Product Leadership</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#c5a059]"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" /></svg></div>
              </div>

              {/* THE ULTIMATE PREMIUM BUTTON */}
              <button 
                ref={btnRef}
                onMouseMove={handleMouseMove}
                type="submit"
                className="group relative w-full overflow-hidden bg-gradient-to-r from-[#c5a059] to-[#8e794f] py-5 rounded-sm transition-all duration-700 hover:shadow-[0_0_40px_rgba(197,160,89,0.4)] active:scale-95"
              >
                {/* Mouse Tracking Glare Layer */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/20"
                  style={{ background: `radial-gradient(100px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.4), transparent 100%)` }}
                />
                <span className="relative z-10 text-black text-[11px] font-black uppercase tracking-[0.4em] drop-shadow-sm">Initialize Membership</span>
              </button>
            </form>

            <p className="mt-10 text-center text-[10px] text-gray-600 tracking-[0.2em] uppercase">
              Already a member? <a href="#" className="text-white hover:text-[#c5a059] transition-all border-b border-white/10 ml-2">Secure Login</a>
            </p>
          </div>

        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 flex space-x-8 opacity-20 text-[9px] tracking-[0.5em] uppercase">
        <span className="hover:text-[#c5a059] transition-colors cursor-pointer">Security</span>
        <span className="hover:text-[#c5a059] transition-colors cursor-pointer">Protocol</span>
        <span className="hover:text-[#c5a059] transition-colors cursor-pointer">Support</span>
      </div>
    </div>
  );
};

export default MentorAuth;