import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class AuthenticationService extends Service {
  @service router;

  initiateLogin(redirectPath) {
    if (redirectPath) {
      window.location.href = '/login?next=' + encodeURIComponent(`${window.origin}${redirectPath}`);
    } else {
      window.location.href = '/login?next=' + encodeURIComponent(`${window.origin}${this.router.currentURL}`);
    }
  }
}
