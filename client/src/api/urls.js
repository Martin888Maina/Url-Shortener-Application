const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = (data && data.error) || `Request failed (HTTP ${response.status})`;
    throw new Error(message);
  }

  return data;
}

export function listUrls() {
  return request('/urls');
}

export function createUrl({ originalUrl, customAlias }) {
  const body = { original_url: originalUrl };
  if (customAlias) {
    body.custom_alias = customAlias;
  }
  return request('/urls', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function deleteUrl(id) {
  return request(`/urls/${id}`, { method: 'DELETE' });
}
