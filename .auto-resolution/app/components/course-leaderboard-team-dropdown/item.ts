import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    text: string;
    logo: string;
    isActive: boolean;
  };
}

export default class CourseLeaderboardTeamDropdownItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseLeaderboardTeamDropdown::Item': typeof CourseLeaderboardTeamDropdownItem;
  }
}
