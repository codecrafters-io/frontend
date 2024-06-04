import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type DarkModeService from 'codecrafters-frontend/services/dark-mode';
import type { LocalStoragePreference } from 'codecrafters-frontend/services/dark-mode';

export interface Signature {
  Element: Element;
  Args: {
    Named: {
      onDarkModeToggled?: (newValue?: LocalStoragePreference) => void;
    };
  };
  Blocks: { default?: [] };
}

export default class DarkModeToggleComponent extends Component<Signature> {
  @service declare darkMode: DarkModeService;

  @action setPreference(newValue: LocalStoragePreference | null) {
    this.darkMode.updateLocalStoragePreference(newValue || undefined);

    if (this.args.onDarkModeToggled) {
      this.args.onDarkModeToggled(newValue || undefined);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DarkModeToggle: typeof DarkModeToggleComponent;
  }
}
