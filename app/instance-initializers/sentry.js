import * as Sentry from '@sentry/ember';

export function initialize(applicationInstance) {
  let currentUserService = applicationInstance.lookup('service:currentUser');
  Sentry.setUser({ id: currentUserService.currentUserId, username: currentUserService.currentUserUsername });
}

export default {
  initialize,
};
