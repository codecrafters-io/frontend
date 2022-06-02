import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrackPageIntroductionAndCoursesComponent extends Component {
  @service currentUser;

  get coursesWithProgress() {
    return this.args.courses.map((course) => {
      let repositoryWithMostProgress = this.currentUser.isAuthenticated
        ? this.currentUser.record.repositories.sortBy('completedStages.length', 'lastSubmissionAt').lastObject
        : null;

      return {
        repositoryWithMostProgress: repositoryWithMostProgress,
        course: course,
      };
    });
  }

  get userHasStartedTrack() {
    return (
      this.currentUser.isAuthenticated &&
      this.currentUser.record.repositories.filterBy('language', this.args.language).filterBy('lastSubmissionAt').firstObject
    );
  }
}
