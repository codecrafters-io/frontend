import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

export default class CourseCard extends Component {
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
        .filter((item) => item.course === this.args.course)
        .filter((item) => item.firstSubmissionCreated)
        .toSorted(fieldComparator('lastSubmissionAt'))
        .at(-1);

      const lastCreatedRepository = this.currentUser.repositories
        .filter((item) => item.course === this.args.course)
        .toSorted(fieldComparator('createdAt'))
        .at(-1);

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

    return {
      name: 'course-overview',
      model: this.args.course.slug,
      query: {},
    };
  }
}
