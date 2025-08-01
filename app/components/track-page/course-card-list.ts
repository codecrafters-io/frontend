import { compare } from '@ember/utils';
import { get } from '@ember/object';
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
    return this.args.courses.map((course) => {
      const repositoryWithMostProgress = this.authenticator.currentUser
        ? [
            ...this.authenticator.currentUser.repositories
              .filter((item) => item.language === this.args.language)
              .filter((item) => item.course === course)
              .filter((item) => item.firstSubmissionCreated),
          ]
            .sort((a, b) => {
              for (const key of ['completedStages.length', 'lastSubmissionAt']) {
                const compareValue = compare(get(a, key), get(b, key));

                if (compareValue) {
                  return compareValue;
                }
              }

              return 0;
            })
            .at(-1)
        : null;

      return {
        repositoryWithMostProgress: repositoryWithMostProgress || undefined,
        course: course,
      };
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCardList': typeof TrackPageCourseCardList;
  }
}
