import URLItem from './URLItem';

function URLList({ urls, loading, error, onDelete }) {
  if (loading) {
    return <p className="url-list__status">Loading…</p>;
  }

  if (error) {
    return <p className="url-list__status url-list__status--error">{error}</p>;
  }

  if (!urls.length) {
    return (
      <p className="url-list__status">
        No links yet. Shorten one above to get started.
      </p>
    );
  }

  return (
    <ul className="url-list">
      {urls.map((url) => (
        <URLItem key={url.id} url={url} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default URLList;
