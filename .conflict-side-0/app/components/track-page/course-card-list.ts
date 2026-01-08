import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import LanguageModel from 'codecrafters-frontend/models/language';
import comingSoonImage from '/assets/images/icons/coming-soon.png';
import logoImage from '/assets/images/logo/outline-color.svg';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { service } from '@ember/service';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

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
            .filter((item) => item.language === this.args.language)
            .filter((item) => item.course === course)
            .filter((item) => item.firstSubmissionCreated)
            .sort(fieldComparator('completedStagesCount', 'lastSubmissionAt'))
            .at(-1)
        : null;

      return {
        repositoryWithMostProgress: repositoryWithMostProgress || undefined,
        course: course,
      };
    });

    return coursesWithProgress.sort((a, b) => {
      const aRepository = a.repositoryWithMostProgress;
      const bRepository = b.repositoryWithMostProgress;

      // First priority: completed courses come first
      const aCompleted = aRepository?.allStagesAreComplete || false;
      const bCompleted = bRepository?.allStagesAreComplete || false;

      if (aCompleted !== bCompleted) {
        return aCompleted ? -1 : 1;
      }

      // Second priority: courses with repositories come before those without
      const aHasRepository = !!aRepository;
      const bHasRepository = !!bRepository;

      if (aHasRepository !== bHasRepository) {
        return aHasRepository ? -1 : 1;
      }

      // Third priority: among courses with repositories, sort by most recent submission first
      if (aRepository && bRepository) {
        const aSubmissionTime = aRepository.lastSubmissionAt?.getTime() || 0;
        const bSubmissionTime = bRepository.lastSubmissionAt?.getTime() || 0;

        return bSubmissionTime - aSubmissionTime;
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
