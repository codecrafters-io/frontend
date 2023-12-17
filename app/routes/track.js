import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/utils/base-route';
import RepositoryPoller from 'codecrafters-frontend/utils/repository-poller';
import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class TrackRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;
  @service metaData;

  @tracked previousMetaImageUrl;

  activate() {
    scrollToTop();
  }

  async afterModel({ language: { slug } = {} } = {}) {
    this.previousMetaImageUrl = this.metaData.imageUrl;
    this.metaData.imageUrl = `${config.x.metaTagImagesBaseURL}language-${slug}.jpg`;
  }

  deactivate() {
    this.metaData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params) {
    let courses = await this.store.findAll('course', {
      include: 'extensions,stages,stages.solutions.language,language-configurations.language,',
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
