import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCollapsed?: boolean;
  };
}

export default class TrackLeaderboardSkeletonRow extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackLeaderboard::SkeletonRow': typeof TrackLeaderboardSkeletonRow;
  }
}
