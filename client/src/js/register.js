import { api } from './api.js';
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const btn = e.target.querySelector('button'); btn.disabled = true; const msg = document.getElementById('msg'); msg.textContent = '';
  try { await api.register({ fullName: document.getElementById('fullName').value.trim(), email: document.getElementById('email').value.trim(), phone: document.getElementById('phone').value.trim() || undefined, password: document.getElementById('password').value }); msg.className = 'text-sm text-center text-emerald-600 mt-2'; msg.textContent = 'Account created! Redirecting...'; setTimeout(() => location.href = '/', 1200); }
  catch (err) { msg.className = 'text-sm text-center text-rose-600 mt-2'; msg.textContent = err.data?.error?.code === 'EMAIL_TAKEN' ? 'Email already registered' : 'Registration failed.'; btn.disabled = false; }
});