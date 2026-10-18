export const spec = {
  openapi: '3.0.3',
  info: { title: 'SecureBank API', version: '1.0.0', description: 'Double-entry banking API' },
  servers: [{ url: '/api/v1' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  security: [{ bearerAuth: [] }],
  paths: { '/health': { get: { security: [], summary: 'Health check', responses: { 200: { description: 'OK' } } } } }
};