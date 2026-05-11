const express = require('express');
const pool = require('../db/pool');
const { shortenUrl } = require('../services/tinyurl');

const router = express.Router();

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

router.post('/', async (req, res, next) => {
  try {
    const { original_url: originalUrl, custom_alias: customAlias } = req.body || {};

    if (!originalUrl || typeof originalUrl !== 'string' || !isValidHttpUrl(originalUrl)) {
      return res.status(400).json({ error: 'original_url must be a valid http(s) URL' });
    }

    const alias =
      typeof customAlias === 'string' && customAlias.trim().length > 0
        ? customAlias.trim()
        : null;

    const { shortUrl, tinyurlAlias } = await shortenUrl({ originalUrl, alias });

    const insert = await pool.query(
      `INSERT INTO urls (original_url, short_url, tinyurl_alias, custom_alias)
       VALUES ($1, $2, $3, $4)
       RETURNING id, original_url, short_url, tinyurl_alias, custom_alias, created_at, click_count`,
      [originalUrl, shortUrl, tinyurlAlias, Boolean(alias)]
    );

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, original_url, short_url, tinyurl_alias, custom_alias, created_at, click_count
       FROM urls
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'id must be a positive integer' });
    }

    const result = await pool.query('DELETE FROM urls WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
