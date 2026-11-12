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

  // Initialize persistent database
  db.init();

  // Initialize and seed relational MySQL connection manager & tables
  try {
    const { runDatabaseSeed } = await import('./scripts/seed_db.ts');
    await runDatabaseSeed();
  } catch (seedErr) {
    console.warn('[PathProof] Relational database seed warning:', seedErr);
  }

  app.use(express.json());

  // Mount versioned REST API
  app.use('/api/v1', createApiRouter());

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
  });
}

startServer().catch((err) => {
  console.error('[PathProof] Failed to start server:', err);
  process.exit(1);
});
