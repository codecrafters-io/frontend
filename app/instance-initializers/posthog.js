import config from 'codecrafters-frontend/config/environment'
import posthog from 'posthog-js';

export function initialize(applicationInstance) {
  if (typeof FastBoot === 'undefined') {
    if (config.environment === 'production') {
      posthog.init('phc_jCl1mm3XbnvyIUr4h54oORqWEqj37gxhZIOebREBwxb', { api_host: 'https://app.posthog.com' })
    }
  }
}

export default {
  initialize,
};
