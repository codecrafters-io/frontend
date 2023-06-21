import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import logoImage from '/assets/images/logo/logomark-color.svg';
import config from 'codecrafters-frontend/config/environment';

export default class HeaderComponent extends Component {
  logoImage = logoImage;

  @service containerWidth;
  @service('current-user') currentUserService;
  @service featureFlags;
  @service router;
  @service colorScheme;

  @tracked mobileMenuIsExpanded = false;

  get adminPanelLink() {
    return `${config.x.backendUrl}/admin`;
  }

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  handleDidInsert() {
    if (this.currentUserService.isAuthenticated) {
      let username = this.currentUser.username;

      if (username && window.FS) {
        window.FS.identify(username, { displayName: username });
      }

      if (username && window.clarity) {
        window.clarity('set', 'username', username);
        window.clarity('set', 'user_id', this.currentUserService.currentUserId);
        window.clarity('identify', username);
      }
    }

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
}
