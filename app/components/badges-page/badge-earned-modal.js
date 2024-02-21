import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BadgeEarnedModalComponent extends Component {
  @service analyticsEventTracker;
  @service authenticator;

  get currentUser() {
    return this.authenticator.currentUser;
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

  @action
  handleDidInsert() {
    this.analyticsEventTracker.track('viewed_badge', {
      badge_id: this.args.badge.id,
    });
  }
}
