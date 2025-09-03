import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
    surroundingEntries: LeaderboardEntryModel[];
    topEntries: LeaderboardEntryModel[];
  };
}

export default class LeaderboardPageEntriesTable extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get hasEntries() {
    return this.args.topEntries.length > 0;
  }

  get explanationMarkdownForStagesCompleted() {
    return `There are ${this.args.language.stagesCount} stages available in this track.`;
  }

  get explanationMarkdownForScore() {
    return `
The highest possible score for this track is ${this.args.topEntries[0]!.leaderboard.highestPossibleScore}.

Harder stages have higher scores assigned to them.
`.trim();
  }

  get shouldShowSurroundingEntries(): boolean {
    return !!(this.authenticator.isAuthenticated && !this.userIsInTopLeaderboardEntries && this.sortedSurroundingEntries.length > 0);
  }

  get sortedTopEntries() {
    return this.args.topEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get sortedSurroundingEntries() {
    return this.args.surroundingEntries.filter((entry) => !entry.isBanned).sort((a, b) => b.score - a.score);
  }

  get userIsInTopLeaderboardEntries(): boolean {
    if (!this.authenticator.isAuthenticated) {
      return false;
    }

    return this.args.topEntries.some((entry) => entry.user.id === this.authenticator.currentUserId);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::EntriesTable': typeof LeaderboardPageEntriesTable;
  }
}
