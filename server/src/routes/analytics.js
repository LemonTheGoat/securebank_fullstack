import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/cashflow', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query(`
      WITH days AS (SELECT generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day')::date AS day),
      user_entries AS (SELECT DATE(le.created_at) as day, le.direction, le.amount FROM ledger_entries le JOIN accounts a ON a.id = le.account_id WHERE a.user_id = $1 AND le.created_at >= CURRENT_DATE - INTERVAL '6 days')
      SELECT d.day, COALESCE(SUM(CASE WHEN ue.direction = 'credit' THEN ue.amount ELSE 0 END), 0) AS income, COALESCE(SUM(CASE WHEN ue.direction = 'debit' THEN ue.amount ELSE 0 END), 0) AS expense FROM days d LEFT JOIN user_entries ue ON ue.day = d.day GROUP BY d.day ORDER BY d.day ASC;
    `, [req.user.sub]);
    res.json({ data: rows });
  } catch (err) { next(err); }
});
export default router;