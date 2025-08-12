import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type BadgeModel from 'codecrafters-frontend/models/badge';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    badge?: BadgeModel;
  };
}

export default class BadgeCard extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserBadgeAwards() {
    return this.currentUser ? this.currentUser.badgeAwards.filter((badgeAward) => badgeAward.badge === this.args.badge) : [];
  }

  get userHasBadgeAward() {
    return this.args.badge && this.currentUserBadgeAwards.length > 0;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BadgesPage::BadgeCard': typeof BadgeCard;
  }
}
