import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import { inject as service } from '@ember/service';

type Signature = {
  Element: HTMLAnchorElement;

  Args: {
    entry: LeaderboardEntryModel;
    languages: LanguageModel[];
  };
};

export default class ContestPageLeaderboardEntryComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get colorClasses(): string {
    if (this.isCurrentUserEntry) {
      if (this.args.entry.isBanned) {
        return 'dark:border-gray-500 opacity-25 grayscale';
      } else {
        return 'dark:border-green-500';
      }
    } else {
      return 'dark:border-gray-800 dark:hover:border-gray-700';
    }
  }

  get isCurrentUserEntry(): boolean {
    if (!this.authenticator.currentUser) {
      return false;
    }

    return this.args.entry.user.id === this.authenticator.currentUser.id;
  }

  get languagesForEntry(): LanguageModel[] {
    return this.args.languages.filter((language) => this.args.entry.relatedLanguageSlugs.includes(language.slug));
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ContestPage::LeaderboardEntry': typeof ContestPageLeaderboardEntryComponent;
  }
}
