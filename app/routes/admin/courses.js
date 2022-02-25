import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import { inject as service } from '@ember/service';

export default class AdminCoursesRoute extends ApplicationRoute {
  @service currentUser;

  async model() {
    return {
      courses: await this.store.findAll('course'),
    };
  }
}
