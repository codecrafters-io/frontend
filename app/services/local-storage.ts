import Service from '@ember/service';

export default class LocalStorageService extends Service {
  get length(): number {
    if (!window.localStorage) {
      return 0;
    }

    return window.localStorage.length;
  }

  clear(): void {
    if (!window.localStorage) {
      throw new Error('Clearing localStorage items is unavailable in the current context');
    }

    window.localStorage.clear();
  }

  getItem(keyName: string): string | null {
    if (!window.localStorage) {
      return null;
    }

    return window.localStorage.getItem(keyName);
  }

  key(index: number): string | null {
    if (!window.localStorage) {
      return null;
    }

    return window.localStorage.key(index);
  }

  removeItem(keyName: string): void {
    if (!window.localStorage) {
      throw new Error('Removing localStorage items is unavailable in the current context');
    }

    window.localStorage.removeItem(keyName);
  }

  setItem(keyName: string, keyValue: string): void {
    if (!window.localStorage) {
      throw new Error('Setting localStorage items is unavailable in the current context');
    }

    window.localStorage.setItem(keyName, keyValue);
  }
}
