import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import LanguageModel from 'codecrafters-frontend/models/language';
import comingSoonImage from '/assets/images/icons/coming-soon.png';
import logoImage from '/assets/images/logo/outline-color.svg';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courses: CourseModel[];
    language: LanguageModel;
  };
}

export default class TrackPageIntroductionAndCoursesComponent extends Component<Signature> {
  logoImage = logoImage;
  comingSoonImage = comingSoonImage;

  @service declare authenticator: AuthenticatorService;

  get coursesWithProgress() {
    return this.args.courses.map((course) => {
      const repositoryWithMostProgress = this.authenticator.currentUser
        ? this.authenticator.currentUser.repositories
            .filterBy('language', this.args.language)
            .filterBy('course', course)
            .filterBy('firstSubmissionCreated')
            .sortBy('completedStages.length', 'lastSubmissionAt').lastObject
        : null;

      return {
        repositoryWithMostProgress: repositoryWithMostProgress || undefined,
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::IntroductionAndCourses': typeof TrackPageIntroductionAndCoursesComponent;
  }
}
