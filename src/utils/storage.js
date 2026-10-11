export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable: ignore so the app keeps working.
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
