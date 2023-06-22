import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BadgeCardComponent extends Component {
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserBadgeAwards() {
    return this.currentUser.badgeAwards.filterBy('badge', this.args.badge);
  }

  get userHasBadgeAward() {
    return this.args.badge && this.currentUserBadgeAwards.length > 0;
  }
}
