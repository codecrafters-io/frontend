export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const pageViewTracker = applicationInstance.lookup('service:page-view-tracker');
  pageViewTracker.setupListener();
}

export default {
  initialize,
};
