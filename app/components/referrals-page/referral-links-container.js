import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ReferralLinksContainerComponent extends Component {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }
}
