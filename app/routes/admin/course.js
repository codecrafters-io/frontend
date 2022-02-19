import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class AdminCourseRoute extends AuthenticatedRoute {
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
