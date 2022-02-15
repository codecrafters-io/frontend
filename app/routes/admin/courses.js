import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AdminCoursesRoute extends AuthenticatedRoute {
  @service currentUser;

  async model() {
    await this.currentUser.authenticate();

    return {
      courses: await this.store.findAll('course'),
    };
  }
}
