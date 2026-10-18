import { query, withTransaction } from '../db.js';
export async function processScheduledTransfers() {
  const { rows } = await query(`SELECT * FROM scheduled_transfers WHERE is_active = TRUE AND next_run_at <= now() LIMIT 20 FOR UPDATE SKIP LOCKED`);
  for (const s of rows) {
    try {
      await withTransaction(async (client) => {
        const from = await client.query(`SELECT id, balance FROM accounts WHERE id = $1 AND user_id = $2 FOR UPDATE`, [s.from_account_id, s.user_id]);
        if (!from.rowCount) throw new Error('source missing');
        const to = await client.query(`SELECT id FROM accounts WHERE account_number = $1`, [s.to_account_number]);
        if (!to.rowCount) throw new Error('dest missing');
        if (Number(from.rows[0].balance) - Number(s.amount) < 0) throw new Error('insufficient');
        const txn = await client.query(`INSERT INTO transactions (from_account_id, to_account_id, amount, currency, txn_type, txn_status, description, created_by, posted_at) VALUES ($1,$2,$3::numeric,'PHP','transfer_internal','posted',$4,$5, now()) RETURNING id`, [from.rows[0].id, to.rows[0].id, s.amount, `Scheduled: ${s.description ?? ''}`, s.user_id]);
        const fromAfter = await client.query(`UPDATE accounts SET balance = balance - $1::numeric WHERE id = $2 RETURNING balance`, [s.amount, from.rows[0].id]);
        const toAfter = await client.query(`UPDATE accounts SET balance = balance + $1::numeric WHERE id = $2 RETURNING balance`, [s.amount, to.rows[0].id]);
        await client.query(`INSERT INTO ledger_entries (transaction_id, account_id, direction, amount, balance_after, description) VALUES ($1,$2,'debit',$3::numeric,$4,$5), ($1,$6,'credit',$3::numeric,$7,$5)`, [txn.rows[0].id, from.rows[0].id, s.amount, fromAfter.rows[0].balance, 'Scheduled transfer', to.rows[0].id, toAfter.rows[0].balance]);
        let next = new Date(s.next_run_at);
        switch (s.frequency) {
          case 'daily': next.setDate(next.getDate() + 1); break;
          case 'weekly': next.setDate(next.getDate() + 7); break;
          case 'monthly': next.setMonth(next.getMonth() + 1); break;
          default: await client.query(`UPDATE scheduled_transfers SET is_active = FALSE, last_run_at = now() WHERE id = $1`, [s.id]); return;
        }
        await client.query(`UPDATE scheduled_transfers SET next_run_at = $1, last_run_at = now() WHERE id = $2`, [next, s.id]);
      });
    } catch (err) { console.error(`[scheduled ${s.id}]`, err.message); }
  }
}