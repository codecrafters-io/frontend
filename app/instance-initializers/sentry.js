export function initialize(applicationInstance) {
  let sentryService = applicationInstance.lookup('service:sentry');
  sentryService.identifyUser();
}

export default {
  initialize,
};
