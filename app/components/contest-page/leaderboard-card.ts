import { service } from '@ember/service';
import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type UserModel from 'codecrafters-frontend/models/user';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
    topEntries: LeaderboardEntryModel[];
    surroundingEntries: LeaderboardEntryModel[];
  };
};

export default class ContestPageLeaderboardCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get orderedSurroundingEntries(): LeaderboardEntryModel[] {
    return this.args.surroundingEntries.toArray().sort((a, b) => b.score - a.score);
  }

  get orderedTopEntries(): LeaderboardEntryModel[] {
    return this.args.topEntries.toArray().sort((a, b) => b.score - a.score);
  }

  get shouldShowSurroundingEntries(): boolean {
    return !!(this.authenticator.currentUser && !this.userIsInTopLeaderboardEntries);
  }

  get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.topEntries.some((entry) => entry.user.id === (this.authenticator.currentUser as UserModel).id);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::LeaderboardCard': typeof ContestPageLeaderboardCardComponent;
  }
}
