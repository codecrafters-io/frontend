import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';

export default class TrackRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model(params) {
    let courses = await this.store.findAll('course', {
      include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
    });
    let language = this.store.peekAll('language').findBy('slug', params.track_slug);

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('repository', {
        include: RepositoryPoller.defaultIncludedResources,
      });
    }

    return {
      courses: courses.filter((course) => course.betaOrLiveLanguages.includes(language)),
      language: language,
    };
  }
}
