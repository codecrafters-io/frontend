import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class TracksController extends Controller {
  @service currentUser;

  get courses() {
    if (this.currentUser.isAuthenticated && this.currentUser.record.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.rejectBy('releaseStatusIsAlpha');
  }

  get orderedProLanguages() {
    return this.orderedLanguages.filterBy('isGo');
  }

  get orderedBetaLanguages() {
    return this.orderedLanguages.rejectBy('isGo');
  }

  get languages() {
    return this.model.courses
      .toArray()
      .flatMap((course) => course.supportedLanguages.toArray())
      .uniq();
  }

  get orderedLanguages() {
    if (this.currentUser.isAnonymous) {
      return this.languages.sortBy('sortPositionForTrack');
    } else {
      return this.languages.toArray().sort((language1, language2) => {
        let repositoriesForLanguage1 = this.currentUser.record.repositories.filterBy('language', language1).filterBy('firstSubmissionCreated');
        let repositoriesForLanguage2 = this.currentUser.record.repositories.filterBy('language', language2).filterBy('firstSubmissionCreated');

        if (repositoriesForLanguage1.length > 0 && repositoriesForLanguage2.length > 0) {
          let lastSubmissionForLanguage1 = repositoriesForLanguage1.sortBy('lastSubmissionAt').lastObject.lastSubmissionAt;
          let lastSubmissionForLanguage2 = repositoriesForLanguage2.sortBy('lastSubmissionAt').lastObject.lastSubmissionAt;

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
