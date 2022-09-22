import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';

export default class CourseOverviewRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;
  @service store;

  async model(params) {
    if (this.store.peekAll('course').findBy('slug', params.course_slug)) {
      return {
        course: this.store.peekAll('course').findBy('slug', params.course_slug),
      };
    } else {
      let courses = await this.store.findAll('course', {
        include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
      });
      let course = courses.findBy('slug', params.course_slug);

      if (this.currentUser.isAuthenticated) {
        await this.store.query('repository', {
          include: RepositoryPoller.defaultIncludedResources,
          course_id: course.id,
        });
      }

      return { course };
    }
  }
}
