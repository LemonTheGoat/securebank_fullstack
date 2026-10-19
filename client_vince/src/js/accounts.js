import { api, guard } from './api.js'; import { animateValue } from './ui.js';
await guard('customer');
const fmt = (n) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(Number(n));
const accounts = (await api.accounts()).data; const select = document.getElementById('accountSelect'); let current = accounts[0]?.id; let page = 1; let totalPages = 1;
accounts.forEach(a => { const o = document.createElement('option'); o.value = a.id; o.textContent = `${a.accountNumber} — ${a.accountType}`; select.appendChild(o); });
async function load() {
  const txnsEl = document.getElementById('txns'); txnsEl.innerHTML = '<p class="p-6 text-sm text-slate-400 text-center">Loading...</p>'; 
  const { data, meta } = await api.transactions(current, page, 20);
  const acc = accounts.find(a => a.id === Number(current)); document.getElementById('pageTitle').textContent = `Transactions · ${acc.accountNumber}`; 
  document.getElementById('pageMeta').innerHTML = `Current balance: <span id="animatedBalance" class="font-bold text-slate-900">${fmt(0)}</span> · ${meta.total} transactions`;
  animateValue('animatedBalance', 0, acc.balance, 800, true);
  totalPages = Math.max(1, Math.ceil(meta.total / meta.limit)); document.getElementById('pageInfo').textContent = `Page ${page} of ${totalPages}`; document.getElementById('prevBtn').disabled = page <= 1; document.getElementById('nextBtn').disabled = page >= totalPages;
  txnsEl.innerHTML = '';
  if (!data.length) return txnsEl.innerHTML = '<p class="p-6 text-sm text-slate-400 text-center">No transactions.</p>';
  data.forEach(t => { const row = document.createElement('div'); row.className = 'p-4 flex justify-between items-center hover:bg-slate-50 transition-colors animate-float-up'; row.innerHTML = `<div><p class="text-sm font-medium text-slate-900">${t.description || t.txnType}</p><p class="text-xs text-slate-400 font-mono">${t.reference?.slice(0, 8)} · ${new Date(t.createdAt).toLocaleString()}</p></div><div class="text-right"><p class="${t.direction === 'credit' ? 'money-credit' : 'money-debit'}">${t.direction === 'credit' ? '+' : '−'}${fmt(t.amount)}</p><p class="text-xs text-slate-500 font-mono">bal ${fmt(t.balanceAfter)}</p></div>`; txnsEl.appendChild(row); });
}
select.addEventListener('change', () => { current = select.value; page = 1; load(); }); document.getElementById('prevBtn').addEventListener('click', () => { if (page > 1) { page--; load(); } }); document.getElementById('nextBtn').addEventListener('click', () => { if (page < totalPages) { page++; load(); } }); document.getElementById('logoutBtn').addEventListener('click', async () => { await api.logout(); location.href = '/'; }); await load();