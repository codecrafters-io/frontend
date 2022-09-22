import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import RSVP from 'rsvp';

export default class CoursesRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;
  @service store;

  async model() {
    let modelPromises = {};

    if (this.currentUser.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: RepositoryPoller.defaultIncludedResources,
      });
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
    });

    return RSVP.hash(modelPromises);
  }
}
