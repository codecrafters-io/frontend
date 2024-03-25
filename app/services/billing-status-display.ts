import AuthenticatorService from './authenticator';
import UserModel from 'codecrafters-frontend/models/user';
import RouterService from '@ember/routing/router-service';
import Service, { service } from '@ember/service';

export default class BillingStatusDisplayService extends Service {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get currentUser(): UserModel | null {
    return this.authenticator.currentUser;
  }

  get shouldShowFreeWeeksLeftButton(): boolean {
    return (
      !!this.currentUser &&
      !this.currentUser.canAccessMembershipBenefits &&
      this.currentUser.hasActiveFreeUsageGrants &&
      !this.currentUser.hasActiveFreeUsageGrantsValueIsOutdated
    );
  }

  get shouldShowSubscribeButton(): boolean {
    return !!this.currentUser && !this.currentUser.canAccessPaidContent && this.router.currentRouteName !== 'pay';
  }

  get shouldShowVipBadge(): boolean {
    return !!this.currentUser && this.currentUser.isVip;
  }
}
