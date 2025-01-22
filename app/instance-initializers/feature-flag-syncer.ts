export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const featureFlagSyncer = applicationInstance.lookup('service:feature-flag-syncer');
  featureFlagSyncer.setupListener();
}

export default {
  initialize,
};
