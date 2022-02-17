import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseCardComponent extends Component {
  @service currentUser;
  @service router;

  @action
  async navigateToCourse() {
    await this.router.transitionTo('course', this.args.course.slug, { queryParams: { fresh: null } });
  }

  get lastPushedRepository() {
    if (this.currentUser.isAuthenticated) {
      return this.currentUser.record.repositories.filterBy('course', this.args.course).filterBy('firstSubmissionCreated').sortBy('lastSubmissionAt')
        .lastObject;
    } else {
      return null;
    }
  }
}
