import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';

export default class CoursesRoute extends AuthenticatedRoute {
  allowsAnonymousAccess = true;
  @service currentUser;

  async model() {
    if (this.currentUser.isAuthenticated) {
      await this.store.query('repository', {
        include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
      });
    }

    return {
      courses: await this.store.query('course', { include: 'stages,supported-languages' }),
    };
  }
}
