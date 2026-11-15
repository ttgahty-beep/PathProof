/**
 * PathProof Phase 1 — Full-Stack Server Entry Point
 * Mounts Express API under /api/v1 and attaches Vite SPA middleware on Port 3000.
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createApiRouter } from './src/server/api.ts';
import { db } from './src/server/db.ts';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Initialize persistent database synchronously so API is immediately ready
  db.init();

  app.use(express.json({ limit: '1mb' }));

  // Mount versioned REST API
  app.use('/api/v1', createApiRouter());

  // Never fall through unmatched /api/* requests to SPA HTML
  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      },
    });
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PathProof] Full-stack application ready at http://0.0.0.0:${PORT}`);

    // Initialize and seed relational MySQL connection manager & tables asynchronously
    // so Cloud Run / container startup probes pass immediately without waiting on remote DB timeouts.
    import('./scripts/seed_db.ts')
      .then(({ runDatabaseSeed }) => runDatabaseSeed())
      .catch((seedErr) => {
        console.warn('[PathProof] Relational database seed warning:', seedErr);
      });
  });
}

startServer().catch((err) => {
  console.error('[PathProof] Failed to start server:', err);
  process.exit(1);
});
