import Service from '@ember/service';
import * as Sentry from '@sentry/ember';
import { inject as service } from '@ember/service';

export default class SentryService extends Service {
  @service authenticator;

  identifyUser() {
    if (this.authenticator.currentUserId) {
      Sentry.setUser({ id: this.authenticator.currentUserId, username: this.authenticator.currentUsername });

      // TODO: Use better naming, this shouldn't be inside "SentryService"
      if (window.FS) {
        window.FS.identify(this.authenticator.currentUsername, { displayName: this.authenticator.currentUsername });
      }
    }
  }
}
