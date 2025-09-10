import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCollapsed: boolean;
    text: string;
  };
}

export default class CourseLeaderboardInviteButtonEntry extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseLeaderboard::InviteButtonEntry': typeof CourseLeaderboardInviteButtonEntry;
  }
}
