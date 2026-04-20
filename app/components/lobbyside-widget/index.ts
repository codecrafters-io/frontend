import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { userIsStaffOrAllowlisted } from 'codecrafters-frontend/utils/staff-allowlist';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

declare global {
  interface Window {
    Lobbyside?: {
      setVisitor(visitor: { email: string; name: string; github: string }): void;
    };
  }
}

export type LobbysideAudience = 'everyone' | 'staff';

export interface LobbysideWidgetSignature {
  Element: HTMLDivElement;
  Args: {
    widgetId: string;
    audience?: LobbysideAudience;
  };
}

export default class LobbysideWidgetComponent extends Component<LobbysideWidgetSignature> {
  @service declare authenticator: AuthenticatorService;

  get scriptId(): string {
    return `lobbyside-widget-${this.args.widgetId}`;
  }

  get shouldShow(): boolean {
    if ((this.args.audience ?? 'everyone') === 'staff') {
      return userIsStaffOrAllowlisted(this.authenticator.currentUser);
    }

    return true;
  }

  @action
  insertScript(): void {
    if (document.getElementById(this.scriptId)) {
      this.syncVisitorData();

      return;
    }

    const script = document.createElement('script');
    script.id = this.scriptId;
    script.src = 'https://lobbyside.com/widget.js';
    script.dataset['widgetId'] = this.args.widgetId;
    script.onload = () => this.syncVisitorData();
    document.body.appendChild(script);
  }

  @action
  removeScript(): void {
    document.getElementById(this.scriptId)?.remove();
  }

  @action
  syncVisitorData(): void {
    const user = this.authenticator.currentUser;

    if (!user || !window.Lobbyside) {
      return;
    }

    window.Lobbyside.setVisitor({
      email: user.primaryEmailAddress || '',
      name: user.name || user.githubName || '',
      github: user.githubUsername || '',
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LobbysideWidget: typeof LobbysideWidgetComponent;
  }
}
