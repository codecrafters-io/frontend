import { text } from 'ember-cli-page-object';
import { clickable } from 'ember-cli-page-object';

export default {
  clickOnPublishToGithubLink: clickable('span:contains("Click here")'),
  instructionsText: text('[data-test-instructions-text]'),
  scope: '[data-test-course-completed-item]',
};
