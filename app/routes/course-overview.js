import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class CourseOverviewRoute extends AuthenticatedRoute {
  allowsAnonymousAccess = true;
  @service currentUser;

  async model(params) {
    if (this.store.peekAll('course').findBy('slug', params.course_slug)) {
      return {
        course: this.store.peekAll('course').findBy('slug', params.course_slug),
      };
    } else {
      let courses = await this.store.findAll('course', { include: 'supported-languages,stages' });
      let course = courses.findBy('slug', params.course_slug);

      if (this.currentUser.isAuthenticated) {
        await this.store.query('repository', {
          include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
          course_id: course.id,
        });
      }

      return { course };
    }
  }
}
