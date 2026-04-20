import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

const LOBBYSIDE_SCRIPT_ID = 'lobbyside-secondary-widget-script';

export default class LobbysideSecondaryWidgetComponent extends Component {
  @service declare authenticator: AuthenticatorService;

  get shouldShow(): boolean {
    return true;
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
    script.dataset['widgetId'] = 'b0d7150e-77e2-431c-a57c-765e080d9c72';
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
