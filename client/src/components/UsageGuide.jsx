function IconClipboard() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="8" y="4" width="8" height="3" rx="1" />
      <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="13" y2="15" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
      <polyline points="12 7 12 12 16 14" />
    </svg>
  );
}

const STEPS = [
  {
    Icon: IconClipboard,
    title: '1. Paste your long URL',
    body: 'Drop any http or https link into the input field above. There is no length limit on what you can shorten.',
  },
  {
    Icon: IconLink,
    title: '2. Add a custom alias (optional)',
    body: 'Want a memorable ending like /my-portfolio? Type it into the second field. Leave blank to let TinyURL pick one for you.',
  },
  {
    Icon: IconCopy,
    title: '3. Click Shorten, then Copy',
    body: 'A new entry appears at the top of the list. Hit Copy to put the shortened link on your clipboard, ready to share.',
  },
  {
    Icon: IconHistory,
    title: '4. Manage your history',
    body: 'Every link you create is saved here. Open it in a new tab, see when it was created, or delete it when you no longer need it.',
  },
];

function UsageGuide() {
  return (
    <section className="usage-guide" aria-labelledby="usage-guide-title">
      <h2 id="usage-guide-title" className="usage-guide__title">
        How to use this app
      </h2>
      <p className="usage-guide__intro">
        Four simple steps. Everything you create is saved so you can come back
        to it later.
      </p>
      <div className="usage-guide__grid">
        {STEPS.map(({ Icon, title, body }) => (
          <article key={title} className="usage-card">
            <div className="usage-card__icon" aria-hidden="true">
              <Icon />
            </div>
            <h3 className="usage-card__title">{title}</h3>
            <p className="usage-card__body">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UsageGuide;
