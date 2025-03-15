import config from 'codecrafters-frontend/config/environment';
import { posthog } from 'posthog-js';

export function initialize() {
  // @ts-expect-error FastBoot is not typed
  if (typeof FastBoot === 'undefined' && config.environment === 'production') {
    posthog.init('phc_jCl1mm3XbnvyIUr4h54oORqWEqj37gxhZIOebREBwxb', {
      api_host: 'https://us.i.posthog.com',
      autocapture: false, // We have our own events
      capture_pageview: false,
      capture_pageleave: false,
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
    });
  }
}

export default {
  initialize,
};
