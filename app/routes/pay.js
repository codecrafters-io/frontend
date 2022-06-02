import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class PayRoute extends ApplicationRoute {
  @service currentUser;

  async model() {
    let modelPromises = {};

    modelPromises.repositories = this.store.findAll('repository', {
      include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
    });

    modelPromises.courses = this.store.findAll('course', { include: 'stages.solutions.language,supported-languages' });

    return RSVP.hash(modelPromises);
  }
}
