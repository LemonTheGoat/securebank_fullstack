import React, { useState } from 'react';
import { ShieldCheck, Mail, Phone, Eye, User, ArrowRight } from 'lucide-react';

export default function Register({ onNavigateToLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#020617] font-sans text-slate-100 antialiased selection:bg-emerald-500/30 flex items-center justify-center p-4">
      
      {/* ================= DYNAMIC GLOWING BACKGROUND ================= */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[700px] w-[700px] rounded-full bg-emerald-600/20 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] h-[800px] w-[800px] rounded-full bg-indigo-600/20 blur-[150px]"></div>
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan-900/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        
        {/* TOP BRANDING */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-2xl">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <span className="text-lg font-bold tracking-tight text-white drop-shadow-md">SecureBank</span>
          </div>
        </div>

        {/* MAIN REGISTER CARD */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 px-6 py-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:px-12">
          
          <div className="text-center mb-10">
            <h1 className="bg-gradient-to-br from-emerald-300 to-emerald-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent drop-shadow-sm sm:text-4xl">
              Create an Account
            </h1>
            <p className="mt-3 text-sm text-white/60">
              Join SecureBank today and take control of your finances.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Full Name & Phone Row */}
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="h-4 w-4 text-white/40" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Phone className="h-4 w-4 text-white/40" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Mail className="h-4 w-4 text-white/40" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 py-3.5 pl-5 pr-11 text-sm text-white placeholder:text-white/40 backdrop-blur-md transition-all focus:border-emerald-500/50 focus:bg-slate-950/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/40 hover:text-white/70 transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
            
            {/* Password Hint */}
            <p className="text-xs text-white/40 px-2">
              Must be at least 8 characters, with one uppercase letter and one number.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 space-y-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-emerald-500 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[#020617]"
              >
                Create Account <ArrowRight className="h-4 w-4" />
              </button>
              
              <div className="text-center mt-6">
                <span className="text-sm text-white/50">Already have an account? </span>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 underline decoration-emerald-500/30 underline-offset-4 transition-colors"
                >
                  Log in here
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}