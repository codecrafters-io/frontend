import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import RSVP from 'rsvp';

export default class PayRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model() {
    let modelPromises = {};

    modelPromises.repositories = this.store.findAll('repository', {
      include: RepositoryPoller.defaultIncludedResources,
    });

    modelPromises.courses = this.store.findAll('course', {
      include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
    });

    return RSVP.hash(modelPromises);
  }
}
