import Service from '@ember/service';

export default class SessionTokenStorageService extends Service {
  static LOCAL_STORAGE_KEY = 'session_token_v1';

  clear(): void {
    localStorage.removeItem(SessionTokenStorageService.LOCAL_STORAGE_KEY);
  }

  get currentToken(): string | null {
    return localStorage.getItem(SessionTokenStorageService.LOCAL_STORAGE_KEY);
  }

  get hasToken(): boolean {
    return !!this.currentToken;
  }

  setToken(sessionToken: string): void {
    localStorage.setItem(SessionTokenStorageService.LOCAL_STORAGE_KEY, sessionToken);
  }
}
