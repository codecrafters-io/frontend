import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CoursesRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;

  async model() {
    let modelPromises = {};

    if (this.currentUser.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
      });
    }

    modelPromises.courses = this.store.findAll('course', { include: 'stages.solutions,supported-languages' });

    return RSVP.hash(modelPromises);
  }
}
