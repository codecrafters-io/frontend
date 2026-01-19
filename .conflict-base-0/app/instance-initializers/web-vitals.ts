import ApplicationInstance from '@ember/application/instance';
import WebVitalsService from 'codecrafters-frontend/services/web-vitals';

export function initialize(applicationInstance: ApplicationInstance) {
  const webVitalsService = applicationInstance.lookup('service:web-vitals') as WebVitalsService;
  webVitalsService.setupCallbacks();
}

export default {
  initialize,
};
