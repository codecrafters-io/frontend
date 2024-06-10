import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseCardComponent extends Component {
  @service authenticator;
  @service router;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get isSkeleton() {
    return !this.args.course;
  }

  get lastUsedRepository() {
    if (this.isSkeleton) {
      return null;
    }

    if (this.authenticator.currentUserIsLoaded) {
      const lastPushedRepository = this.currentUser.repositories
        .filterBy('course', this.args.course)
        .filterBy('firstSubmissionCreated')
        .sortBy('lastSubmissionAt')
        .at(-1);

      const lastCreatedRepository = this.currentUser.repositories.filterBy('course', this.args.course).sortBy('createdAt').at(-1);

      return lastPushedRepository ? lastPushedRepository : lastCreatedRepository;
    } else {
      return null;
    }
  }

  get linkToRoute() {
    if (this.isSkeleton) {
      return {
        name: 'catalog',
        model: null,
        query: {},
      };
    }

    if (this.lastUsedRepository) {
      return {
        name: 'course',
        model: this.args.course.slug,
        query: { fresh: null },
      };
    } else {
      return {
        name: 'course-overview',
        model: this.args.course.slug,
        query: {},
      };
    }
  }

  get shouldShowCourseCard() {
    if (this.lastUsedRepository) {
      return true;
    }

    if (this.args.course?.releaseStatusIsDeprecated) {
      return false;
    }

    return true;
  }
}
