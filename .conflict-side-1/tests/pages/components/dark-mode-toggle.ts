import { clickable, property } from 'ember-cli-page-object';

export default {
  clickOnDarkOption: clickable('label[for="option-dark"]'),
  clickOnLightOption: clickable('label[for="option-light"]'),
  clickOnSystemOption: clickable('label[for="option-system"]'),
  darkOptionIsSelected: property('checked', 'input#option-dark'),
  lightOptionIsSelected: property('checked', 'input#option-light'),
  scope: '[data-test-dark-mode-toggle]',
  systemOptionIsSelected: property('checked', 'input#option-system'),
};
