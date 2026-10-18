import { Router } from 'express';
import crypto from 'node:crypto';
import { z } from 'zod';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ApiError } from '../middleware/error.js';
const router = Router();
router.get('/', requireAuth, async (req, res, next) => { try { const { rows } = await query(`SELECT c.id, c.card_type, c.network, c.last4, c.expiry_month, c.expiry_year, c.status, c.daily_limit, c.account_id, a.account_number FROM cards c JOIN accounts a ON a.id = c.account_id WHERE a.user_id = $1 ORDER BY c.created_at DESC`, [req.user.sub]); res.json({ data: rows }); } catch (err) { next(err); } });
router.post('/', requireAuth, validate(z.object({ accountId: z.coerce.number().int().positive(), cardType: z.enum(['debit','credit']), network: z.enum(['visa','mastercard']).default('visa') })), async (req, res, next) => {
  try {
    const { accountId, cardType, network } = req.body; if (!(await query(`SELECT id FROM accounts WHERE id = $1 AND user_id = $2`, [accountId, req.user.sub])).rowCount) throw new ApiError(403, 'FORBIDDEN');
    const last4 = String(Math.floor(1000 + Math.random() * 9000)); const panHash = crypto.createHash('sha256').update(crypto.randomBytes(16)).digest('hex');
    const { rows } = await query(`INSERT INTO cards (account_id, card_type, network, last4, pan_hash, expiry_month, expiry_year, daily_limit, contactless) VALUES ($1, $2, $3, $4, $5, $6, $7, 50000, TRUE) RETURNING id, card_type, network, last4, expiry_month, expiry_year, status, daily_limit`, [accountId, cardType, network, last4, panHash, (new Date()).getMonth()+1, (new Date()).getFullYear()%100+4]);
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
});
router.patch('/:id/block', requireAuth, validate(z.object({ reason: z.enum(['lost','stolen','frozen','cancelled']) })), async (req, res, next) => {
  try { const result = await query(`UPDATE cards c SET status = $1::card_status FROM accounts a WHERE c.id = $2 AND c.account_id = a.id AND a.user_id = $3 RETURNING c.id, c.status`, [req.body.reason, Number(req.params.id), req.user.sub]); if (!result.rowCount) throw new ApiError(404, 'NOT_FOUND'); res.json({ data: result.rows[0] }); } catch (err) { next(err); }
});
export default router;