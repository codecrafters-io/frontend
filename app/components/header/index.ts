import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';
import logoImage from '/assets/images/logo/logomark-color.svg';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ContainerWidthService from 'codecrafters-frontend/services/container-width';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type PreferredLanguageLeaderboardService from 'codecrafters-frontend/services/preferred-language-leaderboard';
import type RouterService from '@ember/routing/router-service';
import type VersionTrackerService from 'codecrafters-frontend/services/version-tracker';
import type { SafeString } from '@ember/template/-private/handlebars';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;
}

export default class Header extends Component<Signature> {
  logoImage = logoImage;

  @service declare authenticator: AuthenticatorService;
  @service declare containerWidth: ContainerWidthService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare preferredLanguageLeaderboard: PreferredLanguageLeaderboardService;
  @service declare router: RouterService;
  @service declare versionTracker: VersionTrackerService;

  @tracked mobileMenuIsExpanded = false;
  @tracked floatingBarStyle: SafeString = htmlSafe('left: 0px; width: 0px; opacity: 0;');
  @tracked floatingBarContainer: HTMLElement | null = null;

  constructor(owner: Owner, args: object) {
    super(owner, args);

    // This can't be in instance-initializers since it depends on the authenticator service
    this.preferredLanguageLeaderboard.onBoot();
  }

  get activeDiscountForYearlyPlan(): PromotionalDiscountModel | null {
    return this.currentUser?.activeDiscountForYearlyPlan || null;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get links(): { text: string; route: string; type: 'route' | 'link'; routeParams?: string[] }[] {
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

  get linksForAuthenticatedUser(): { text: string; route: string; type: 'route' | 'link'; routeParams?: string[] }[] {
    const links: { text: string; route: string; type: 'route' | 'link'; routeParams?: string[] }[] = [
      { text: 'Catalog', route: 'catalog', type: 'route' },
      { text: 'Roadmap', route: 'roadmap', type: 'route' },
    ];

    links.push({
      text: 'Leaderboard',
      route: 'leaderboard',
      type: 'route',
      routeParams: [this.preferredLanguageLeaderboard.defaultLanguageSlug],
    });

    return links;
  }

  @action
  handleDidInsert() {
    this.router.on('routeWillChange', this.handleRouteWillChange);
  }

  @action
  handleDidInsertFloatingBarContainer(element: HTMLElement) {
    this.floatingBarContainer = element;
    this.updateFloatingBarPosition(element);
  }

  @action
  handleDidUpdateCurrentRouteName() {
    next(() => {
      if (this.floatingBarContainer) {
        this.updateFloatingBarPosition(this.floatingBarContainer);
      }
    });
  }

  @action
  handleRouteWillChange() {
    this.mobileMenuIsExpanded = false;
  }

  @action
  handleWillDestroy() {
    this.router.off('routeWillChange', this.handleRouteWillChange);
  }

  @action
  toggleMobileMenu() {
    this.mobileMenuIsExpanded = !this.mobileMenuIsExpanded;
  }

  private updateFloatingBarPosition(containerElement: HTMLElement) {
    const currentRoute = this.router.currentRouteName;

    if (!currentRoute || currentRoute.includes('loading')) {
      return;
    }

    const activeLink = containerElement.querySelector(`[data-route-is-active="true"]`) as HTMLElement;

    if (activeLink) {
      const containerRect = containerElement.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      const left = linkRect.left - containerRect.left;
      const width = linkRect.width;

      this.floatingBarStyle = htmlSafe(`left: ${left}px; width: ${width}px; opacity: 1;`);
    } else {
      this.floatingBarStyle = htmlSafe('left: 0px; width: 0px; opacity: 0;');
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Header: typeof Header;
  }
}
