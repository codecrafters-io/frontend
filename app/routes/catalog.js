import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import RSVP from 'rsvp';

export default class CatalogRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;

  async model() {
    let modelPromises = {};

    if (this.authenticator.isAuthenticated) {
      modelPromises.repositories = this.store.findAll('repository', {
        reload: false,
        include: RepositoryPoller.defaultIncludedResources,
      });
    }

    modelPromises.courses = this.store.findAll('course', {
      include: 'stages,language-configurations.language',
    });

    return RSVP.hash(modelPromises);
  }
}
