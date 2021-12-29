import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class AdminCourseRoute extends Route {
  @service currentUser;
  @service store;

  async model(params) {
    await this.currentUser.authenticate();

    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
    let course = courses.findBy('slug', params.course_slug);

    let submissions = await this.store.findAll('submission', {
      course_slug: params.course_slug,
      include: 'evaluations,repository.language,repository.user,course-stage',
    });

    return {
      course: course,
      submissions: submissions,
    };
  }
}
