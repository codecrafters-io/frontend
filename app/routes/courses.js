import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class CoursesRoute extends AuthenticatedRoute {
  allowsAnonymousAccess = true;
  @service currentUser;

  async model() {
    await this.currentUser.authenticate();

    return {
      courses: await this.store.findAll('course'),
    };
  }
}
