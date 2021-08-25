import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CoursesRoute extends Route {
  @service session;

  beforeModel() {
    this.session.authenticate('authenticator:custom');
  }

  async model() {
    return {
      courses: await this.store.findAll('course'),
    };
  }
}
