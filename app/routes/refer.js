import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';

export default class ReferRoute extends ApplicationRoute {
  @service currentUser;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }
}
