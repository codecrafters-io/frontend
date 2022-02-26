import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class CoursesRoute extends ApplicationRoute {
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
