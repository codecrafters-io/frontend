import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TrackCardComponent extends Component {
  @service currentUser;
  @service router;
  @service store;

  @action
  async navigateToTrack() {
    await this.router.transitionTo('track', this.args.language.slug);
  }

  get completedStagesCount() {
    return this.currentUser.record.repositories
      .filterBy('language', this.args.language)
      .toArray()
      .flatMap((repository) => repository.completedStages)
      .uniq().length;
  }

  get currentUserHasStartedTrack() {
    if (this.currentUser.isAuthenticated) {
      return !!this.currentUser.record.repositories.filterBy('language', this.args.language).filterBy('firstSubmissionCreated').firstObject;
    } else {
      return false;
    }
  }

  get stagesCount() {
    return this.store
      .peekAll('course')
      .filter((course) => course.supportedLanguages.includes(this.args.language))
      .mapBy('stages.length')
      .reduce((a, b) => a + b, 0);
  }
}
