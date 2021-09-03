import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CoursesRoute extends Route {
  @service session;

  async model() {
    // await this.session.authenticate('authenticator:custom');

    return {
      courses: await this.store.findAll('course'),
    };
  }
}
