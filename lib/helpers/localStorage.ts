export function getStorageItem(key: string): string | null {
  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  window.localStorage.setItem(key, value);
}

export function deleteStorageItem(key: string): void {
  window.localStorage.removeItem(key);
}
