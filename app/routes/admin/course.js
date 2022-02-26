import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class AdminCourseRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  async model(params) {
    let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
    let course = courses.findBy('slug', params.course_slug);

    let submissions = await this.store.query('submission', {
      course_id: course.id,
      include: 'evaluations,repository.language,repository.user,course-stage',
    });

    return {
      course: course,
      submissions: submissions,
    };
  }
}
