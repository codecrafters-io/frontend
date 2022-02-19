import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';
import { inject as service } from '@ember/service';

export default class AdminCoursesRoute extends AuthenticatedRoute {
  @service currentUser;

  async model() {
    return {
      courses: await this.store.findAll('course'),
    };
  }
}
