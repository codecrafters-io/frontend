import * as Sentry from '@sentry/ember';

export function initialize(applicationInstance) {
  let currentUserService = applicationInstance.lookup('service:currentUser');

  if (currentUserService.isAuthenticated) {
    Sentry.setUser({ id: currentUserService.currentUserId, username: currentUserService.currentUserUsername });
  }
}

export default {
  initialize,
};
