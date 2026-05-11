import { useCallback, useEffect, useState } from 'react';
import URLForm from './components/URLForm';
import URLList from './components/URLList';
import UsageGuide from './components/UsageGuide';
import { deleteUrl, listUrls } from './api/urls';

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listUrls();
      setUrls(rows || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleCreated(row) {
    setUrls((prev) => [row, ...prev]);
  }

  async function handleDelete(id) {
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <h1>
            URL <span className="accent">Shortener</span>
          </h1>
          <p className="app-header__tagline">
            Paste a long link, get a tiny one. Powered by TinyURL.
          </p>
        </div>
      </header>

      <main className="app-main">
        <URLForm onCreated={handleCreated} />
        <URLList
          urls={urls}
          loading={loading}
          error={error}
          onDelete={handleDelete}
        />
        <UsageGuide />
      </main>

      <footer className="app-footer">
        Built by Martin Maina · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
