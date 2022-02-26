export function initialize(applicationInstance) {
  const pageViewTracker = applicationInstance.lookup('service:page-view-tracker');
  pageViewTracker.setupListener();
}

export default {
  initialize,
};
