import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class AdminCourseRoute extends Route {
  @service currentUser;
  @service store;

  async model(params) {
    await this.currentUser.authenticate();

    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
    let course = courses.findBy('slug', params.course_slug);

    return {
      course: course,
      submissions: [],
    };
  }
}
