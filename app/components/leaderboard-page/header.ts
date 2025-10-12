import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type PreferredLanguageLeaderboardService from 'codecrafters-frontend/services/preferred-language-leaderboard';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    selectedLanguage: LanguageModel;
  };
}

export default class LeaderboardPageHeader extends Component<Signature> {
  @service declare preferredLanguageLeaderboard: PreferredLanguageLeaderboardService;
  @service declare router: RouterService;
  @service declare store: Store;

  get sortedLanguagesForDropdown(): LanguageModel[] {
    const allLanguages = this.store.peekAll('language');
    const preferredLanguageSlugs = this.preferredLanguageLeaderboard.preferredLanguageSlugs;

    return [
      // First show the user's preferred languages
      ...preferredLanguageSlugs.map((slug) => allLanguages.find((language) => language.slug === slug)).filter(Boolean),

      // Next, show all languages alphabetically
      ...(allLanguages as unknown as LanguageModel[])
        .sortBy('sortPositionForTrack')
        .filter((language) => !preferredLanguageSlugs.includes(language.slug))
        .filter((language) => language.liveOrBetaStagesCount > 0),
    ];
  }

  @action
  handleRequestedLanguageChange(language: LanguageModel) {
    this.router.transitionTo('leaderboard', language.slug);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::Header': typeof LeaderboardPageHeader;
  }
}
