import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import config from 'codecrafters-frontend/config/environment';
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
    // Skip the network fetch in test mode — the third-party widget script is
    // not part of any test contract here, and injecting it makes acceptance
    // tests flake: the request is fired against the public lobbyside.com CDN
    // (no Mirage handler), and when the response arrives AFTER the test has
    // torn down the app, our `onload → syncVisitorData → currentUser` chain
    // calls `store.peekRecord()` on a destroyed store and the whole test
    // run aborts with a global failure. Same pattern `UserSyncerService`
    // uses (`app/services/user-syncer.ts`).
    if (config.environment === 'test') {
      return;
    }

    if (document.getElementById(this.scriptId)) {
      this.syncVisitorData();

      return;
    }

    const script = document.createElement('script');
    script.id = this.scriptId;
    script.src = 'https://lobbyside.com/widget.js';
    script.dataset['widgetId'] = this.args.widgetId;

    script.onload = () => {
      // The script is fetched async, so this callback can still fire after
      // the component (and the Ember Data store) has been torn down — most
      // commonly when the user navigates away mid-load. Bail in that case
      // so `syncVisitorData → currentUser → store.peekRecord` doesn't
      // throw against a destroyed store. Belt-and-braces with the
      // `script.onload = null` cleanup in `removeScript` below.
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      this.syncVisitorData();
    };

    document.body.appendChild(script);
  }

  @action
  removeScript(): void {
    const script = document.getElementById(this.scriptId) as HTMLScriptElement | null;

    if (script) {
      // Cancel any pending onload before removing the element. The browser
      // can still fire `onload` against a script that's already been
      // detached from the DOM (the listener was attached to the element
      // reference, not the DOM position), so dropping the handler here
      // prevents a torn-down component from re-entering its own callback.
      script.onload = null;
      script.remove();
    }
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
