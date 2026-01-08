import { clickOnText, fillable } from 'ember-cli-page-object';

export default {
  clickOnLanguageSuggestion: clickOnText('[data-test-language-suggestion]'),
  fillInLanguage: fillable('input'),
  resetScope: true,
  scope: '[data-test-request-language-dropdown]',
};
