const axios = require('axios');

const TINYURL_API = 'https://api.tinyurl.com/create';

async function shortenUrl({ originalUrl, alias }) {
  const token = process.env.TINYURL_TOKEN;
  if (!token) {
    const err = new Error('TINYURL_TOKEN is not configured on the server');
    err.status = 500;
    throw err;
  }

  const body = { url: originalUrl };
  if (alias) {
    body.alias = alias;
  }

  try {
    const response = await axios.post(TINYURL_API, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    const data = response.data && response.data.data;
    if (!data || !data.tiny_url) {
      const err = new Error('TinyURL response missing tiny_url');
      err.status = 502;
      throw err;
    }

    return {
      shortUrl: data.tiny_url,
      tinyurlAlias: data.alias || null,
    };
  } catch (err) {
    if (err.response) {
      const message =
        (err.response.data && err.response.data.errors && err.response.data.errors[0]) ||
        `TinyURL API error (HTTP ${err.response.status})`;
      const wrapped = new Error(message);
      wrapped.status = err.response.status === 422 ? 400 : 502;
      throw wrapped;
    }
    if (err.status) {
      throw err;
    }
    const wrapped = new Error(`TinyURL request failed: ${err.message}`);
    wrapped.status = 502;
    throw wrapped;
  }
}

module.exports = { shortenUrl };
