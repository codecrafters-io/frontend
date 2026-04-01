import type ApplicationInstance from '@ember/application/instance';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export function initialize(applicationInstance: ApplicationInstance) {
  const authenticator = applicationInstance.lookup('service:authenticator') as AuthenticatorService;
  const liveCallWidget = applicationInstance.lookup('service:live-call-widget') as LiveCallWidgetService;

  if (authenticator.isAuthenticated) {
    const checkUser = () => {
      if (authenticator.currentUserIsLoaded) {
        liveCallWidget.syncFromUser();
        liveCallWidget.subscribe();
      } else {
        setTimeout(checkUser, 100);
      }
    };

    checkUser();
  }
}

export default { initialize };
