import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class CoursesRoute extends AuthenticatedRoute {
  allowsAnonymousAccess = true;
  @service currentUser;

  async model(params) {
    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });

    return {
      course: courses.findBy('slug', params.course_slug),
    };
  }
}
