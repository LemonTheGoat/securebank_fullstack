import { Router } from 'express';
import { z } from 'zod';
import { withTransaction } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ApiError } from '../middleware/error.js';
const router = Router();
router.post('/', requireAuth, validate(z.object({ fromAccountId: z.coerce.number().int().positive(), toAccountNumber: z.string().min(6).max(20), amount: z.string().regex(/^\d+(\.\d{1,2})?$/), description: z.string().max(140).optional() })), async (req, res, next) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body; const idemKey = req.get('Idempotency-Key');
    if (!idemKey) throw new ApiError(400, 'IDEMPOTENCY_KEY_REQUIRED', 'Idempotency-Key header required');
    const result = await withTransaction(async (client) => {
      const seen = await client.query(`SELECT reference, txn_status FROM transactions WHERE idempotency_key = $1 AND created_by = $2`, [idemKey, req.user.sub]);
      if (seen.rowCount) return { reference: seen.rows[0].reference, status: seen.rows[0].txn_status, replay: true };
      const { rows: accs } = await client.query(`SELECT id, user_id, balance, currency, status, account_number FROM accounts WHERE id = $1 OR account_number = $2 ORDER BY id FOR UPDATE`, [fromAccountId, toAccountNumber]);
      const from = accs.find(a => a.id === fromAccountId); const to = accs.find(a => a.account_number === toAccountNumber);
      if (!from || from.user_id !== req.user.sub) throw new ApiError(403, 'FORBIDDEN', 'Account not yours');
      if (!to) throw new ApiError(404, 'ACCOUNT_NOT_FOUND', 'Destination not found');
      if (from.id === to.id) throw new ApiError(400, 'SAME_ACCOUNT', 'Cannot transfer to self');
      if (from.status !== 'active' || to.status !== 'active') throw new ApiError(409, 'ACCOUNT_INACTIVE', 'Account not active');
      if (from.currency !== to.currency) throw new ApiError(409, 'CURRENCY_MISMATCH', 'Currency mismatch');
      if (Number((await client.query(`SELECT balance - $1::numeric AS remaining FROM accounts WHERE id = $2`, [amount, from.id])).rows[0].remaining) < 0) throw new ApiError(409, 'INSUFFICIENT_FUNDS', 'Insufficient funds');
      const txn = await client.query(`INSERT INTO transactions (from_account_id, to_account_id, amount, currency, txn_type, txn_status, idempotency_key, description, created_by, posted_at) VALUES ($1, $2, $3::numeric, $4, 'transfer_internal', 'posted', $5, $6, $7, now()) RETURNING id, reference`, [from.id, to.id, amount, from.currency, idemKey, description ?? 'Transfer', req.user.sub]);
      const fromAfter = await client.query(`UPDATE accounts SET balance = balance - $1::numeric WHERE id = $2 RETURNING balance`, [amount, from.id]);
      const toAfter = await client.query(`UPDATE accounts SET balance = balance + $1::numeric WHERE id = $2 RETURNING balance`, [amount, to.id]);
      await client.query(`INSERT INTO ledger_entries (transaction_id, account_id, direction, amount, balance_after, description) VALUES ($1, $2, 'debit', $3::numeric, $4, $5), ($1, $6, 'credit', $3::numeric, $7, $5)`, [txn.rows[0].id, from.id, amount, fromAfter.rows[0].balance, description ?? 'Transfer', to.id, toAfter.rows[0].balance]);
      await client.query(`INSERT INTO audit_logs (user_id, action, ip, meta) VALUES ($1, 'transfer.create', $2, $3)`, [req.user.sub, req.ip, JSON.stringify({ ref: txn.rows[0].reference, amount })]);
      return { reference: txn.rows[0].reference, status: 'posted', replay: false };
    });
    res.status(result.replay ? 200 : 201).json(result);
  } catch (err) { next(err); }
});
export default router;