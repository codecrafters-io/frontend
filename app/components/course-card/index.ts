import Component from '@glimmer/component';
import { service } from '@ember/service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Args: {
    course?: CourseModel;
  };
}

export default class CourseCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get course(): CourseModel {
    return this.args.course!;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get isSkeleton() {
    return !this.args.course;
  }

  get lastUsedRepository(): RepositoryModel | null {
    if (this.isSkeleton) {
      return null;
    }

    if (this.authenticator.currentUserIsLoaded) {
      const lastPushedRepository = this.currentUser!.repositories.filterBy('course', this.args.course)
        .filterBy('firstSubmissionCreated')
        .sortBy('lastSubmissionAt')
        .at(-1);

      const lastCreatedRepository = this.currentUser!.repositories.filterBy('course', this.args.course).sortBy('createdAt').at(-1);

      return lastPushedRepository ? lastPushedRepository : (lastCreatedRepository ?? null);
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
      model: this.args.course!.slug,
      query: {},
    };
  }

  get shouldShowLockIcon() {
    if (this.authenticator.currentUser?.canAccessPaidContent) {
      return false;
    }

    if (!this.args.course) {
      return false;
    }

    return !(this.args.course.releaseStatusIsBeta || this.args.course.isFree);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseCard: typeof CourseCard;
  }
}
