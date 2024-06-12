import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
};

export default class TrackCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  get completedStagesCount() {
    if (!this.authenticator.currentUser) {
      return 0;
    }

    return this.authenticator.currentUser.repositories
      .filterBy('language', this.args.language)
      .toArray()
      .flatMap((repository) => repository.completedStages)
      .uniq().length;
  }

  get currentUserHasStartedTrack() {
    if (this.authenticator.currentUser) {
      return !!this.authenticator.currentUser.repositories.filterBy('language', this.args.language).filterBy('firstSubmissionCreated')[0];
    } else {
      return false;
    }
  }

  get stagesCount() {
    return this.store
      .peekAll('course')
      .rejectBy('releaseStatusIsAlpha')
      .rejectBy('releaseStatusIsDeprecated')
      .filter((course) => course.betaOrLiveLanguages.includes(this.args.language))
      .mapBy('stages.length')
      .reduce((a, b) => a + b, 0);
  }

  @action
  async navigateToTrack() {
    await this.router.transitionTo('track', this.args.language.slug);
  }
}
