import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import logoImage from '/assets/images/logo/outline-color.svg';
import comingSoonImage from '/assets/images/icons/coming-soon.png';

export default class TrackPageIntroductionAndCoursesComponent extends Component {
  logoImage = logoImage;
  comingSoonImage = comingSoonImage;

  @service authenticator;

  get coursesWithProgress() {
    return this.args.courses.map((course) => {
      let repositoryWithMostProgress = this.authenticator.currentUser
        ? this.authenticator.currentUser.repositories
            .filterBy('language', this.args.language)
            .filterBy('course', course)
            .filterBy('firstSubmissionCreated')
            .sortBy('completedStages.length', 'lastSubmissionAt').lastObject
        : null;

      return {
        repositoryWithMostProgress: repositoryWithMostProgress,
        course: course,
      };
    });
  }

  get userHasStartedTrack() {
    return (
      this.authenticator.currentUser &&
      this.authenticator.currentUser.repositories.filterBy('language', this.args.language).filterBy('lastSubmissionAt')[0]
    );
  }
}
