import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type { ModelType } from 'codecrafters-frontend/routes/catalog';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

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
    return this.model.courses.flatMap((course) => (this.shouldDisplayCourse(course) ? course.betaOrLiveLanguages : [])).uniq();
  }

  get orderedCourses() {
    if (!this.authenticator.currentUser) {
      return this.courses.toSorted((course1, course2) => {
        return course1.sortPositionForTrack > course2.sortPositionForTrack ? 1 : -1;
      });
    } else {
      return this.courses.toSorted((course1, course2) => {
        const repositoriesForCourse1 = this.authenticator
          .currentUser!.repositories.filter((item) => item.course === course1)
          .filter((item) => item.lastActivityAt);
        const repositoriesForCourse2 = this.authenticator
          .currentUser!.repositories.filter((item) => item.course === course2)
          .filter((item) => item.lastActivityAt);

        const lastActivityForCourse1At =
          repositoriesForCourse1.length > 0
            ? repositoriesForCourse1.toSorted(fieldComparator('lastActivityAt')).at(-1)!.lastActivityAt.getTime()
            : null;

        const lastActivityForCourse2At =
          repositoriesForCourse2.length > 0
            ? repositoriesForCourse2.toSorted(fieldComparator('lastActivityAt')).at(-1)!.lastActivityAt.getTime()
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
      return this.languages.toSorted(fieldComparator('sortPositionForTrack'));
    } else {
      return this.languages.toSorted((language1, language2) => {
        const repositoriesForLanguage1 = this.authenticator
          .currentUser!.repositories.filter((item) => item.language === language1)
          .filter((item) => item.firstSubmissionCreated);

        const repositoriesForLanguage2 = this.authenticator
          .currentUser!.repositories.filter((item) => item.language === language2)
          .filter((item) => item.firstSubmissionCreated);

        // First priority: languages with repositories come before those without
        const language1HasRepository = repositoriesForLanguage1.length > 0;
        const language2HasRepository = repositoriesForLanguage2.length > 0;

        if (language1HasRepository !== language2HasRepository) {
          return language1HasRepository ? -1 : 1;
        }

        // Second priority: among languages with repositories, sort by most recent submission first
        if (language1HasRepository && language2HasRepository) {
          // @ts-expect-error at(-1) is not defined on Array
          const lastSubmissionForLanguage1 = repositoriesForLanguage1.toSorted(fieldComparator('lastSubmissionAt')).at(-1).lastSubmissionAt;
          // @ts-expect-error at(-1) is not defined on Array
          const lastSubmissionForLanguage2 = repositoriesForLanguage2.toSorted(fieldComparator('lastSubmissionAt')).at(-1).lastSubmissionAt;

          const language1SubmissionTime = lastSubmissionForLanguage1?.getTime() || 0;
          const language2SubmissionTime = lastSubmissionForLanguage2?.getTime() || 0;

          return language2SubmissionTime - language1SubmissionTime;
        }

        // Final priority: default track order for languages without repositories
        return language1.sortPositionForTrack > language2.sortPositionForTrack ? 1 : -1;
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
