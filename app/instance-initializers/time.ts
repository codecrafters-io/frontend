import config from 'codecrafters-frontend/config/environment';

export function initialize(applicationInstance: unknown) {
  // @ts-expect-error not typed
  const time = applicationInstance.lookup('service:time');

  if (config.environment !== 'test') {
    time.setupTimer();
  }
}

export default {
  initialize,
};
