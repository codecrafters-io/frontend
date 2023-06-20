import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import config from 'codecrafters-frontend/config/environment';

export default class LoginRoute extends ApplicationRoute {
  beforeModel(transition) {
    window.location = `${config.x.backendUrl}/login?next=${encodeURIComponent(transition.to.queryParams.next)}`;
  }
}
