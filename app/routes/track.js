import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class TrackRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service currentUser;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  async model(params) {
    let courses = await this.store.findAll('course', {
      include: 'stages.solutions.language,stages.source-walkthrough,language-configurations.language',
    });
    let language = this.store.peekAll('language').findBy('slug', params.track_slug);

    if (this.currentUser.isAuthenticated) {
      await this.store.findAll('repository', {
        include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
      });
    }

    return {
      courses: courses.filter((course) => course.betaOrLiveLanguages.includes(language)),
      language: language,
    };
  }
}
