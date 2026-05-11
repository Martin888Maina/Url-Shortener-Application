function App() {
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
        <div className="placeholder">
          Form and history will appear here in the next phase.
        </div>
      </main>

      <footer className="app-footer">
        Built by Martin Maina · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
