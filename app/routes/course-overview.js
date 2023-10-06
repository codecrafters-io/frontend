import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class CourseOverviewRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;
  @service headData;

  @tracked previousMetaImageUrl;

  async afterModel({ course: { slug } = {} } = {}) {
    this.previousMetaImageUrl = this.headData.imageUrl;
    this.headData.imageUrl = `${config.x.metaTagImagesBaseURL}course-${slug}.jpg`;
  }

  deactivate() {
    this.headData.imageUrl = this.previousMetaImageUrl;
  }

  async model(params) {
    if (this.store.peekAll('course').findBy('slug', params.course_slug)) {
      // Trigger a refresh anyway
      this.store.findAll('course', {
        include: 'extensions,stages,stages.solutions.language,language-configurations.language,',
      });

      return {
        course: this.store.peekAll('course').findBy('slug', params.course_slug),
      };
    } else {
      let courses = await this.store.findAll('course', {
        include: 'extensions,stages,stages.solutions.language,language-configurations.language,',
      });

      let course = courses.findBy('slug', params.course_slug);

      if (this.authenticator.isAuthenticated) {
        await this.store.query('repository', {
          include: RepositoryPoller.defaultIncludedResources,
          course_id: course.id,
        });
      }

      return { course };
    }
  }
}
