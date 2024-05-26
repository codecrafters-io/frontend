import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import logoImage from '/assets/images/logo/logomark-color.svg';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type BillingStatusDisplayService from 'codecrafters-frontend/services/billing-status-display';
import type ContainerWidthService from 'codecrafters-frontend/services/container-width';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type RouterService from '@ember/routing/router-service';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';

export default class HeaderComponent extends Component {
  logoImage = logoImage;

  @service declare authenticator: AuthenticatorService;
  @service declare billingStatusDisplay: BillingStatusDisplayService;
  @service declare containerWidth: ContainerWidthService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @tracked mobileMenuIsExpanded = false;

  get adminPanelLink() {
    return `${config.x.backendUrl}/admin`;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get links() {
    const links = [
      { text: 'Catalog', route: 'catalog', type: 'route' },
      { text: 'Badges', route: 'badges', type: 'route' },
      { text: 'Vote', route: 'vote', type: 'route' },
    ];

    if (this.featureFlags.canSeeConceptsIndex) {
      links.push({ text: 'Concepts', route: 'concepts', type: 'route' });
    }

    if (config.environment !== 'production') {
      links.push({ text: 'Demo', route: 'demo', type: 'route' });
    }

    if (this.currentUser && this.currentUser.isAdmin) {
      links.push({ text: 'Admin', route: this.adminPanelLink, type: 'link' });
    }

    return links;
  }

  @action
  handleDidInsert() {
    this.router.on('routeWillChange', this.handleRouteChange);
  }

  @action
  handleRouteChange() {
    this.mobileMenuIsExpanded = false;
  }

  @action
  handleWillDestroy() {
    this.router.off('routeWillChange', this.handleRouteChange);
  }

  @action
  toggleMobileMenu() {
    this.mobileMenuIsExpanded = !this.mobileMenuIsExpanded;
  }
}
