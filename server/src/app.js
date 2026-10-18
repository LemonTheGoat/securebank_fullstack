import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/accounts.js';
import transferRoutes from './routes/transfers.js';
import adminRoutes from './routes/admin.js';
import cardRoutes from './routes/cards.js';
import loanRoutes from './routes/loans.js';
import scheduledRoutes from './routes/scheduled.js';
import analyticsRoutes from './routes/analytics.js';
import { errorHandler } from './middleware/error.js';
import { spec } from './openapi.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') ?? ['http://localhost:5173'], credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1', rateLimit({ windowMs: 15 * 60_000, max: 1000, standardHeaders: true, legacyHeaders: false }));
const authLimiter = rateLimit({ windowMs: 15 * 60_000, max: 20, skipSuccessfulRequests: true });
app.use('/api/v1/auth/login', authLimiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transfers', transferRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/cards', cardRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/scheduled', scheduledRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.get('/api/v1/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use(errorHandler);
export default app;