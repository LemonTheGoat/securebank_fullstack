import { api, guard } from './api.js';
import { animateValue } from './ui.js';

const user = await guard('customer');
document.getElementById('userAvatar').textContent = user.full_name.charAt(0).toUpperCase();

const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(n));
const accounts = (await api.accounts()).data;
let totalBalance = 0; let totalSavings = 0;
accounts.forEach(a => { totalBalance += Number(a.balance); if (a.accountType === 'savings') totalSavings += Number(a.balance); });
animateValue('totalBalance', 0, totalBalance, 800);
animateValue('totalSavings', 0, totalSavings, 900);

const cashflow = (await api.analytics()).data;
let maxVal = 0;
cashflow.forEach(d => { if (Number(d.income) > maxVal) maxVal = Number(d.income); if (Number(d.expense) > maxVal) maxVal = Number(d.expense); });
if (maxVal === 0) maxVal = 1000;

const chartContainer = document.getElementById('chartContainer');
chartContainer.innerHTML = '';
cashflow.forEach(d => {
  const incomeHeight = (Number(d.income) / maxVal) * 100;
  const expenseHeight = (Number(d.expense) / maxVal) * 100;
  const date = new Date(d.day).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  const col = document.createElement('div');
  col.className = 'flex flex-col items-center justify-end gap-1 w-full h-full';
  col.innerHTML = `
    <div class="w-full flex justify-center gap-1 h-full items-end group relative">
      <div class="absolute -top-10 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-xs p-2 rounded shadow-xl z-10 whitespace-nowrap"><span class="text-emerald-400">In: ${fmt(d.income)}</span><span class="text-indigo-400">Out: ${fmt(d.expense)}</span></div>
      <div class="w-2 bg-slate-600 rounded-t transition-all duration-500 ease-out hover:bg-slate-500" style="height: ${incomeHeight}%"></div>
      <div class="w-2 bg-indigo-400 rounded-t transition-all duration-500 ease-out hover:bg-indigo-300" style="height: ${expenseHeight}%"></div>
    </div>
    <span class="text-xs text-slate-500 mt-2">${date}</span>
  `;
  chartContainer.appendChild(col);
});

const allTxns = []; for (const a of accounts) { try { const { data } = await api.transactions(a.id); allTxns.push(...data.map(t => ({ ...t, accountNumber: a.accountNumber }))); } catch {} }
allTxns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
const listEl = document.getElementById('transactionsList');
if (!allTxns.length) { listEl.innerHTML = '<p class="text-sm text-slate-400 text-center mt-4">No transactions yet.</p>'; } 
else {
  allTxns.slice(0, 8).forEach(t => {
    const isCredit = t.direction === 'credit';
    const colors = ['bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600', 'bg-emerald-100 text-emerald-600', 'bg-orange-100 text-orange-600'];
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    const initial = (t.description || t.txnType).charAt(0).toUpperCase();
    const div = document.createElement('div'); div.className = 'flex items-center justify-between p-2 hover:bg-slate-50 hover:scale-[1.02] transition-transform cursor-pointer rounded-xl';
    div.innerHTML = `<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full flex items-center justify-center font-bold ${colorClass}">${initial}</div><div><p class="text-sm font-semibold text-slate-900">${t.description || t.txnType}</p><p class="text-xs text-slate-400">${t.accountNumber}</p></div></div><div class="text-right"><p class="${isCredit ? 'text-emerald-500' : 'text-slate-900'} font-semibold">${isCredit ? '+' : '-'}${fmt(t.amount)}</p><p class="text-xs text-slate-400">${new Date(t.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p></div>`;
    listEl.appendChild(div);
  });
}
document.getElementById('logoutBtn').addEventListener('click', async () => { await api.logout(); location.href = '/'; });