export function getStorageItem(key: string): string | null {
  return window.sessionStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  window.localStorage.setItem(key, value);
}
