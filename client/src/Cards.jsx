import React from 'react';
import { CreditCard, Lock, EyeOff, Plus } from 'lucide-react';

export default function Cards() {
  return (
    <div className="flex w-full flex-col gap-6 animate-in fade-in duration-300">
      <header>
        <h1 className="text-lg font-semibold text-white">Card Management</h1>
        <p className="mt-0.5 text-xs text-slate-400">Manage your virtual and physical cards</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {/* VIRTUAL CARD DISPLAY */}
        <div className="rounded-[2rem] border border-slate-700/60 bg-slate-800 p-8 shadow-lg xl:col-span-2 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-[1.586/1] rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-900 opacity-90 z-0"></div>
            <div className="relative z-10 flex justify-between items-start w-full">
              <span className="text-xl font-bold tracking-widest text-white drop-shadow-md">SecureBank</span>
              <CreditCard className="h-8 w-8 text-white/80" />
            </div>
            <div className="relative z-10 w-full mt-auto">
              <div className="flex gap-4 mb-2">
                <span className="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">****</span>
                <span className="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">****</span>
                <span className="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">****</span>
                <span className="text-2xl font-mono tracking-[0.2em] text-white drop-shadow-md">8024</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase tracking-widest">Cardholder</span>
                  <span className="text-sm font-medium text-white tracking-widest">LIAM SALCEDO</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/60 uppercase tracking-widest">Expires</span>
                  <span className="text-sm font-medium text-white tracking-widest">12/28</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 w-full max-w-md">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/20 transition-colors">
              <Lock className="h-4 w-4" /> Freeze Card
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-slate-600 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors">
              <EyeOff className="h-4 w-4" /> Show Details
            </button>
          </div>
        </div>

        {/* CARD SETTINGS */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[2rem] border border-slate-700/60 bg-slate-800 p-6 shadow-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Spending Limits</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">Online Purchases</span>
                  <span className="text-emerald-400 font-mono">₱15k / ₱50k</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">ATM Withdrawals</span>
                  <span className="text-emerald-400 font-mono">₱0 / ₱20k</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full rounded-[1.5rem] border border-dashed border-slate-600 bg-slate-800/50 p-6 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-all">
            <Plus className="h-5 w-5" />
            <span className="font-medium text-sm">Request Virtual Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}