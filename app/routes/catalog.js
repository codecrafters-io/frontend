import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class CatalogRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;

  async model() {
    let modelPromises = {};

    const currentUser = this.authenticator.currentUser;

    if (currentUser && currentUser.primaryEmailAddress) {
      window.Beacon('prefill', {
        email: this.currentUser.primaryEmailAddress,
      });
    }

    if (this.authenticator.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
      });
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
    });

    return RSVP.hash(modelPromises);
  }
}
