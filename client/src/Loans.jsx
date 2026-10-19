import React from 'react';
import { Calculator, FileText, ArrowRight } from 'lucide-react';

export default function Loans() {
  return (
    <div className="flex w-full flex-col gap-6 animate-in fade-in duration-300">
      <header>
        <h1 className="text-lg font-semibold text-white">Loan Center</h1>
        <p className="mt-0.5 text-xs text-slate-400">Manage active loans or apply for new credit</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-[2rem] border border-slate-700/60 bg-slate-800 p-8 shadow-lg">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Personal Loan</h2>
              <p className="text-xs text-slate-400">Acct: LN-8828-1092-44</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 mb-8 border-b border-slate-700/50 pb-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Remaining</p>
              <p className="text-lg font-semibold text-emerald-500">₱32,450.00</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Original</p>
              <p className="text-lg font-medium text-white">₱50,000.00</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Rate</p>
              <p className="text-lg font-medium text-white">5.50%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Next Due</p>
              <p className="text-lg font-medium text-white">Oct 28</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-200">
              <Calculator className="h-4 w-4" /> Make Payment
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-700">
              <FileText className="h-4 w-4" /> Statements
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-8 shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2">Need more funds?</h3>
          <p className="text-xs text-slate-400 mb-8 leading-relaxed">
            Apply for a new auto, home, or personal loan with competitive rates and instant pre-approval.
          </p>
          <button className="mt-auto w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400">
            Calculate & Apply <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}