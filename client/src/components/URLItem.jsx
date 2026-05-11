import { useState } from 'react';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function URLItem({ url, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function handleDelete() {
    if (deleting) return;
    setDeleting(true);
    try {
      await onDelete(url.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <li className="url-item">
      <div className="url-item__main">
        <a
          className="url-item__short"
          href={url.short_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.short_url}
        </a>
        <span className="url-item__original" title={url.original_url}>
          {url.original_url}
        </span>
        <span className="url-item__meta">
          {formatDate(url.created_at)} · {url.click_count} clicks
          {url.custom_alias ? ' · custom alias' : ''}
        </span>
      </div>
      <div className="url-item__actions">
        <button type="button" onClick={handleCopy} className="btn-secondary">
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="btn-danger"
          disabled={deleting}
        >
          {deleting ? '…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

export default URLItem;
