import ApplicationInstance from '@ember/application/instance';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export function initialize(applicationInstance: ApplicationInstance) {
  const authenticator = applicationInstance.lookup('service:authenticator') as AuthenticatorService;
  authenticator.authenticate();
}

export default {
  initialize,
};
