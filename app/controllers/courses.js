import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CourseController extends Controller {
  queryParams = ['action'];

  @tracked action = null;
  @service currentUser;
  @service('globalModals') globalModalsService;

  get courses() {
    if (this.currentUser.isAuthenticated && this.currentUser.record.isStaff) {
      return this.model.courses;
    }

    return this.model.courses.rejectBy('releaseStatusIsAlpha');
  }

  // TODO: The sort implementation here is incorrect! It should compare values and return 1/-1, not return the value.
  get orderedCourses() {
    if (this.currentUser.isAnonymous) {
      return this.courses;
    } else {
      return this.courses.toArray().sort((course) => {
        let repositoriesForCourse = this.currentUser.record.repositories.filterBy('course', course).filterBy('firstSubmissionCreated');

        if (repositoriesForCourse.length > 0) {
          return -1 * repositoriesForCourse.sortBy('lastSubmissionAt').lastObject.lastSubmissionAt.getTime();
        } else {
          return null;
        }
      });
    }
  }

  @action
  handleDidInsert() {
    if (this.action === 'checkout_session_successful') {
      this.globalModalsService.openCheckoutSessionSuccessfulModal();
    }
  }
}
