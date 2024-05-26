import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import RouterService from '@ember/routing/router-service';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';

export const LOCAL_STORAGE_KEY = 'dark-mode-preference';

export type UpdateListener = (isEnabled: boolean) => void;

export type LocalStoragePreference = 'system' | 'dark' | 'light';
type SystemPreference = 'dark' | 'light';

export default class DarkModeService extends Service {
  @service declare router: RouterService;
  @service declare localStorage: LocalStorageService;

  /**
   * Currently loaded localStorage preference value
   */
  @tracked localStoragePreference?: LocalStoragePreference;

  /**
   * Currently loaded system preference value
   */
  @tracked systemPreference?: SystemPreference;

  /**
   * Callback methods currently registered as listeners to Dark Mode environment changes
   * @private
   */
  #registeredListeners: UpdateListener[] = [];

  constructor(properties: object | undefined) {
    super(properties);

    // Load the localStorage preference from localStorage service
    this.localStoragePreference = (this.localStorage.getItem(LOCAL_STORAGE_KEY) as LocalStoragePreference | null) || undefined;

    // Create a media query to load current system Dark Mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Create a listener for media query result changes
    const mqChangeListener = (e: MediaQueryListEvent) => {
      this.systemPreference = e.matches ? 'dark' : 'light';
      this.invokeUpdateListeners();
    };

    // Load the current system preference by executing the media query
    this.systemPreference = mediaQuery.matches ? 'dark' : 'light';

    // Subscribe to media query result changes
    mediaQuery.addEventListener('change', mqChangeListener);

    // Unsubscribe from media query changes when service is destroyed
    registerDestructor(this, () => {
      mediaQuery.removeEventListener('change', mqChangeListener);
    });
  }

  /**
   * Indicates whether Dark Mode is currently enabled: either because visiting a
   * "dark route", or derived from localStorage & system preference
   */
  get isEnabled(): boolean {
    return this.#isVisitingDarkRoute || this.#isLocalStorageEnabled;
  }

  /**
   * Returns whether Dark Mode should be enabled based on localStorage & system preference
   * @private
   */
  get #isLocalStorageEnabled(): boolean {
    return this.localStoragePreference === 'dark' || (this.localStoragePreference === 'system' && this.systemPreference === 'dark');
  }

  /**
   * Returns whether Dark Mode should be enabled because the user is visiting a "dark route"
   * @private
   */
  get #isVisitingDarkRoute(): boolean {
    return this.router.currentRoute.metadata instanceof RouteInfoMetadata && !!this.router.currentRoute.metadata.isDarkRoute;
  }

  /**
   * Invokes all currently registered update listeners, passing them a new value
   */
  @action invokeUpdateListeners() {
    for (const listener of this.#registeredListeners) {
      listener(this.isEnabled);
    }
  }

  /**
   * Registers a callback to invoke when Dark Mode environment changes
   * @param listener method to invoke, new boolean value will be passed as first argument
   */
  @action registerUpdateListener(listener: UpdateListener) {
    this.#registeredListeners.push(listener);
  }

  /**
   * Unregisters a callback previsouly resigtered with `registerUpdateListener`
   * @param listener method to unregister, must be exactly the same instance, compared using `===`
   */
  @action unregisterUpdateListener(listener: UpdateListener) {
    if (this.#registeredListeners.includes(listener)) {
      this.#registeredListeners.removeAt(this.#registeredListeners.indexOf(listener));
    }
  }

  /**
   * Writes the new Dark Mode preference to localStorage and executes all currently
   * registered update listeners, passing them a new value
   * @param {'system'|'dark'|'light'|null} newValue New dark mode preference
   */
  @action updateLocalStoragePreference(newValue?: LocalStoragePreference) {
    if (!newValue) {
      this.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      this.localStorage.setItem(LOCAL_STORAGE_KEY, newValue);
    }

    this.localStoragePreference = newValue;
    this.invokeUpdateListeners();
  }
}

declare module '@ember/service' {
  interface Registry {
    'dark-mode': DarkModeService;
  }
}
