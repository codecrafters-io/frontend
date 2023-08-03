import Service, { inject as service } from '@ember/service';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';

export default class SessionTokenStorageService extends Service {
  static LOCAL_STORAGE_KEY = 'session_token_v1';

  @service declare localStorage: LocalStorageService;

  clear(): void {
    this.localStorage.removeItem(SessionTokenStorageService.LOCAL_STORAGE_KEY);
  }

  get currentToken(): string | null {
    return this.localStorage.getItem(SessionTokenStorageService.LOCAL_STORAGE_KEY);
  }

  get hasToken(): boolean {
    return !!this.currentToken;
  }

  setToken(sessionToken: string): void {
    this.localStorage.setItem(SessionTokenStorageService.LOCAL_STORAGE_KEY, sessionToken);
  }
}
