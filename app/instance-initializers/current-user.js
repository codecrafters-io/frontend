export function initialize(applicationInstance) {
  const authenticator = applicationInstance.lookup('service:authenticator');
  authenticator.authenticate();
}

export default {
  initialize,
};
