import { inject as service } from '@ember/service';
import AuthenticatedRoute from 'codecrafters-frontend/lib/authenticated-route';
import RSVP from 'rsvp';

export default class CoursesRoute extends AuthenticatedRoute {
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
    modelPromises.courses = this.store.findAll('course', { include: 'stages,supported-languages' });
    return RSVP.hash(modelPromises);
  }
}
