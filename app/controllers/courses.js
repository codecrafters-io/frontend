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

  @action
  handleDidInsert() {
    if (this.action === 'checkout_session_successful') {
      this.globalModalsService.openCheckoutSessionSuccessfulModal();
    }
  }
}
