import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CoursesRoute extends Route {
  @service currentUser;

  async model() {
    await this.currentUser.authenticate();

    return {
      courses: await this.store.findAll('course'),
    };
  }
}
