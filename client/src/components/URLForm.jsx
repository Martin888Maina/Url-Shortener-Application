import { useState } from 'react';
import { createUrl } from '../api/urls';

function URLForm({ onCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const trimmedUrl = originalUrl.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL.');
      return;
    }

    setSubmitting(true);
    try {
      const row = await createUrl({
        originalUrl: trimmedUrl,
        customAlias: customAlias.trim() || undefined,
      });
      setOriginalUrl('');
      setCustomAlias('');
      onCreated?.(row);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <div className="url-form__row">
        <label htmlFor="original-url" className="sr-only">
          Long URL
        </label>
        <input
          id="original-url"
          type="url"
          inputMode="url"
          placeholder="https://example.com/some/long/path"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          disabled={submitting}
          required
        />
        <label htmlFor="custom-alias" className="sr-only">
          Custom alias (optional)
        </label>
        <input
          id="custom-alias"
          type="text"
          placeholder="custom alias (optional)"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          disabled={submitting}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Shortening…' : 'Shorten'}
        </button>
      </div>
      {error && <p className="url-form__error">{error}</p>}
    </form>
  );
}

export default URLForm;
