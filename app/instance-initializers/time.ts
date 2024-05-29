export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const time = applicationInstance.lookup('service:time');
  time.setupTimer();
}

export default {
  initialize,
};
