import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Eye,
} from 'lucide-react';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('liam@bank.local');
  const [password, setPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      onLogin();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] font-sans text-slate-100 antialiased selection:bg-emerald-500/30">
      
      {/* ================= DYNAMIC GLOWING BACKGROUND ================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top Left Emerald Glow */}
        <div className="absolute -left-[10%] -top-[10%] h-[700px] w-[700px] rounded-full bg-emerald-600/20 blur-[120px]"></div>
        
        {/* Bottom Right Deep Blue Glow */}
        <div className="absolute -bottom-[10%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/20 blur-[150px]"></div>
        
        {/* Center Ambient Cyan Glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-900/20 blur-[120px]"></div>
      </div>
      {/* ============================================================= */}

      <div className="relative z-10 flex min-h-screen flex-col">
        
        {/* FLOATING NAVBAR (LIQUID GLASS) */}
        <div className="px-4 pt-6 sm:px-8">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold tracking-tight text-white drop-shadow-md">SecureBank</span>
            </div>

            <div className="hidden items-center gap-8 md:flex">
              <a href="#" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Home</a>
              <a href="#" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Careers</a>
              <a href="#" className="text-sm font-medium text-white/70 transition-colors hover:text-white">About</a>
              <a href="#" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Security</a>
            </div>

            <div className="hidden items-center gap-6 md:flex">
              <button onClick={onNavigateToRegister} className="text-sm font-medium text-white/70 transition-colors hover:text-white">Sign Up</button>
              <button className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                Login
              </button>
            </div>

            <button 
              className="text-white/70 hover:text-white focus:outline-none md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>
        </div>

        {/* HERO & LOGIN SECTION */}
        <main className="mx-auto flex-1 max-w-5xl px-4 py-16 sm:py-24 w-full">
          
          {/* THE MAIN LIQUID GLASS CARD */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 px-6 py-16 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:px-12 sm:py-20">
            
            {/* Subtle Dot Pattern overlay (top right) */}
            <div className="absolute right-0 top-0 -z-10 h-64 w-64 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.4) 1.5px, transparent 1.5px)', backgroundSize: '16px 16px', maskImage: 'radial-gradient(circle, black, transparent)' }}></div>

            <div className="mx-auto max-w-lg text-center">
             <h1 className="bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-5xl pb-2 leading-normal">
                Login
              </h1>
              <p className="mt-4 text-sm text-white/70">
                Welcome back! Please log in to access your account.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
                
                {/* Inputs (Side by side on desktop) */}
                <div className="flex w-full flex-col gap-4 sm:flex-row">
                  <div className="flex-1">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Email"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-5 py-3.5 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-5 pr-10 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                    <Eye className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  </div>
                </div>

                <a href="#" className="text-sm font-medium text-white/60 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-emerald-400">
                  Forgot Password?
                </a>

                <div className="w-full max-w-sm space-y-4">
                 <button
                type="submit"
                className="w-full flex h-[50px] items-center justify-center rounded-full bg-emerald-500 text-sm font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#020617]"
              >
                Login
              </button>
                  <button
                    type="button"
                    onClick={onNavigateToRegister}
                    className="w-full rounded-full border border-white/10 bg-white/5 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#020617]"
                  >
                    Sign Up
                  </button>
                </div>

                {/* Social Login */}
                <div className="w-full max-w-sm pt-4">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <span className="relative bg-slate-900/80 px-4 text-xs font-medium text-white/50 backdrop-blur-xl rounded-full">Or Continue with</span>
                  </div>

                  <div className="mt-6 flex justify-center gap-4">
                    <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span className="text-lg font-bold">G</span>
                    </button>
                    <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span className="text-lg font-bold">f</span>
                    </button>
                    <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <span className="text-sm font-bold">in</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}