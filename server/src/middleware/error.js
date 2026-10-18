export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ error: { code, message: err.expose ? err.message : 'Something went wrong' } });
};
export class ApiError extends Error {
  constructor(status, code, message, expose = true) {
    super(message); this.status = status; this.code = code; this.expose = expose;
  }
}