import { compare } from '@ember/utils';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type { ModelType } from 'codecrafters-frontend/routes/catalog';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';

export default class CatalogController extends Controller {
  declare model: ModelType;

  @service declare authenticator: AuthenticatorService;

  get courses() {
    if (this.authenticator.currentUser && this.authenticator.currentUser.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.filter((course) => this.shouldDisplayCourse(course));
  }

  get languages() {
    return [...new Set([...this.model.courses].flatMap((course) => (this.shouldDisplayCourse(course) ? [...course.betaOrLiveLanguages] : [])))];
  }

  get orderedCourses() {
    if (!this.authenticator.currentUser) {
      return [...this.courses].sort((course1, course2) => {
        return course1.sortPositionForTrack > course2.sortPositionForTrack ? 1 : -1;
      });
    } else {
      return [...this.courses].sort((course1, course2) => {
        const repositoriesForCourse1 = this.authenticator
          .currentUser!.repositories.filter((item) => item.course === course1)
          .filter((item) => item.lastActivityAt);
        const repositoriesForCourse2 = this.authenticator
          .currentUser!.repositories.filter((item) => item.course === course2)
          .filter((item) => item.lastActivityAt);

        const lastActivityForCourse1At =
          repositoriesForCourse1.length > 0
            ? [...repositoriesForCourse1]
                .sort((a, b) => compare(a.lastActivityAt, b.lastActivityAt))
                .at(-1)
                ?.lastActivityAt.getTime()
            : null;

        const lastActivityForCourse2At =
          repositoriesForCourse2.length > 0
            ? [...repositoriesForCourse2]
                .sort((a, b) => compare(a.lastActivityAt, b.lastActivityAt))
                .at(-1)
                ?.lastActivityAt.getTime()
            : null;

        if (lastActivityForCourse1At && lastActivityForCourse2At && lastActivityForCourse1At > lastActivityForCourse2At) {
          return -1;
        } else if (lastActivityForCourse1At && lastActivityForCourse2At && lastActivityForCourse1At < lastActivityForCourse2At) {
          return 1;
        } else if (lastActivityForCourse1At && !lastActivityForCourse2At) {
          return -1;
        } else if (!lastActivityForCourse1At && lastActivityForCourse2At) {
          return 1;
        } else {
          return course1.sortPositionForTrack > course2.sortPositionForTrack ? 1 : -1;
        }
      });
    }
  }

  get orderedLanguages() {
    if (!this.authenticator.currentUser) {
      return [...this.languages].sort((a, b) => compare(a.sortPositionForTrack, b.sortPositionForTrack));
    } else {
      return [...this.languages].sort((language1, language2) => {
        const repositoriesForLanguage1 = this.authenticator
          .currentUser!.repositories.filter((item) => item.language === language1)
          .filter((item) => item.firstSubmissionCreated);

        const repositoriesForLanguage2 = this.authenticator
          .currentUser!.repositories.filter((item) => item.language === language2)
          .filter((item) => item.firstSubmissionCreated);

        if (repositoriesForLanguage1.length > 0 && repositoriesForLanguage2.length > 0) {
          const lastSubmissionForLanguage1 = [...repositoriesForLanguage1]
            .sort((a, b) => compare(a.lastSubmissionAt, b.lastSubmissionAt))
            .at(-1)?.lastSubmissionAt;

          const lastSubmissionForLanguage2 = [...repositoriesForLanguage2]
            .sort((a, b) => compare(a.lastSubmissionAt, b.lastSubmissionAt))
            .at(-1)?.lastSubmissionAt;

          return lastSubmissionForLanguage1 && lastSubmissionForLanguage2 ? (lastSubmissionForLanguage1 > lastSubmissionForLanguage2 ? 1 : -1) : 0;
        } else if (repositoriesForLanguage1.length > 0) {
          return -1;
        } else if (repositoriesForLanguage2.length > 0) {
          return 1;
        } else {
          return language1.sortPositionForTrack > language2.sortPositionForTrack ? 1 : -1;
        }
      });
    }
  }

  get productWalkthroughFeatureSuggestion(): FeatureSuggestionModel | null {
    if (!this.authenticator.currentUser) {
      return null;
    }

    return this.authenticator.currentUser.featureSuggestions
      .filter((item) => item.featureIsProductWalkthrough)
      .filter((item) => !item.isDismissed)[0] as FeatureSuggestionModel | null;
  }

  shouldDisplayCourse(course: CourseModel) {
    const userIsStaffOrCourseAuthor =
      this.authenticator.currentUser && (this.authenticator.currentUser.isStaff || this.authenticator.currentUser.isCourseAuthor(course));
    const userHasRepository =
      this.authenticator.currentUser && this.authenticator.currentUser.repositories.filter((item) => item.course === course).length > 0;

    if (course.releaseStatusIsDeprecated || course.visibilityIsPrivate) {
      return userHasRepository;
    }

    if (course.releaseStatusIsAlpha) {
      return userIsStaffOrCourseAuthor;
    }

    return true;
  }
}
