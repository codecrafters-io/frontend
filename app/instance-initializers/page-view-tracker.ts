import ApplicationInstance from '@ember/application/instance';

export function initialize(applicationInstance: ApplicationInstance) {
  const pageViewTracker = applicationInstance.lookup('service:page-view-tracker');
  // @ts-expect-error service is not typed
  pageViewTracker.setupListener();
}

export default {
  initialize,
};
