import { api } from './api.js';
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('button'); btn.disabled = true; const msg = document.getElementById('msg'); msg.textContent = '';
  try { const res = await api.login(document.getElementById('email').value.trim(), document.getElementById('password').value); location.href = res.user.role === 'admin' ? '/admin.html' : '/dashboard.html'; }
  catch (err) { msg.className = 'text-sm text-center text-rose-600 mt-2'; msg.textContent = 'Invalid email or password'; btn.disabled = false; }
});