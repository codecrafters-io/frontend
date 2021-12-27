import { text } from 'ember-cli-page-object';

export default {
  scope: '[data-test-course-collapsed-item]',
  title: text('[data-test-collapsed-item-title]'),
};
