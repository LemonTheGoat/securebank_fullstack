import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Filter, Search } from 'lucide-react';

export default function History() {
  const dummyTransactions = [
    { id: 1, type: 'credit', title: 'Salary Deposit', date: 'Oct 15, 2026', amount: '+ ₱45,000.00' },
    { id: 2, type: 'debit', title: 'Powerhouse Gym', date: 'Oct 14, 2026', amount: '- ₱2,500.00' },
    { id: 3, type: 'debit', title: 'Spotify Premium', date: 'Oct 12, 2026', amount: '- ₱149.00' },
    { id: 4, type: 'credit', title: 'Transfer from Vince', date: 'Oct 10, 2026', amount: '+ ₱1,000.00' },
    { id: 5, type: 'debit', title: 'Steam Games', date: 'Oct 08, 2026', amount: '- ₱850.00' },
  ];

  return (
    <div className="flex w-full flex-col gap-6 animate-in fade-in duration-300">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Transaction History</h1>
          <p className="mt-0.5 text-xs text-slate-400">View and search your full ledger</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700">
          <Filter className="h-3.5 w-3.5" /> Filter
        </button>
      </header>

      <div className="rounded-[2rem] border border-slate-700/60 bg-slate-800 p-6 shadow-lg">
        <div className="space-y-3">
          {dummyTransactions.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${txn.type === 'credit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-700 text-slate-300'}`}>
                  {txn.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{txn.title}</p>
                  <p className="text-xs text-slate-400">{txn.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono text-sm font-semibold ${txn.type === 'credit' ? 'text-emerald-500' : 'text-slate-100'}`}>
                  {txn.amount}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}