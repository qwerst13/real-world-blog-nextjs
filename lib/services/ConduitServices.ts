export default class ConduitServices {
  private host = process.env.API_URL;

  private getStorageItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }
}
