import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { z } from 'zod';
import { query } from '../db.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.post('/register', validate(z.object({ email: z.string().email(), password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/), fullName: z.string().min(1).max(120), phone: z.string().max(20).optional() })), async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;
    if ((await query(`SELECT id FROM users WHERE email = $1`, [email])).rowCount) return res.status(409).json({ error: { code: 'EMAIL_TAKEN' } });
    const hash = await argon2.hash(password, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 });
    const { rows } = await query(`INSERT INTO users (email, password_hash, full_name, phone) VALUES ($1, $2, $3, $4) RETURNING id`, [email, hash, fullName, phone ?? null]);
    const userId = rows[0].id; const accountNumber = '00' + String(Date.now() + userId).slice(-9);
    await query(`INSERT INTO accounts (user_id, product_id, account_number, account_category, account_type, balance) VALUES ($1, 1, $2, 'deposit', 'savings', 0)`, [userId, accountNumber]);
    res.status(201).json({ ok: true, userId, accountNumber });
  } catch (err) { next(err); }
});
router.post('/login', validate(z.object({ email: z.string().email(), password: z.string().min(8) })), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await query(`SELECT id, password_hash, role, is_active, full_name, locked_until FROM users WHERE email = $1`, [email]);
    const invalid = () => res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
    const user = rows[0];
    if (!user || !user.is_active || (user.locked_until && user.locked_until > new Date())) return invalid();
    if (!(await argon2.verify(user.password_hash, password))) {
      await query(`UPDATE users SET failed_login_attempts = failed_login_attempts + 1, locked_until = CASE WHEN failed_login_attempts + 1 >= 5 THEN now() + interval '15 minutes' ELSE locked_until END WHERE id = $1`, [user.id]);
      return invalid();
    }
    await query(`UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1`, [user.id]);
    const accessToken = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m', issuer: 'bank-api', audience: 'bank-web' });
    const raw = crypto.randomBytes(48).toString('base64url'); const hash = crypto.createHash('sha256').update(raw).digest('hex');
    await query(`INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '7 days')`, [user.id, hash]);
    res.cookie('refresh_token', raw, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api', maxAge: 7 * 24 * 3600 * 1000 });
    res.json({ accessToken, user: { id: user.id, fullName: user.full_name, role: user.role } });
  } catch (err) { next(err); }
});
router.post('/refresh', async (req, res, next) => {
  try {
    const raw = req.cookies?.refresh_token;
    if (!raw) return res.status(401).json({ error: { code: 'NO_REFRESH_TOKEN' } });
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    const { rows } = await query(`SELECT id, user_id, revoked, expires_at FROM refresh_tokens WHERE token_hash = $1`, [hash]);
    const row = rows[0];
    if (!row) return res.status(401).json({ error: { code: 'INVALID_REFRESH' } });
    if (row.revoked) { await query(`UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1`, [row.user_id]); return res.status(401).json({ error: { code: 'TOKEN_REUSE' } }); }
    if (row.expires_at < new Date()) return res.status(401).json({ error: { code: 'REFRESH_EXPIRED' } });
    await query(`UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1`, [row.id]);
    const newRaw = crypto.randomBytes(48).toString('base64url'); const newHash = crypto.createHash('sha256').update(newRaw).digest('hex');
    await query(`INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, now() + interval '7 days')`, [row.user_id, newHash]);
    const { rows: u } = await query(`SELECT role FROM users WHERE id = $1`, [row.user_id]);
    const accessToken = jwt.sign({ sub: row.user_id, role: u[0].role }, process.env.JWT_SECRET, { expiresIn: '15m', issuer: 'bank-api', audience: 'bank-web' });
    res.cookie('refresh_token', newRaw, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/api', maxAge: 7 * 24 * 3600 * 1000 });
    res.json({ accessToken });
  } catch (err) { next(err); }
});
router.post('/logout', async (req, res) => { const raw = req.cookies?.refresh_token; if (raw) { const hash = crypto.createHash('sha256').update(raw).digest('hex'); await query(`UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`, [hash]); } res.clearCookie('refresh_token', { path: '/api' }); res.json({ ok: true }); });
router.get('/me', requireAuth, async (req, res, next) => { try { const { rows } = await query(`SELECT id, email, full_name, role FROM users WHERE id = $1`, [req.user.sub]); if (!rows.length) return res.status(404).json({ error: { code: 'NOT_FOUND' } }); res.json({ user: rows[0] }); } catch (err) { next(err); } });
export default router;