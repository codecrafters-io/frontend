import Service from '@ember/service';

export default class CurrentUserCacheStorageService extends Service {
  static USER_ID_LOCAL_STORAGE_KEY = 'current_user_cache_v1:user_id';
  static USERNAME_LOCAL_STORAGE_KEY = 'current_user_cache_v1:username';

  clear(): void {
    localStorage.removeItem(CurrentUserCacheStorageService.USER_ID_LOCAL_STORAGE_KEY);
    localStorage.removeItem(CurrentUserCacheStorageService.USERNAME_LOCAL_STORAGE_KEY);
  }

  get userId(): string | null {
    return localStorage.getItem(CurrentUserCacheStorageService.USER_ID_LOCAL_STORAGE_KEY);
  }

  get username(): string | null {
    return localStorage.getItem(CurrentUserCacheStorageService.USERNAME_LOCAL_STORAGE_KEY);
  }

  setValues(userId: string, username: string): void {
    localStorage.setItem(CurrentUserCacheStorageService.USER_ID_LOCAL_STORAGE_KEY, userId);
    localStorage.setItem(CurrentUserCacheStorageService.USERNAME_LOCAL_STORAGE_KEY, username);
  }
}
