export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const webVitalsService = applicationInstance.lookup('service:web-vitals');
  webVitalsService.setupCallbacks();
}

export default {
  initialize,
};
