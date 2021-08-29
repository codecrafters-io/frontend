import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CourseRoute extends Route {
  @service session;

  async model(params) {
    await this.session.authenticate('authenticator:custom');

    let courses = await this.store.findAll('course');
    let course = courses.findBy('slug', params.course_slug);
    console.log(courses.length);
    console.log(courses.length);

    return {
      course: course,
    };
  }
}
