import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
}

export default class TrackCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  get completedStagesCount() {
    if (!this.authenticator.currentUser) {
      return 0;
    }

    return this.authenticator.currentUser.repositories
      .filter((item) => item.language === this.args.language)
      .flatMap((repository) => repository.completedStages)
      .reduce(uniqReducer(), []).length;
  }

  get currentUserHasStartedTrack() {
    if (this.authenticator.currentUser) {
      return !!this.authenticator.currentUser.repositories
        .filter((item) => item.language === this.args.language)
        .filter((item) => item.firstSubmissionCreated)[0];
    } else {
      return false;
    }
  }

  @action
  async navigateToTrack() {
    await this.router.transitionTo('track', this.args.language.slug);
  }
}
