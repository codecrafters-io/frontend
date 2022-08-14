import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service('current-user') currentUserService;
  @tracked mobileMenuIsExpanded = false;

  get currentUser() {
    return this.currentUserService.record;
  }

  @action
  handleDidInsert() {
    if (this.currentUserService.isAuthenticated) {
      let username = this.currentUserService.currentUserUsername;

      if (username && window.FS) {
        window.FS.identify(username, { displayName: username });
      }

      if (username && window.clarity) {
        window.clarity('set', 'username', username);
        window.clarity('set', 'user_id', this.currentUserService.currentUserId);
        window.clarity('identify', username);
      }
    }
  }

  @action
  toggleMobileMenu() {
    this.mobileMenuIsExpanded = !this.mobileMenuIsExpanded;
  }
}
