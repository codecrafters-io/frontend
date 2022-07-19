import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseStageSolutionModalHeaderComponent extends Component {
  @service('current-user') currentUserService;

  get currentUserIsStaff() {
    return this.currentUserService.isAuthenticated && this.currentUserService.record.isStaff;
  }
}
