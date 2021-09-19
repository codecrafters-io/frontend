export function initialize(appInstance) {
  let username = appInstance.lookup('service:current-user').currentUserUsername;
  window.FS.identify(username, { displayName: username });
}

export default {
  initialize,
};
