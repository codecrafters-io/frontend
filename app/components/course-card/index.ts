import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
  };
}

export default class CourseCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

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
      const lastPushedRepository = [
        ...(this.currentUser
          ? this.currentUser.repositories.filter((item) => item.course === this.args.course).filter((item) => item.firstSubmissionCreated)
          : []),
      ]
        .sort((a, b) => compare(a.lastSubmissionAt, b.lastSubmissionAt))
        .at(-1);

      const lastCreatedRepository = [...(this.currentUser ? this.currentUser.repositories.filter((item) => item.course === this.args.course) : [])]
        .sort((a, b) => compare(a.createdAt, b.createdAt))
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseCard: typeof CourseCardComponent;
  }
}
