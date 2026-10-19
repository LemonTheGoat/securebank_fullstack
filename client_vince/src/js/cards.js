import { api, guard } from './api.js'; import { confirmDialog, choiceDialog, toast } from './ui.js'; await guard('customer');
const accounts = (await api.accounts()).data; let cards = (await api.cards()).data; const el = document.getElementById('cards');
function render() {
  el.innerHTML = ''; if (!cards.length) return el.innerHTML = `<div class="app-card text-center text-sm text-slate-500 animate-float-up">No cards yet.</div>`;
  cards.forEach((c, i) => {
    const wrap = document.createElement('div'); wrap.className = 'app-card space-y-3 animate-float-up';
    const visual = document.createElement('div'); visual.className = `relative rounded-2xl p-5 text-white aspect-[16/10] overflow-hidden ${c.card_type === 'credit' ? 'bg-gradient-to-br from-slate-800 to-black' : 'bg-gradient-to-br from-emerald-600 to-emerald-900'}`;
    visual.innerHTML = `<div class="relative flex flex-col justify-between h-full"><div class="flex justify-between text-xs uppercase tracking-widest opacity-80"><span>${c.network}</span><span>${c.card_type}</span></div><div class="font-mono text-lg tracking-widest">•••• •••• •••• ${c.last4}</div><div class="flex justify-between text-xs opacity-90"><span>EXP ${String(c.expiry_month).padStart(2,'0')}/${String(c.expiry_year).padStart(2,'0')}</span><span>•••</span></div></div>`;
    const status = document.createElement('div'); status.className = 'flex items-center justify-between';
    status.innerHTML = `<span class="${c.status === 'active' ? 'badge-success' : 'badge-warn'}">${c.status}</span><span class="text-xs text-slate-500 font-mono">${c.account_number}</span>`;
    wrap.append(visual, status);
    if (c.status === 'active') { const btn = document.createElement('button'); btn.className = 'glass-btn text-xs w-full'; btn.textContent = 'Block card'; btn.onclick = async () => { if (await confirmDialog({ title: 'Block card?', message: 'Permanently block this card?', danger: true })) { await api.blockCard(c.id, 'frozen'); cards = (await api.cards()).data; render(); toast('Card blocked', 'success'); } }; wrap.appendChild(btn); }
    el.appendChild(wrap);
  });
}
document.getElementById('newCardBtn').onclick = async () => {
  if (!accounts.length) return toast('No accounts', 'warn');
  const accountId = await choiceDialog({ title: 'Which account?', options: accounts.map(a => ({ label: a.accountNumber, value: a.id })) }); if (!accountId) return;
  const cardType = await choiceDialog({ title: 'Card type', options: [{ label: 'Debit', value: 'debit' }, { label: 'Credit', value: 'credit' }] }); if (!cardType) return;
  await api.createCard({ accountId, cardType }); cards = (await api.cards()).data; render(); toast('Card issued', 'success');
};
document.getElementById('logoutBtn').onclick = async () => { await api.logout(); location.href = '/'; }; render();