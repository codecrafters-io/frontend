import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BadgeEarnedModalComponent extends Component {
  @service('current-user') currentUserService;

  get currentUser() {
    return this.currentUserService.record;
  }

  get currentUserBadgeAwards() {
    return this.currentUser.badgeAwards.filterBy('badge', this.args.badge);
  }

  get lastAwardedAt() {
    if (this.userHasBadgeAward) {
      return this.currentUserBadgeAwards.sortBy('awardedAt').reverse()[0].awardedAt;
    } else {
      return null;
    }
  }

  get userHasBadgeAward() {
    return this.args.badge && this.currentUserBadgeAwards.length > 0;
  }
}
