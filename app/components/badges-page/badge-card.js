import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BadgeCardComponent extends Component {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  get currentUserBadgeAwards() {
    return this.currentUser.badgeAwards.filterBy('badge', this.args.badge);
  }

  get userHasBadgeAward() {
    return this.args.badge && this.currentUserBadgeAwards.length > 0;
  }
}
