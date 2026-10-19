import { api, guard } from './api.js'; import { promptDialog, toast, animateValue } from './ui.js'; await guard('customer');
const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(n)); let loans = (await api.loans()).data; const el = document.getElementById('loans');
async function render() {
  el.innerHTML = ''; if (!loans.length) return el.innerHTML = `<div class="app-card text-center text-sm text-slate-500 animate-float-up">No active loans.</div>`;
  for (const l of loans) {
    const wrap = document.createElement('div'); wrap.className = 'app-card space-y-4 animate-float-up';
    wrap.innerHTML = `<div class="flex justify-between"><div><p class="text-xs text-slate-500 uppercase">${l.term_months} months</p><p class="font-mono text-sm text-slate-900 mt-1">${l.account_number}</p></div><div class="text-right"><p class="text-xs text-slate-500">Outstanding</p><p class="money-lg" id="loan-out-${l.id}">${fmt(0)}</p></div></div>`;
    animateValue(`loan-out-${l.id}`, 0, l.outstanding, 1000, true);
    const { data: schedule } = await api.loanSchedule(l.id); const table = document.createElement('div'); table.className = 'bg-slate-50 rounded-xl overflow-hidden border border-slate-100';
    table.innerHTML = `<div class="p-3 text-xs uppercase text-slate-500 font-medium bg-slate-100">Amortization Schedule</div>` + schedule.slice(0, 4).map(r => `<div class="flex justify-between p-3 border-b border-slate-100 last:border-0 text-xs text-slate-700 hover:bg-slate-100 transition-colors"><span>${new Date(r.due_date).toLocaleDateString()}</span><span class="font-mono">${fmt(r.total_due)}</span></div>`).join('');
    wrap.appendChild(table); el.appendChild(wrap);
  }
}
document.getElementById('newLoanBtn').onclick = async () => {
  const principal = await promptDialog({ title: 'Loan Amount', label: 'PHP', defaultValue: '10000', validate: v => isNaN(v) || v <= 0 ? 'Invalid' : null }); if (!principal) return;
  const term = await promptDialog({ title: 'Term (Months)', defaultValue: '12', validate: v => isNaN(v) || v < 6 ? 'Min 6 months' : null }); if (!term) return;
  const rate = await promptDialog({ title: 'Interest Rate', defaultValue: '0.12' }); if (!rate) return;
  const r = await api.createLoan({ principal, termMonths: term, interestRate: rate }); toast(`Loan created. Monthly: ${fmt(r.data.monthly)}`, 'success'); loans = (await api.loans()).data; await render();
};
document.getElementById('logoutBtn').onclick = async () => { await api.logout(); location.href = '/'; }; await render();