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

export default class TrackPageCourseCardList extends Component<Signature> {
  logoImage = logoImage;
  comingSoonImage = comingSoonImage;

  @service declare authenticator: AuthenticatorService;

  get coursesWithProgress() {
    const coursesWithProgress = this.args.courses.map((course) => {
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

    return coursesWithProgress.sort((a, b) => {
      const aRepo = a.repositoryWithMostProgress;
      const bRepo = b.repositoryWithMostProgress;
      const aCompleted = aRepo?.baseStagesAreComplete || false;
      const bCompleted = bRepo?.baseStagesAreComplete || false;

      if (aCompleted !== bCompleted) return aCompleted ? -1 : 1;

      if (aRepo && bRepo) {
        return (aRepo.lastSubmissionAt?.getTime() || 0) - (bRepo.lastSubmissionAt?.getTime() || 0);
      }

      if (!!aRepo !== !!bRepo) return aRepo ? -1 : 1;

      return a.course.sortPositionForTrack - b.course.sortPositionForTrack;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCardList': typeof TrackPageCourseCardList;
  }
}
