import UserSyncerService from 'codecrafters-frontend/services/user-syncer';
import ApplicationInstance from '@ember/application/instance';

export function initialize(applicationInstance: ApplicationInstance) {
  const userSyncer = applicationInstance.lookup('service:user-syncer') as UserSyncerService;
  userSyncer.setupListener();
}

export default {
  initialize,
};
