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
    if (this.currentUser.record.isArrendaTeamMember) {
      return this.model.courses.filterBy('slug', 'docker');
    }

    if (this.currentUser.isBetaParticipant) {
      return this.model.courses;
    } else {
      return this.model.courses.filterBy('releaseStatusIsLive');
    }
  }

  @action
  handleDidInsert() {
    if (this.action === 'checkout_session_successful') {
      this.globalModalsService.openCheckoutSessionSuccessfulModal();
    }
  }
}
