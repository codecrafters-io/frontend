import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import type RouterService from '@ember/routing/router-service';
import type RouteInfo from '@ember/routing/route-info';
import type LocalStorageService from 'codecrafters-frontend/services/local-storage';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';

const LOCAL_STORAGE_KEY = 'dark-mode-preference-v2';

export type LocalStoragePreference = 'system' | 'dark' | 'light' | null;
export type SystemPreference = 'dark' | 'light';

export default class DarkModeService extends Service {
  @service declare router: RouterService;
  @service declare localStorage: LocalStorageService;
  @service declare fastboot: FastBootService;

  // Used to temporarily enable Dark Mode
  @tracked isEnabledTemporarily: boolean = false;

  /**
   * Currently loaded localStorage preference value
   */
  @tracked localStoragePreference?: LocalStoragePreference;

  /**
   * Currently loaded system preference value
   */
  @tracked systemPreference?: SystemPreference;

  constructor(...args: [object | undefined] | []) {
    super(...args);

    // Load the localStorage preference from localStorage service
    this.localStoragePreference = this.localStorage.getItem(LOCAL_STORAGE_KEY) as LocalStoragePreference;

    // There are no media queries when running under FastBoot
    if (this.fastboot.isFastBoot) {
      return;
    }

    // Create a media query to load current system Dark Mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Create a listener for media query result changes
    const mqChangeListener = (e: MediaQueryListEvent) => {
      this.systemPreference = e.matches ? 'dark' : 'light';
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
   * Returns whether current mode requires Dark Mode (doesn't support Light Mode)
   * @private
   */
  get #currentRouteRequiresDarkMode(): boolean {
    let currentRoute: RouteInfo | null = this.router.currentRoute;

    while (currentRoute) {
      const metadata = currentRoute.metadata;

      if (metadata instanceof RouteInfoMetadata) {
        if (metadata.colorScheme === RouteColorScheme.Dark) {
          return true;
        } else if (metadata.colorScheme === RouteColorScheme.Light) {
          return false;
        }
      }

      currentRoute = currentRoute.parent;
    }

    return false;
  }

  /**
   * Returns whether current route supports Dark Mode
   * @private
   */
  get currentRouteSupportsDarkMode(): boolean {
    let currentRoute: RouteInfo | null = this.router.currentRoute;

    while (currentRoute) {
      const metadata = currentRoute.metadata;

      if (metadata instanceof RouteInfoMetadata) {
        if (metadata.colorScheme === RouteColorScheme.Dark || metadata.colorScheme === RouteColorScheme.Both) {
          return true;
        } else if (metadata.colorScheme === RouteColorScheme.Light) {
          return false;
        }
      }

      currentRoute = currentRoute.parent;
    }

    return false;
  }

  /**
   * Indicates whether Dark Mode is currently enabled: either because visiting a
   * "dark route", or derived from localStorage & system preference
   */
  get isEnabled(): boolean {
    return this.currentRouteSupportsDarkMode && (this.#currentRouteRequiresDarkMode || this.#isEnabledViaPreferences || this.isEnabledTemporarily);
  }

  /**
   * Returns whether Dark Mode should be enabled based on localStorage & system preference
   * @private
   */
  get #isEnabledViaPreferences(): boolean {
    return this.localStoragePreference === 'dark' || (this.localStoragePreference === 'system' && this.systemPreference === 'dark');
  }

  /**
   * Writes the new Dark Mode preference to localStorage and updates loaded `localStoragePreference`
   * @param {'system'|'dark'|'light'|null} newValue New dark mode preference
   */
  @action
  updateLocalStoragePreference(newValue?: LocalStoragePreference) {
    if (!newValue) {
      this.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      this.localStorage.setItem(LOCAL_STORAGE_KEY, newValue);
    }

    this.localStoragePreference = newValue;
  }
}

declare module '@ember/service' {
  interface Registry {
    'dark-mode': DarkModeService;
  }
}
