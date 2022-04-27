import { clickOnText } from 'ember-cli-page-object';

export default {
  clickOnLanguageSuggestion: clickOnText('[data-test-language-suggestion]'),
  resetScope: true,
  scope: '[data-test-request-language-dropdown]',
};
