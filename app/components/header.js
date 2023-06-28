import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import logoImage from '/assets/images/logo/logomark-color.svg';
import config from 'codecrafters-frontend/config/environment';

export default class HeaderComponent extends Component {
  logoImage = logoImage;

  @service containerWidth;
  @service authenticator;
  @service featureFlags;
  @service router;
  @service colorScheme;

  @tracked mobileMenuIsExpanded = false;

  get adminPanelLink() {
    return `${config.x.backendUrl}/admin`;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  handleDidInsert() {
    this.router.on('routeWillChange', this.handleRouteChange);
  }

  @action
  handleWillDestroy() {
    this.router.off('routeWillChange', this.handleRouteChange);
  }

  @action
  handleRouteChange() {
    this.mobileMenuIsExpanded = false;
  }

  @action
  toggleMobileMenu() {
    this.mobileMenuIsExpanded = !this.mobileMenuIsExpanded;
  }

  get canSeeEarlyBirdDiscountBanner() {
    if (this.currentUser && !this.currentUser.hasActiveSubscripiton && this.currentUser.isEligibleForEarlyBirdDiscount) {
      return this.featureFlags.canSeeEarlyBirdDiscountBanner;
    }
    return false;
  }
}
