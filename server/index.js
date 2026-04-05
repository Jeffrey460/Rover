const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ── Production static serving ─────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(buildPath));

  // Catch-all: serve React's index.html for any unknown route
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ── HTTP server ───────────────────────────────────────────────────────────────
const server = http.createServer(app);

// ── WebSocket server ──────────────────────────────────────────────────────────
const { WebSocketServer } = require('ws');
const { handleGridCreated } = require('./handlers/gridHandler');

const wss = new WebSocketServer({ server });

// ── Mars push endpoint ────────────────────────────────────────────────────────
app.post('/api/cell-update', express.json(), (req, res) => {
  const { id, weather } = req.body;
  if (!id || !weather) {
    return res.status(400).json({ error: 'id and weather are required' });
  }
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: 'CELL_UPDATE', cell: { id, weather } }));
    }
  });
  res.status(200).json({ ok: true });
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === 'GRID_CREATED') {
      const broadcast = (msg) => {
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(msg));
          }
        });
      };
      const sendToClient = (msg) => ws.send(JSON.stringify(msg));
      const marsUrl = process.env.MARS_SERVICE_URL || 'http://localhost:9000';
      const callbackUrl = process.env.CALLBACK_URL || 'http://localhost:5000';

      await handleGridCreated(message.grid, broadcast, sendToClient, marsUrl, callbackUrl);
    }
  });

  ws.on('error', (err) => console.error('WebSocket error:', err));
});

// ── Start server (only when run directly, not when imported by tests) ─────────
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
