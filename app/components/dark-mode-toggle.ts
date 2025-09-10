import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import type { LocalStoragePreference } from 'codecrafters-frontend/services/dark-mode';

export interface Signature {
  Element: Element;

  Args: {
    isDisabled?: boolean;
    size?: 'regular' | 'small';
  };
}

export default class DarkModeToggle extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare darkMode: DarkModeService;

  possiblePreferences: LocalStoragePreference[] = ['system', 'light', 'dark'];

  get currentPreference() {
    return this.darkMode.localStoragePreference || 'light';
  }

  @action
  setPreference(newValue: LocalStoragePreference) {
    if (this.args.isDisabled) {
      return;
    }

    this.darkMode.updateLocalStoragePreference(newValue);

    this.analyticsEventTracker.track('changed_theme', {
      theme: newValue,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DarkModeToggle: typeof DarkModeToggle;
  }
}
