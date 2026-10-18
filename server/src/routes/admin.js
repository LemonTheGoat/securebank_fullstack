import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ApiError } from '../middleware/error.js';
const router = Router();
router.use(requireAuth, requireRole('admin'));
router.get('/users', async (req, res, next) => { try { const { rows } = await query(`SELECT id, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 100`); res.json({ data: rows }); } catch (err) { next(err); } });
router.get('/audit-logs', async (req, res, next) => { try { const { rows } = await query(`SELECT al.id, al.action, al.ip, al.meta, al.created_at, u.email AS user_email FROM audit_logs al LEFT JOIN users u ON u.id = al.user_id ORDER BY al.created_at DESC LIMIT 50`); res.json({ data: rows }); } catch (err) { next(err); } });
router.get('/reconciliation', async (req, res, next) => {
  try { const { rows } = await query(`SELECT a.id, a.account_number, a.balance, COALESCE(SUM(CASE WHEN le.direction = 'credit' THEN le.amount ELSE -le.amount END), 0) AS ledger_change, a.balance - COALESCE(SUM(CASE WHEN le.direction = 'credit' THEN le.amount ELSE -le.amount END), 0) AS opening_balance FROM accounts a LEFT JOIN ledger_entries le ON le.account_id = a.id WHERE a.user_id IS NOT NULL GROUP BY a.id, a.account_number, a.balance ORDER BY a.id`); res.json({ data: rows, ok: true }); } catch (err) { next(err); }
});
export default router;