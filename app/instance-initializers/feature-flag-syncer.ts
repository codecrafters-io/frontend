import ApplicationInstance from '@ember/application/instance';

export function initialize(applicationInstance: ApplicationInstance) {
  const featureFlagSyncer = applicationInstance.lookup('service:feature-flag-syncer');
  // @ts-expect-error service is not typed
  featureFlagSyncer.setupListener();
}

export default {
  initialize,
};
