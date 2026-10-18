import pg from 'pg';
import 'dotenv/config';
pg.types.setTypeParser(20, (val) => (val === null ? null : parseInt(val, 10)));
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 10, idleTimeoutMillis: 30000 });
pool.on('error', (err) => console.error('[pg pool error]', err));
export const query = (text, params) => pool.query(text, params);
export async function withTransaction(fn) {
  const client = await pool.connect();
  try { await client.query('BEGIN'); const result = await fn(client); await client.query('COMMIT'); return result; }
  catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
}