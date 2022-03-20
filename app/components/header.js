import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service currentUser;
  @tracked mobileMenuIsExpanded = false;

  @action
  handleDidInsert() {
    if (this.currentUser.isAuthenticated) {
      let username = this.currentUser.currentUserUsername;

      if (username && window.FS) {
        window.FS.identify(username, { displayName: username });
      }

      if (username && window.clarity) {
        window.clarity('set', 'username', username);
        window.clarity('set', 'user_id', this.currentUser.currentUserId);
        window.clarity('identify', username);
      }
    }
  }

  @action
  toggleMobileMenu() {
    this.mobileMenuIsExpanded = !this.mobileMenuIsExpanded;
  }
}
