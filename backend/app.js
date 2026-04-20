// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env vars
process.loadEnvFile('./.env');

const { sequelize: db } = require('./config/database');
const { initModels } = require('./models');
const router = require('./routes');

const PORT = process.env.PORT || '3000';
const ENV = process.env.NODE_ENV || 'development';

let app; // singleton Express app
let server; // http.Server

function createApp() {
  if (app) return app;

  app = express();

  // Serve frontend static files (useful in dev/prod, skipped in tests if you want)
  app.use(express.static(path.join(__dirname, '../dist')));

  app.use(express.json());
  app.use(cookieParser());

  // API routes
  app.use(router);

  // TEST-ONLY helper: reset DB between specs
  if (process.env.NODE_ENV === 'test') {
    const testApi = require('./routes/test.api');
    app.use('/test', testApi);
  }

  // Fallback to SPA index
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });

  return app;
}

/**
 * Initialize DB + models and (optionally) start listening.
 * @param {{listen?: boolean, port?: string|number}} options
 * @returns {Promise<{app: import('express').Express, server?: import('http').Server, db: any}>}
 */
async function initApp(options = {}) {
  const { listen = true, port = PORT } = options;

  const theApp = createApp();

  await db.authenticate();

  // Initialize all models & expose to controllers
  const models = initModels(db);
  theApp.locals.models = models;

  // Sync schema (or run migrations if you prefer)
  await db.sync();

  if (listen) {
    server = theApp.listen(port, () => {
      console.info(`Serveur sur le port ${port} (env: ${ENV})`);
    });
  }

  return { app: theApp, server, db };
}

/** Gracefully stop the server (useful in tests) */
async function stopApp() {
  if (server) {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    server = undefined;
  }
}

module.exports = { createApp, initApp, stopApp };

// If run directly (node app.js), start the server.
if (require.main === module) {
  initApp({ listen: true }).catch((err) => {
    console.error("Impossible de démarrer l'app:", err);
    process.exit(1);
  });
}
