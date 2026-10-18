import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
const router = Router();
router.get('/', requireAuth, async (req, res, next) => { try { const { rows } = await query(`SELECT id, from_account_id, to_account_number, amount, description, frequency, next_run_at, is_active FROM scheduled_transfers WHERE user_id = $1 ORDER BY next_run_at`, [req.user.sub]); res.json({ data: rows }); } catch (err) { next(err); } });
router.post('/', requireAuth, validate(z.object({ fromAccountId: z.coerce.number().int().positive(), toAccountNumber: z.string().min(6).max(20), amount: z.string().regex(/^\d+(\.\d{1,2})?$/), description: z.string().max(140).optional(), frequency: z.enum(['once','daily','weekly','monthly']), nextRunAt: z.string().datetime() })), async (req, res, next) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description, frequency, nextRunAt } = req.body;
    if (!(await query(`SELECT id FROM accounts WHERE id = $1 AND user_id = $2`, [fromAccountId, req.user.sub])).rowCount) return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    const { rows } = await query(`INSERT INTO scheduled_transfers (user_id, from_account_id, to_account_number, amount, description, frequency, next_run_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, next_run_at`, [req.user.sub, fromAccountId, toAccountNumber, amount, description ?? null, frequency, nextRunAt]);
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
});
router.delete('/:id', requireAuth, async (req, res, next) => { try { const result = await query(`DELETE FROM scheduled_transfers WHERE id = $1 AND user_id = $2`, [Number(req.params.id), req.user.sub]); if (!result.rowCount) return res.status(404).json({ error: { code: 'NOT_FOUND' } }); res.json({ ok: true }); } catch (err) { next(err); } });
export default router;