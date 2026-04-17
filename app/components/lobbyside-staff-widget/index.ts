import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

const ALLOWED_USERNAMES = ['vishaag', 'dronaxis'];
const LOBBYSIDE_SCRIPT_ID = 'lobbyside-staff-widget-script';

export default class LobbysideStaffWidgetComponent extends Component {
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
    script.dataset['companyId'] = '665ad94a-a863-4d0e-98e5-ff3eeac3f264';
    script.onload = () => this.syncVisitorData();
    document.body.appendChild(script);
  }

  @action
  removeScript(): void {
    const script = document.getElementById(LOBBYSIDE_SCRIPT_ID);

    if (script) {
      script.remove();
    }
  }

  private syncVisitorData(): void {
    const user = this.authenticator.currentUser;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!user || !(window as any)['Lobbyside']) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lobbyside = (window as any).Lobbyside;

    lobbyside.setVisitor({
      email: user.primaryEmailAddress || '',
      name: user.name || user.githubName || '',
      github: user.githubUsername || '',
    });
  }
}
