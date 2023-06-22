export function initialize(applicationInstance) {
  let webVitalsService = applicationInstance.lookup('service:web-vitals');
  webVitalsService.setupCallbacks();
}

export default {
  initialize,
};
