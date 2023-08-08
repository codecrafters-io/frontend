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

  get links() {
    const links = [
      { text: 'Catalog', route: 'catalog', type: 'route' },
      { text: 'Badges', route: 'badges', type: 'route' },
      { text: 'Vote', route: 'vote', type: 'route' },
    ];

    if (this.featureFlags.canSeeConceptsIndex) {
      links.push({ text: 'Concepts', route: 'concepts', type: 'route' });
    }

    if (this.currentUser && this.currentUser.isAdmin) {
      links.push({ text: 'Admin', route: this.adminPanelLink, type: 'link' });
    }

    return links;
  }

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

  get shouldShowSubscribeButton() {
    return this.currentUser && !this.currentUser.canAccessPaidContent && this.router.currentRouteName !== 'pay';
  }
}
