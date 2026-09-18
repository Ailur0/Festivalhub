import Storage from 'expo-sqlite/kv-store';

// Synchronous reads let app state load before the first render, so screens never
// flash empty data on launch.
export function loadJSON<T>(key: string): T | null {
  try {
    const raw = Storage.getItemSync(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveJSON(key: string, value: unknown): void {
  Storage.setItem(key, JSON.stringify(value)).catch(() => {
    // A failed write only loses unsaved demo changes; the app keeps working.
  });
}

export function removeKey(key: string): void {
  Storage.removeItem(key).catch(() => {});
}
