import ApplicationInstance from '@ember/application/instance';
import ForceUpdateService from 'codecrafters-frontend/services/force-update';

export function initialize(applicationInstance: ApplicationInstance) {
  const forceUpdate = applicationInstance.lookup('service:force-update') as ForceUpdateService;
  forceUpdate.setupListener();
}

export default {
  initialize,
};
