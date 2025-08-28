import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Store from '@ember-data/store';
import type LanguageModel from 'codecrafters-frontend/models/language';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    selectedLanguage: LanguageModel;
  };
}

export default class LeaderboardPageHeader extends Component<Signature> {
  @service declare store: Store;

  get sortedLanguagesForDropdown(): LanguageModel[] {
    return this.store
      .peekAll('language')
      .sortBy('sortPositionForTrack')
      .filter((language) => language.stagesCount > 0);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'LeaderboardPage::Header': typeof LeaderboardPageHeader;
  }
}
