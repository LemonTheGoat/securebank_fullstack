import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.get('/', requireAuth, async (req, res, next) => {
  try { const { rows } = await query(`SELECT a.id, a.account_number, a.account_category, a.account_type, a.currency, a.balance, a.credit_limit, a.available_credit, a.status, p.name AS product_name FROM accounts a LEFT JOIN account_products p ON p.id = a.product_id WHERE a.user_id = $1 ORDER BY a.created_at`, [req.user.sub]); res.json({ data: rows.map(r => ({ id: r.id, accountNumber: r.account_number, accountCategory: r.account_category, accountType: r.account_type, currency: r.currency, balance: r.balance, creditLimit: r.credit_limit, availableCredit: r.available_credit, status: r.status, productName: r.product_name })) }); } catch (err) { next(err); }
});
router.get('/:id/transactions', requireAuth, async (req, res, next) => {
  try {
    const accountId = Number(req.params.id); const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(50, Number(req.query.limit) || 20); const offset = (page - 1) * limit;
    if (!(await query(`SELECT id FROM accounts WHERE id = $1 AND user_id = $2`, [accountId, req.user.sub])).rowCount) return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    const { rows } = await query(`SELECT le.id, le.direction, le.amount, le.balance_after, le.created_at, t.reference, t.description, t.txn_type FROM ledger_entries le JOIN transactions t ON t.id = le.transaction_id WHERE le.account_id = $1 ORDER BY le.created_at DESC LIMIT $2 OFFSET $3`, [accountId, limit, offset]);
    const count = (await query(`SELECT COUNT(*)::int AS count FROM ledger_entries WHERE account_id = $1`, [accountId])).rows[0].count;
    res.json({ data: rows.map(r => ({ id: r.id, direction: r.direction, amount: r.amount, balanceAfter: r.balance_after, createdAt: r.created_at, reference: r.reference, description: r.description, txnType: r.txn_type })), meta: { page, limit, total: count } });
  } catch (err) { next(err); }
});
export default router;