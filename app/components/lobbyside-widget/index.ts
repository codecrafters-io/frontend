import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

const ALLOWED_USERNAMES = ['vishaag'];
const LOBBYSIDE_SCRIPT_ID = 'lobbyside-widget-script';

export default class LobbysideWidgetComponent extends Component {
  @service declare authenticator: AuthenticatorService;

  get shouldShow(): boolean {
    const user = this.authenticator.currentUser;

    if (!user) {
      return false;
    }

    return user.isStaff || ALLOWED_USERNAMES.includes(user.username);
  }

  @action
  insertScript(): void {
    if (document.getElementById(LOBBYSIDE_SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = LOBBYSIDE_SCRIPT_ID;
    script.src = 'https://lobbyside.com/widget.js';
    script.dataset['companyId'] = '5076a418-7b79-4140-a4eb-173c8d1e57e7';
    document.body.appendChild(script);
  }

  @action
  removeScript(): void {
    const script = document.getElementById(LOBBYSIDE_SCRIPT_ID);

    if (script) {
      script.remove();
    }
  }
}
