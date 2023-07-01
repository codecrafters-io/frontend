import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CourseCardComponent extends Component {
  @service authenticator;
  @service router;

  @action
  async navigateToCourse() {
    if (this.isSkeleton) {
      return;
    }

    if (this.lastPushedRepository) {
      await this.router.transitionTo('course', this.args.course.slug, { queryParams: { fresh: null } });
    } else {
      await this.router.transitionTo('course-overview', this.args.course.slug);
    }
  }

  get isSkeleton() {
    return !this.args.course;
  }

  get lastPushedRepository() {
    if (this.isSkeleton) {
      return null;
    }

    if (this.authenticator.currentUserIsLoaded) {
      return this.authenticator.currentUser.repositories
        .filterBy('course', this.args.course)
        .filterBy('firstSubmissionCreated')
        .sortBy('lastSubmissionAt').lastObject;
    } else {
      return null;
    }
  }
}
