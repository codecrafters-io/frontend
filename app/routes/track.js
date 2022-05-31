import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class TrackRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;

  async model(params) {
    let courses = await this.store.findAll('course', { include: 'stages.solutions.language,supported-languages' });

    if (this.currentUser.isAuthenticated) {
      await this.store.findAll('repository', {
        include: 'language,course,user.free-usage-restrictions,course-stage-completions.course-stage,last-submission.course-stage',
      });
    }

    return {
      courses: courses,
      language: this.store.peekAll('language').findBy('slug', params.track_slug),
    };
  }
}
