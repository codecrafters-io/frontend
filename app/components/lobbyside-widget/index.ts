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

  // The next three getters mirror the fields we push to Lobbyside via
  // `setVisitor`. They exist (and are referenced from the template's
  // `{{did-update}}` args) so that we re-sync the visitor stash whenever any
  // individual field's value changes — not just when `currentUserId` changes.
  //
  // Why this matters: Ember Data sometimes hydrates the user record in two
  // passes. A page-level payload may sideload the current user with `name` +
  // `githubUsername` but no `primaryEmailAddress`; the full payload from
  // `authenticator.syncCurrentUser` arrives a beat later and fills the email
  // in-place. Because `currentUserId` is the same string before and after
  // that mutation, a `did-update` keyed only on `currentUserId` does NOT
  // re-fire — and the embedder's `__LOBBYSIDE_VISITOR_DATA__.email` stays
  // empty even though name/github were already pre-filled. Tracking each
  // field directly forces a re-sync the moment any of them change.
  get userGithub(): string {
    return this.authenticator.currentUser?.githubUsername || '';
  }

  get userName(): string {
    const user = this.authenticator.currentUser;

    return user?.name || user?.githubName || '';
  }

  get userPrimaryEmail(): string {
    return this.authenticator.currentUser?.primaryEmailAddress || '';
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
    if (!this.authenticator.currentUser || !window.Lobbyside) {
      return;
    }

    window.Lobbyside.setVisitor({
      email: this.userPrimaryEmail,
      name: this.userName,
      github: this.userGithub,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    LobbysideWidget: typeof LobbysideWidgetComponent;
  }
}
