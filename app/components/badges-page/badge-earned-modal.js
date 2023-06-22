import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BadgeEarnedModalComponent extends Component {
  @service authenticator;
  @service store;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserBadgeAwards() {
    return this.currentUser.badgeAwards.filterBy('badge', this.args.badge);
  }

  @action
  handleDidInsert() {
    this.store
      .createRecord('analytics-event', {
        name: 'viewed_badge',
        properties: {
          badge_id: this.args.badge.id,
        },
      })
      .save();
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
