import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    selectedLanguage: LanguageModel;
  };
}

export default class LeaderboardPageHeader extends Component<Signature> {
  @service declare router: RouterService;
  @service declare store: Store;

  get sortedLanguagesForDropdown(): LanguageModel[] {
    return this.store
      .peekAll('language')
      .sortBy('sortPositionForTrack')
      .filter((language) => language.stagesCount > 0);
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
