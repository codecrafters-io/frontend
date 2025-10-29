import Service from '@ember/service';

/**
 * Returns the localStorage key with application-specific prefix applied.
 *
 * @param {string} [key=''] - The unprefixed key.
 * @returns {string} The prefixed key used in window.localStorage.
 */
function prefixKey(key: string = ''): string {
  return `cc-frontend:${key}`;
}

/**
 * Collects and returns all keys from window.localStorage that start with the
 * application prefix. Returned keys are unprefixed (prefix removed).
 *
 * @returns {string[]} Array of keys stored under the application prefix.
 */
function getLocalStorageKeys(): string[] {
  return Array.from({ length: window.localStorage?.length || 0 }, (_, i) => window.localStorage?.key(i) || null)
    .filter((k) => k !== null)
    .filter((k) => k.startsWith(prefixKey()))
    .map((key) => key.substring(prefixKey().length));
}

/**
 * Service wrapping browser localStorage access and applying an app-specific prefix
 * to all keys. Provides safe guards for environments where window.localStorage
 * may be unavailable and convenience methods for common operations.
 */
export default class LocalStorageService extends Service {
  /**
   * Initialize the service and perform cleanup of known legacy keys.
   * TODO: legacy key removal is temporary and can be removed after migration.
   */
  constructor() {
    super();

    // TODO: Remove legacy keys from local storage - safe to drop a month after merge
    this.clearLegacyKeys();
  }

  /**
   * Number of prefixed keys available in window.localStorage.
   */
  get length(): number {
    return getLocalStorageKeys().length;
  }

  /**
   * Remove all prefixed keys from window.localStorage.
   */
  clear(): void {
    for (const key of getLocalStorageKeys()) {
      this.removeItem(key);
    }
  }

  /**
   * Remove known legacy keys that were stored without the current prefix.
   * This is a one-time migration helper.
   */
  clearLegacyKeys() {
    for (const key of [
      'current_user_cache_v1:user_id',
      'current_user_cache_v1:username',
      'preferred-language-leaderboard-v1',
      'leaderboard-team-selection-v1',
      'session_token_v1',
    ]) {
      window.localStorage?.removeItem(key);
    }
  }

  /**
   * Get a value from localStorage for the given key (unprefixed).
   *
   * @param {string} key - The unprefixed key to retrieve.
   * @returns {string | null} The stored value, or null if not found or unavailable.
   */
  getItem(key: string): string | null {
    if (!window.localStorage) {
      return null;
    }

    return window.localStorage.getItem(prefixKey(key));
  }

  /**
   * Retrieve the unprefixed key at the given index.
   *
   * @param {number} index - Index of the key to retrieve.
   * @returns {string | null} The unprefixed key or null if out of range.
   */
  key(index: number): string | null {
    return getLocalStorageKeys()[index] || null;
  }

  /**
   * Remove the item associated with the given unprefixed key from localStorage.
   *
   * @param {string} key - The unprefixed key to remove.
   * @throws Will throw if window.localStorage is not available.
   */
  removeItem(key: string): void {
    if (!window.localStorage) {
      throw new Error('Removing localStorage items is unavailable in the current context');
    }

    window.localStorage.removeItem(prefixKey(key));
  }

  /**
   * Set an item in localStorage under the given unprefixed key.
   *
   * @param {string} key - The unprefixed key under which to store the value.
   * @param {string} value - The string value to store.
   * @throws Will throw if window.localStorage is not available.
   */
  setItem(key: string, value: string): void {
    if (!window.localStorage) {
      throw new Error('Setting localStorage items is unavailable in the current context');
    }

    window.localStorage.setItem(prefixKey(key), value);
  }
}
