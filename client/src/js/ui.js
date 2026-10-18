const MODAL_ROOT = '__app_modal_root'; const TOAST_ROOT = '__app_toast_root';
function ensureRoots() {
  if (!document.getElementById(MODAL_ROOT)) { const el = document.createElement('div'); el.id = MODAL_ROOT; el.className = 'fixed inset-0 z-50 pointer-events-none'; document.body.appendChild(el); }
  if (!document.getElementById(TOAST_ROOT)) { const el = document.createElement('div'); el.id = TOAST_ROOT; el.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none'; document.body.appendChild(el); }
}
export function animateValue(id, start, end, duration = 800, isCurrency = true) {
  const obj = document.getElementById(id); if (!obj) return;
  const startTime = performance.now(); const fmt = isCurrency ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }) : new Intl.NumberFormat('en-US');
  function update(currentTime) {
    const elapsed = currentTime - startTime; const progress = Math.min(elapsed / duration, 1); const easeOut = 1 - Math.pow(1 - progress, 3); const current = Math.floor(start + (end - start) * easeOut);
    obj.textContent = fmt.format(current); if (progress < 1) requestAnimationFrame(update); else obj.textContent = fmt.format(end);
  }
  requestAnimationFrame(update);
}
export function toast(message, type = 'info', ms = 3200) {
  ensureRoots(); const styles = { info: 'from-slate-800 to-slate-900', success: 'from-emerald-500 to-emerald-600', error: 'from-rose-500 to-rose-600', warn: 'from-amber-500 to-amber-600' };
  const icons = { info: 'ℹ', success: '✓', error: '✕', warn: '⚠' };
  const el = document.createElement('div'); el.className = `pointer-events-auto animate-toast-in rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-br ${styles[type]} shadow-lg flex items-center gap-2.5 min-w-[260px] max-w-sm`;
  el.innerHTML = `<span class="text-base opacity-80">${icons[type]}</span><span class="flex-1"></span>`; el.querySelector('span:last-child').textContent = message;
  document.getElementById(TOAST_ROOT).appendChild(el); setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, ms);
}
function buildModalShell(innerHTML) {
  ensureRoots(); const wrap = document.createElement('div'); wrap.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto';
  wrap.innerHTML = `<div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-backdrop-in" data-backdrop></div><div class="relative bg-white border border-slate-200 animate-modal-in rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl">${innerHTML}</div>`; return wrap;
}
function closeModal(wrap) { wrap.style.opacity = '0'; setTimeout(() => wrap.remove(), 150); }
export function promptDialog({ title = 'Enter', label = '', defaultValue = '', placeholder = '', type = 'text', validate } = {}) {
  return new Promise((resolve) => {
    const wrap = buildModalShell(`<h2 class="text-xl font-bold text-slate-900 mb-5">${title}</h2>${label ? `<label class="app-label">${label}</label>` : ''}<input type="${type}" value="${defaultValue}" placeholder="${placeholder}" data-input class="app-input" /><p data-error class="mt-2 text-xs text-rose-500 hidden"></p><div class="mt-6 flex justify-end gap-3"><button data-cancel class="glass-btn">Cancel</button><button data-ok class="btn-primary">OK</button></div>`);
    const input = wrap.querySelector('[data-input]'); const errEl = wrap.querySelector('[data-error]');
    const close = (v) => { closeModal(wrap); resolve(v); };
    const submit = () => { const val = input.value.trim(); if (validate) { const err = validate(val); if (err) { errEl.textContent = err; errEl.classList.remove('hidden'); input.focus(); return; } } close(val); };
    wrap.querySelector('[data-backdrop]').addEventListener('click', () => close(null)); wrap.querySelector('[data-cancel]').addEventListener('click', () => close(null));
    wrap.querySelector('[data-ok]').addEventListener('click', submit); input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    document.getElementById(MODAL_ROOT).appendChild(wrap); setTimeout(() => { input.focus(); input.select(); }, 60);
  });
}
export function confirmDialog({ title = 'Confirm', message = '', confirmText = 'Yes', cancelText = 'Cancel', danger = false } = {}) {
  return new Promise((resolve) => {
    const wrap = buildModalShell(`<h2 class="text-xl font-bold text-slate-900 mb-2">${title}</h2><p class="text-sm text-slate-500 leading-relaxed">${message}</p><div class="mt-6 flex justify-end gap-3"><button data-cancel class="glass-btn">${cancelText}</button><button data-ok class="${danger ? 'btn-danger' : 'btn-primary'}">${confirmText}</button></div>`);
    const close = (v) => { closeModal(wrap); resolve(v); };
    wrap.querySelector('[data-backdrop]').addEventListener('click', () => close(false)); wrap.querySelector('[data-cancel]').addEventListener('click', () => close(false)); wrap.querySelector('[data-ok]').addEventListener('click', () => close(true));
    document.getElementById(MODAL_ROOT).appendChild(wrap);
  });
}
export function choiceDialog({ title = 'Choose', options = [], defaultValue } = {}) {
  return new Promise((resolve) => {
    const wrap = buildModalShell(`<h2 class="text-xl font-bold text-slate-900 mb-5">${title}</h2><div class="space-y-3" data-options></div><div class="mt-6 flex justify-end gap-3"><button data-cancel class="glass-btn">Cancel</button></div>`);
    const opts = wrap.querySelector('[data-options]');
    options.forEach((o) => {
      const btn = document.createElement('button'); btn.className = `w-full text-left px-4 py-3 rounded-xl transition-all border ${o.value === defaultValue ? 'bg-indigo-50 border-indigo-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`;
      btn.innerHTML = `<div class="text-sm font-semibold text-slate-900">${o.label}</div>${o.description ? `<div class="text-xs text-slate-500 mt-1">${o.description}</div>` : ''}`;
      btn.addEventListener('click', () => { closeModal(wrap); resolve(o.value); }); opts.appendChild(btn);
    });
    wrap.querySelector('[data-backdrop]').addEventListener('click', () => { closeModal(wrap); resolve(null); }); wrap.querySelector('[data-cancel]').addEventListener('click', () => { closeModal(wrap); resolve(null); });
    document.getElementById(MODAL_ROOT).appendChild(wrap);
  });
}