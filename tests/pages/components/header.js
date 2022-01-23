import { clickable } from 'ember-cli-page-object';

export default {
  clickOnChallengesLink: clickable('[data-test-challenges-link]'),
  scope: '[data-test-header]',
};
