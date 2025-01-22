import Service, { inject as service } from '@ember/service';
import * as Sentry from '@sentry/ember';
import type AuthenticatorService from './authenticator';

declare global {
  interface Window {
    FS?: {
      identify: (username: string, options: { displayName: string }) => void;
    };
  }
}

export default class SentryService extends Service {
  @service declare authenticator: AuthenticatorService;

  identifyUser(): void {
    if (this.authenticator.currentUserId) {
      Sentry.setUser({
        id: this.authenticator.currentUserId,
        username: this.authenticator.currentUsername ?? undefined,
      });

      // TODO: Use better naming, this shouldn't be inside "SentryService"
      if (window.FS && this.authenticator.currentUsername) {
        window.FS.identify(this.authenticator.currentUsername, { displayName: this.authenticator.currentUsername });
      }
    }
  }
}
