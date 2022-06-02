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

  get lastPushedRepository() {
    if (this.currentUser.isAuthenticated) {
      return this.currentUser.record.repositories.filterBy('course', this.args.course).filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt')
        .lastObject;
    } else {
      return null;
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
