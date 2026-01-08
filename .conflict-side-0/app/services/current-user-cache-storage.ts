import Service, { service } from '@ember/service';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';

export default class CurrentUserCacheStorageService extends Service {
  static USER_ID_LOCAL_STORAGE_KEY = 'current_user_cache_v1:user_id';
  static USERNAME_LOCAL_STORAGE_KEY = 'current_user_cache_v1:username';

  @service declare localStorage: LocalStorageService;

  get userId(): string | null {
    return this.localStorage.getItem(CurrentUserCacheStorageService.USER_ID_LOCAL_STORAGE_KEY);
  }

  get username(): string | null {
    return this.localStorage.getItem(CurrentUserCacheStorageService.USERNAME_LOCAL_STORAGE_KEY);
  }

  clear(): void {
    this.localStorage.removeItem(CurrentUserCacheStorageService.USER_ID_LOCAL_STORAGE_KEY);
    this.localStorage.removeItem(CurrentUserCacheStorageService.USERNAME_LOCAL_STORAGE_KEY);
  }

  setValues(userId: string, username: string): void {
    this.localStorage.setItem(CurrentUserCacheStorageService.USER_ID_LOCAL_STORAGE_KEY, userId);
    this.localStorage.setItem(CurrentUserCacheStorageService.USERNAME_LOCAL_STORAGE_KEY, username);
  }
}
