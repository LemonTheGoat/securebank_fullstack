import jwt from 'jsonwebtoken';
import 'dotenv/config';
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: { code: 'NO_TOKEN' } });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'bank-api', audience: 'bank-web' }); next(); }
  catch { res.status(401).json({ error: { code: 'INVALID_TOKEN' } }); }
};
export const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: { code: 'FORBIDDEN' } });
  next();
};