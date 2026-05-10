-- URL Shortener — PostgreSQL schema
-- Apply with:
--   psql -U shortener_user -d url_shortener -f server/db/schema.sql

CREATE TABLE IF NOT EXISTS urls (
  id              SERIAL PRIMARY KEY,
  original_url    TEXT NOT NULL,
  short_url       TEXT NOT NULL UNIQUE,
  tinyurl_alias   TEXT,
  custom_alias    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  click_count     INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_urls_short_url  ON urls (short_url);
