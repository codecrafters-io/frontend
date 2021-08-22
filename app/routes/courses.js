import Route from '@ember/routing/route';

export default class CoursesRoute extends Route {
  async model() {
    return {
      courses: await this.store.findAll('course'),
    };
  }
}
