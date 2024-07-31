import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import { htmlSafe } from '@ember/template';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    progressDenominator?: number;
    progressNumerator?: number;
    route: string;
    routeModel?: string;
    status?: string;
    isForCurrentUser?: boolean;
    isCollapsed?: boolean;
    user?: UserModel; // undefined if skeleton
  };

  Blocks: {
    afterUsername: [];
  };
}

export default class LeaderboardEntryComponent extends Component<Signature> {
  get isSkeleton(): boolean {
    return !this.args.user;
  }

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressPercentage}%;`);
  }

  get progressPercentage(): number {
    return 100 * (this.args.progressNumerator / this.args.progressDenominator);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LeaderboardEntry: typeof LeaderboardEntryComponent;
  }
}
