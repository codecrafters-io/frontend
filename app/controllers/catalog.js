import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class TracksController extends Controller {
  @service authenticator;

  get courses() {
    if (this.authenticator.currentUser && this.authenticator.currentUser.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.filter((course) => {
      if (course.releaseStatusIsAlpha) {
        return this.authenticator.currentUser && (this.authenticator.currentUser.isStaff || this.authenticator.currentUser.isCourseAuthor(course));
      } else {
        return true;
      }
    });
  }

  get languages() {
    return this.model.courses
      .toArray()
      .flatMap((course) => course.betaOrLiveLanguages.toArray())
      .uniq();
  }

  get orderedCourses() {
    if (!this.authenticator.currentUser) {
      return this.courses.toArray().sort((course1, course2) => {
        return course1.sortPositionForTrack > course2.sortPositionForTrack ? 1 : -1;
      });
    } else {
      return this.courses.toArray().sort((course1, course2) => {
        let repositoriesForCourse1 = this.authenticator.currentUser.repositories.filterBy('course', course1).filterBy('firstSubmissionCreated');
        let repositoriesForCourse2 = this.authenticator.currentUser.repositories.filterBy('course', course2).filterBy('firstSubmissionCreated');

        let lastSubmissionForCourse1At =
          repositoriesForCourse1.length > 0 ? repositoriesForCourse1.sortBy('lastSubmissionAt').at(-1).lastSubmissionAt.getTime() : null;
        let lastSubmissionForCourse2At =
          repositoriesForCourse2.length > 0 ? repositoriesForCourse2.sortBy('lastSubmissionAt').at(-1).lastSubmissionAt.getTime() : null;

        if (lastSubmissionForCourse1At && lastSubmissionForCourse2At && lastSubmissionForCourse1At > lastSubmissionForCourse2At) {
          return -1;
        } else if (lastSubmissionForCourse1At && lastSubmissionForCourse2At && lastSubmissionForCourse1At < lastSubmissionForCourse2At) {
          return 1;
        } else if (lastSubmissionForCourse1At && !lastSubmissionForCourse2At) {
          return -1;
        } else if (!lastSubmissionForCourse1At && lastSubmissionForCourse2At) {
          return 1;
        } else {
          return course1.sortPositionForTrack > course2.sortPositionForTrack ? 1 : -1;
        }
      });
    }
  }

  get orderedLanguages() {
    if (!this.authenticator.currentUser) {
      return this.languages.sortBy('sortPositionForTrack');
    } else {
      return this.languages.toArray().sort((language1, language2) => {
        let repositoriesForLanguage1 = this.authenticator.currentUser.repositories.filterBy('language', language1).filterBy('firstSubmissionCreated');
        let repositoriesForLanguage2 = this.authenticator.currentUser.repositories.filterBy('language', language2).filterBy('firstSubmissionCreated');

        if (repositoriesForLanguage1.length > 0 && repositoriesForLanguage2.length > 0) {
          let lastSubmissionForLanguage1 = repositoriesForLanguage1.sortBy('lastSubmissionAt').at(-1).lastSubmissionAt;
          let lastSubmissionForLanguage2 = repositoriesForLanguage2.sortBy('lastSubmissionAt').at(-1).lastSubmissionAt;

          return lastSubmissionForLanguage1 > lastSubmissionForLanguage2 ? 1 : -1;
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
}
