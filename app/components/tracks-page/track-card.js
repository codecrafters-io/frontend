import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TrackCardComponent extends Component {
  @service authenticator;
  @service router;
  @service store;

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
      .filter((course) => course.betaOrLiveLanguages.includes(this.args.language))
      .mapBy('stages.length')
      .reduce((a, b) => a + b, 0);
  }

  @action
  async navigateToTrack() {
    await this.router.transitionTo('track', this.args.language.slug);
  }
}
