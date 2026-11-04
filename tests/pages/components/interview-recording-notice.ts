import { attribute, text } from 'ember-cli-page-object';

export default {
  privacyPolicyLineText: text('[data-test-privacy-policy-line]'),
  privacyPolicyLinkHref: attribute('href', '[data-test-privacy-policy-link]'),
  privacyPolicyLinkTarget: attribute('target', '[data-test-privacy-policy-link]'),
  scope: '[data-test-interview-recording-notice]',
};
