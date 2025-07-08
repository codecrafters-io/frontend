import Component from '@glimmer/component';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    challenge: CourseModel;
    onClick: () => void;
    isSelected: boolean;
    isEnabled: boolean;
    isRequested: boolean;
  };
}

export default class ChallengeDropdownLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ChallengeDropdownLink: typeof ChallengeDropdownLinkComponent;
  }
}
