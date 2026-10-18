import argon2 from 'argon2';
import { query, pool } from './db.js';
const hash = (pw) => argon2.hash(pw, { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 });
const users = [{ email: 'admin@bank.com', password: 'Admin@12345' }, { email: 'customer@bank.com', password: 'Customer@12345' }];
for (const u of users) {
  const h = await hash(u.password);
  await query(`UPDATE users SET password_hash = $1 WHERE email = $2`, [h, u.email]);
  console.log(`✅ Updated ${u.email}`);
}
await pool.end();