import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BadgeCardComponent extends Component {
  @service store;
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  get userHasBadgeAward() {
    return this.args.badge.currentUserAwards.length > 0;
  }
}
