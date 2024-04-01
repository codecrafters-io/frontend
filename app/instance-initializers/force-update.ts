export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const forceUpdate = applicationInstance.lookup('service:force-update');
  forceUpdate.setupListener();
}

export default {
  initialize,
};
