import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import logoImage from '/assets/images/logo/logomark-color.svg';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ContainerWidthService from 'codecrafters-frontend/services/container-width';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type RouterService from '@ember/routing/router-service';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

interface Signature {
  Element: HTMLDivElement;
}

export default class HeaderComponent extends Component<Signature> {
  logoImage = logoImage;

  @service declare authenticator: AuthenticatorService;
  @service declare containerWidth: ContainerWidthService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @tracked mobileMenuIsExpanded = false;

  get activeDiscountForYearlyPlan(): PromotionalDiscountModel | null {
    return this.currentUser?.activeDiscountForYearlyPlan || null;
  }

  get adminPanelLink() {
    return `${config.x.backendUrl}/admin`;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get links(): { text: string; route: string; type: 'route' | 'link' }[] {
    if (this.currentUser) {
      return this.linksForAuthenticatedUser;
    } else {
      return this.linksForAnonymousUser;
    }
  }

  get linksForAnonymousUser(): { text: string; route: string; type: 'route' | 'link' }[] {
    return [
      { text: 'Catalog', route: 'catalog', type: 'route' },
      { text: 'Pricing', route: 'pay', type: 'route' },
      { text: 'Roadmap', route: 'roadmap', type: 'route' },
    ];
  }

  get linksForAuthenticatedUser(): { text: string; route: string; type: 'route' | 'link' }[] {
    const links: { text: string; route: string; type: 'route' | 'link' }[] = [
      { text: 'Catalog', route: 'catalog', type: 'route' },
      { text: 'Badges', route: 'badges', type: 'route' },
      { text: 'Roadmap', route: 'roadmap', type: 'route' },
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Header: typeof HeaderComponent;
  }
}
