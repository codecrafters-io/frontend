import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

const ALLOWED_USERNAMES = ['vishaag', 'dronaxis'];
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
      this.syncVisitorData();

      return;
    }

    const script = document.createElement('script');
    script.id = LOBBYSIDE_SCRIPT_ID;
    script.src = 'https://lobbyside.com/widget.js';
    script.dataset['companyId'] = 'f6948b5a-eac2-4f92-8fce-54d4fb3bdaa4';
    script.onload = () => this.syncVisitorData();
    document.body.appendChild(script);
  }

  private syncVisitorData(): void {
    const user = this.authenticator.currentUser;

    if (!user || !(window as Record<string, unknown>)['Lobbyside']) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lobbyside = (window as any).Lobbyside;

    lobbyside.setVisitor({
      email: user.primaryEmailAddress || '',
      name: user.name || '',
      github: user.githubUsername || '',
    });
  }

  @action
  removeScript(): void {
    const script = document.getElementById(LOBBYSIDE_SCRIPT_ID);

    if (script) {
      script.remove();
    }
  }
}
