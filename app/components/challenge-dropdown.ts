import { action } from '@ember/object';
import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';
import type { Dropdown } from 'ember-basic-dropdown/components/basic-dropdown';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    challenges: CourseModel[];
    requestedChallenge: CourseModel | null; // This is highlighted with an exclamation mark if it's not the selected one
    selectedChallenge: CourseModel | null;
    onDidInsertDropdown?: (dropdown: Dropdown | null) => void;
    onRequestedChallengeChange: (challenge: CourseModel) => void;
  };
}

export default class ChallengeDropdownComponent extends Component<Signature> {
  @action
  handleChallengeDropdownLinkClick(challenge: CourseModel, closeDropdownFn: () => void) {
    closeDropdownFn();
    this.args.onRequestedChallengeChange(challenge);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ChallengeDropdown: typeof ChallengeDropdownComponent;
  }
}
