import Component from '@glimmer/component';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type BadgeAwardModel from 'codecrafters-frontend/models/badge-award';
import type BadgeModel from 'codecrafters-frontend/models/badge';
import type UserModel from 'codecrafters-frontend/models/user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    badge: BadgeModel;
    onClose: () => void;
  };
}

export default class BadgeEarnedModal extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser as UserModel;
  }

  get currentUserBadgeAwards(): BadgeAwardModel[] {
    return this.currentUser.badgeAwards.filter((item) => item.badge === this.args.badge);
  }

  get lastAwardedAt() {
    if (this.userHasBadgeAward) {
      return (this.currentUserBadgeAwards.toSorted(fieldComparator('awardedAt')).reverse()[0] as BadgeAwardModel).awardedAt;
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BadgesPage::BadgeEarnedModal': typeof BadgeEarnedModal;
  }
}
