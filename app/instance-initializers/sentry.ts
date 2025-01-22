import ApplicationInstance from '@ember/application/instance';

export function initialize(applicationInstance: ApplicationInstance) {
  const sentryService = applicationInstance.lookup('service:sentry');
  // @ts-expect-error service is not typed
  sentryService.identifyUser();
}

export default {
  initialize,
};
