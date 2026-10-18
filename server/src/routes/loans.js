import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ApiError } from '../middleware/error.js';
const router = Router();
router.get('/', requireAuth, async (req, res, next) => { try { const { rows } = await query(`SELECT a.id, a.account_number, a.balance AS outstanding, a.status, l.principal, l.interest_rate, l.term_months, l.amortization, l.maturity_date FROM accounts a JOIN loan_details l ON l.account_id = a.id WHERE a.user_id = $1 AND a.account_category = 'loan'`, [req.user.sub]); res.json({ data: rows }); } catch (err) { next(err); } });
router.get('/:id/schedule', requireAuth, async (req, res, next) => {
  try { if (!(await query(`SELECT id FROM accounts WHERE id = $1 AND user_id = $2 AND account_category = 'loan'`, [Number(req.params.id), req.user.sub])).rowCount) throw new ApiError(403, 'FORBIDDEN'); const { rows } = await query(`SELECT installment_no, due_date, principal_due, interest_due, total_due FROM loan_repayments WHERE loan_account_id = $1 ORDER BY installment_no`, [req.params.id]); res.json({ data: rows }); } catch (err) { next(err); }
});
router.post('/', requireAuth, validate(z.object({ principal: z.string().regex(/^\d+(\.\d{1,2})?$/), termMonths: z.coerce.number().int().min(6).max(120), interestRate: z.string().regex(/^\d+(\.\d{1,4})?$/).default('0.12') })), async (req, res, next) => {
  try {
    const { principal, termMonths, interestRate } = req.body; const P = Number(principal); const r = Number(interestRate) / 12; const n = termMonths; const monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const result = await withTransaction(async (client) => {
      const acc = await client.query(`INSERT INTO accounts (user_id, product_id, account_number, account_category, account_type, balance) VALUES ($1, 6, $2, 'loan', 'personal_loan', 0) RETURNING id`, [req.user.sub, 'L' + String(Date.now()).slice(-9)]);
      const loanId = acc.rows[0].id; const maturityDate = new Date(); maturityDate.setMonth(maturityDate.getMonth() + n);
      await client.query(`INSERT INTO loan_details (account_id, principal, interest_rate, term_months, amortization, disbursed_at, maturity_date, next_due_date) VALUES ($1, $2, $3, $4, 'annuity', now(), $5, now() + interval '30 days')`, [loanId, principal, interestRate, n, maturityDate]);
      let balance = P; const due = new Date();
      for (let i = 1; i <= n; i++) { due.setMonth(due.getMonth() + 1); const interest = balance * r; const principalDue = monthly - interest; balance -= principalDue; await client.query(`INSERT INTO loan_repayments (loan_account_id, installment_no, due_date, principal_due, interest_due) VALUES ($1, $2, $3, $4, $5)`, [loanId, i, due.toISOString().slice(0,10), principalDue.toFixed(2), interest.toFixed(2)]); }
      return { loanId, accountNumber: acc.rows[0].account_number, monthly: monthly.toFixed(2) };
    }); res.status(201).json({ data: result });
  } catch (err) { next(err); }
});
export default router;