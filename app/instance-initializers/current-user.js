export function initialize(applicationInstance) {
  const currentUserService = applicationInstance.lookup('service:current-user');
  currentUserService.authenticate();
}

export default {
  initialize,
};
