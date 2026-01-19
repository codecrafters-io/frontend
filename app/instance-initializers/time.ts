import ApplicationInstance from '@ember/application/instance';
import TimeService from 'codecrafters-frontend/services/time';

export function initialize(applicationInstance: ApplicationInstance) {
  const time = applicationInstance.lookup('service:time') as TimeService;
  time.setupTimer();
}

export default {
  initialize,
};
