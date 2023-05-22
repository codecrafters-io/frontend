export function initialize(applicationInstance) {
  const featureFlagSyncer = applicationInstance.lookup('service:feature-flag-syncer');
  featureFlagSyncer.setupListener();
}

export default {
  initialize,
};
