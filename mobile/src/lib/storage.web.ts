// Web preview uses localStorage; expo-sqlite on web needs extra server headers.
export function loadJSON<T>(key: string): T | null {
  try {
    const raw = typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); changes just won't persist.
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {}
}
