export function initialize(applicationInstance) {
  // TODO: Fix this
  const currentUserService = applicationInstance.lookup('service:current-user');
  // currentUserService.authenticate();
}

export default {
  initialize,
};
