import { service } from '@ember/service';
import Component from '@glimmer/component';
import ContestModel from 'codecrafters-frontend/models/contest';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type UserModel from 'codecrafters-frontend/models/user';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    contest: ContestModel;
    languages: LanguageModel[];
    topEntries: LeaderboardEntryModel[];
    surroundingEntries: LeaderboardEntryModel[];
  };
}

export default class ContestPageLeaderboardCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get filteredTopEntries() {
    return this.args.topEntries.filter((e) => e.leaderboard.id === this.args.contest.leaderboard.id);
  }

  get orderedSurroundingEntries(): LeaderboardEntryModel[] {
    return this.args.surroundingEntries.toArray().sort((a, b) => b.score - a.score);
  }

  get orderedTopEntries(): LeaderboardEntryModel[] {
    return this.filteredTopEntries
      .toArray()
      .sort((a, b) => b.score - a.score)
      .filter((entry) => !entry.isBanned || (this.authenticator.currentUser && entry.user.id === this.authenticator.currentUser.id));
  }

  get shouldShowSurroundingEntries(): boolean {
    return !!(this.authenticator.currentUser && !this.userIsInTopLeaderboardEntries && this.orderedSurroundingEntries.length);
  }

  get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.filteredTopEntries.some((entry) => entry.user.id === (this.authenticator.currentUser as UserModel).id);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::LeaderboardCard': typeof ContestPageLeaderboardCardComponent;
  }
}
