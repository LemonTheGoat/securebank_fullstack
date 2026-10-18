import { api, guard } from './api.js';
import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/+esm';
await guard('customer');
const accounts = (await api.accounts()).data; const sel = document.getElementById('fromAccount');
accounts.forEach(a => { if (a.status !== 'active') return; const o = document.createElement('option'); o.value = a.id; o.textContent = `${a.accountNumber} — ${a.currency} ${Number(a.balance).toLocaleString()}`; sel.appendChild(o); });
document.getElementById('transferForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('button'); btn.disabled = true; const msg = document.getElementById('msg'); msg.textContent = '';
  try { 
    const r = await api.transfer({ fromAccountId: Number(sel.value), toAccountNumber: document.getElementById('toAccount').value.trim(), amount: document.getElementById('amount').value.trim(), description: document.getElementById('description').value.trim() || undefined }, crypto.randomUUID()); 
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b'] });
    msg.className = 'text-sm text-center text-emerald-600 mt-2 font-medium'; msg.textContent = `Successfully sent! Ref: ${r.reference}`; e.target.reset(); 
  }
  catch (err) { msg.className = 'text-sm text-center text-rose-500 mt-2 font-medium'; msg.textContent = err.data?.error?.message || 'Transfer failed'; }
  finally { btn.disabled = false; }
});
document.getElementById('logoutBtn').addEventListener('click', async () => { await api.logout(); location.href = '/'; });