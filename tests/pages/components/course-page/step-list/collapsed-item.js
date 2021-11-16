import { isPresent, text } from 'ember-cli-page-object';

export default {
  scope: '[data-test-course-collapsed-item]',
  hasFreeLabel: isPresent('[data-test-free-label]'),
  title: text('[data-test-collapsed-item-title]'),
};
