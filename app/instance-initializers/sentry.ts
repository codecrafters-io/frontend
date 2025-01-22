export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const sentryService = applicationInstance.lookup('service:sentry');
  sentryService.identifyUser();
}

export default {
  initialize,
};
