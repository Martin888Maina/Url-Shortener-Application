require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
const urlsRouter = require('./routes/urls');

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : false,
  })
);

app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    res.status(500).json({ ok: false, db: 'disconnected', error: err.message });
  }
});

app.use('/api/urls', urlsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  const payload = { error: 'Internal server error' };
  if (NODE_ENV !== 'production') {
    payload.message = err.message;
    payload.stack = err.stack;
  }
  res.status(err.status || 500).json(payload);
});

app.listen(PORT, () => {
  console.log(`URL Shortener API listening on port ${PORT} (${NODE_ENV})`);
});
