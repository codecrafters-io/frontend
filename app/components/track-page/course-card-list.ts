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

      // First priority: completed courses come first
      const aCompleted = aRepo?.allStagesAreComplete || false;
      const bCompleted = bRepo?.allStagesAreComplete || false;

      if (aCompleted !== bCompleted) {
        return aCompleted ? -1 : 1;
      }

      // Second priority: courses with repositories come before those without
      const aHasRepo = !!aRepo;
      const bHasRepo = !!bRepo;

      if (aHasRepo !== bHasRepo) {
        return aHasRepo ? -1 : 1;
      }

      // Third priority: among courses with repositories, sort by most recent submission
      if (aRepo && bRepo) {
        const aSubmissionTime = aRepo.lastSubmissionAt?.getTime() || 0;
        const bSubmissionTime = bRepo.lastSubmissionAt?.getTime() || 0;

        return bSubmissionTime - aSubmissionTime; // Most recent first
      }

      // Final priority: default track order for courses without repositories
      return a.course.sortPositionForTrack - b.course.sortPositionForTrack;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCardList': typeof TrackPageCourseCardList;
  }
}
