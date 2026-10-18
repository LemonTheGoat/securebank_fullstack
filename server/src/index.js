import app from './app.js';
import 'dotenv/config';
import { processScheduledTransfers } from './workers/scheduled.js';
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏦 Bank API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`   Docs:   http://localhost:${PORT}/api/v1/docs`);
});
setInterval(() => { processScheduledTransfers().catch(console.error); }, 60_000);