import { text } from 'ember-cli-page-object';

export default {
  scope: '[data-test-voice-orb]',
  statusText: text('[data-test-voice-orb-status]'),
};
