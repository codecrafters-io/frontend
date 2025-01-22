export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const authenticator = applicationInstance.lookup('service:authenticator');
  authenticator.authenticate();
}

export default {
  initialize,
};
