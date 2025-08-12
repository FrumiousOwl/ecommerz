export const isBrowser = typeof window !== "undefined";

export function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // noop
  }
}

export function readString(key: string, fallback: string = ""): string {
  if (!isBrowser) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ?? fallback;
  } catch (err) {
    return fallback;
  }
}

export function writeString(key: string, value: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    // noop
  }
}