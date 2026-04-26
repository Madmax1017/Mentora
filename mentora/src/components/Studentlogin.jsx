import React, { useState, useRef } from 'react';

const MentoraPremiumAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const btnRef = useRef(null);

  // Subtle mouse-tracking gradient effect for the primary button
  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty('--mouse-x', `${x}px`);
    btnRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("role", "student");
    window.location.href = "/student";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans selection:bg-[#c5a059]/30">
      
      {/* Dynamic Background: Slow Pulsing Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c5a059]/5 blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8e794f]/10 blur-[120px] animate-pulse [animation-delay:2s]" />

      {/* Auth Card with subtle border-glow */}
      <div className="relative z-10 w-full max-w-md p-10 sm:p-14 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-3 py-1 border border-[#c5a059]/20 rounded-full">
            <span className="text-[#c5a059] font-serif italic text-xs tracking-[0.3em] uppercase">Mentora</span>
          </div>
          <h1 className="text-3xl font-light text-white tracking-tight mb-3">
            Welcome Back, <span className="italic font-serif text-[#e5d5b7]">Future Achiever</span>
          </h1>
          <p className="text-gray-500 text-xs font-light tracking-widest uppercase">The elite path to mastery starts here.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          {/* Email Input with focus-glow */}
          <div className="group space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-[#c5a059] transition-colors duration-300">Identity</label>
            <input 
              type="email" 
              required
              className="w-full bg-transparent border-b border-white/10 py-3 text-white transition-all duration-500 focus:outline-none focus:border-[#c5a059] placeholder:text-gray-700"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="group space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-[#c5a059] transition-colors duration-300">Access Key</label>
            <input 
              type="password" 
              required
              className="w-full bg-transparent border-b border-white/10 py-3 text-white transition-all duration-500 focus:outline-none focus:border-[#c5a059] placeholder:text-gray-700"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Action Button: Spotlight Effect */}
          <button 
            ref={btnRef}
            onMouseMove={handleMouseMove}
            type="submit"
            className="group relative w-full overflow-hidden bg-[#111] border border-[#c5a059]/30 py-4 text-[#c5a059] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:text-black"
          >
            {/* The Gradient "Spotlight" layer */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), #c5a059, transparent 40%)`,
              }}
            />
            <span className="relative z-10">Enter Platform</span>
          </button>
        </form>

        {/* Divider with Gradient Lines */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em]"><span className="bg-[#0a0a0a] px-4 text-gray-600">Connect Via</span></div>
        </div>

        {/* Social Links with Scale Hover */}
        <div className="grid grid-cols-2 gap-6">
          <button className="flex items-center justify-center py-3 border border-white/5 hover:border-[#c5a059]/30 transition-all duration-700 hover:bg-white/[0.02] group">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">LinkedIn</span>
          </button>
          <button className="flex items-center justify-center py-3 border border-white/5 hover:border-[#c5a059]/30 transition-all duration-700 hover:bg-white/[0.02] group">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">Google</span>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-[#c5a059] transition-all duration-300 border-b border-transparent hover:border-[#c5a059]/30 pb-1">
            Create Student Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default MentoraPremiumAuth;