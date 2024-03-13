import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { inject as service } from '@ember/service';
import type CourseModel from 'codecrafters-frontend/models/course';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export default class CourseAdminRoute extends BaseRoute {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  async beforeModel(transition: Transition) {
    await super.beforeModel(transition);

    await this.authenticator.authenticate();
    const { course_slug } = this.paramsFor('course-admin') as { course_slug: string };

    if (!this.authenticator.currentUser!.isCourseAuthor({ slug: course_slug } as CourseModel) && !this.authenticator.currentUser!.isStaff) {
      this.router.transitionTo('catalog');
    }
  }

  async model(params: { course_slug: string }) {
    const courses = await this.store.findAll('course', {
      include: 'extensions,stages,language-configurations.language',
    });

    return {
      course: courses.find((course) => course.slug === params.course_slug),
    };
  }
}
