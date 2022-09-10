import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class PayRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  async model() {
    let modelPromises = {};

    modelPromises.repositories = this.store.findAll('repository', {
      include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
    });

    modelPromises.courses = this.store.findAll('course', {
      include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
    });

    return RSVP.hash(modelPromises);
  }
}
