import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service currentUser;
  @tracked mobileMenuIsExpanded = false;

  @action
  handleDidInsert() {
    let username = this.currentUser.currentUserUsername;

    if (username && window.FS) {
      window.FS.identify(username, { displayName: username });
    }
  }

  @action
  toggleMobileMenu() {
    this.mobileMenuIsExpanded = !this.mobileMenuIsExpanded;
  }
}
