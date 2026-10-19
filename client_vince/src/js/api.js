let accessToken = null;
export function setToken(t) { accessToken = t; }
export function getToken() { return accessToken; }
export async function request(path, { method = 'GET', body, headers = {}, retry = true } = {}) {
  const res = await fetch(`/api/v1${path}`, { method, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 401 && retry && path !== '/auth/refresh') {
    const r = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' });
    if (r.ok) { accessToken = (await r.json()).accessToken; return request(path, { method, body, headers, retry: false }); }
    location.href = '/'; throw new Error('unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error('Request failed'), { status: res.status, data });
  return data;
}
export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }).then(d => { accessToken = d.accessToken; return d; }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }), logout: () => request('/auth/logout', { method: 'POST' }), me: () => request('/auth/me'),
  accounts: () => request('/accounts'), transactions: (id, page = 1, limit = 20) => request(`/accounts/${id}/transactions?page=${page}&limit=${limit}`),
  transfer: (payload, idemKey) => request('/transfers', { method: 'POST', body: payload, headers: { 'Idempotency-Key': idemKey } }),
  cards: () => request('/cards'), createCard: (payload) => request('/cards', { method: 'POST', body: payload }), blockCard: (id, reason) => request(`/cards/${id}/block`, { method: 'PATCH', body: { reason } }),
  loans: () => request('/loans'), loanSchedule: (id) => request(`/loans/${id}/schedule`), createLoan: (payload) => request('/loans', { method: 'POST', body: payload }),
  adminUsers: () => request('/admin/users'), adminAudit: () => request('/admin/audit-logs'), adminRecon: () => request('/admin/reconciliation'),
  analytics: () => request('/analytics/cashflow')
};
export async function guard(requiredRole) {
  try { const { user } = await api.me(); if (requiredRole && user.role !== requiredRole) { location.href = user.role === 'admin' ? '/admin.html' : '/dashboard.html'; throw new Error('role mismatch'); } return user; }
  catch (err) { if (err.message !== 'unauthorized' && err.message !== 'role mismatch') { location.href = '/'; } throw err; }
}