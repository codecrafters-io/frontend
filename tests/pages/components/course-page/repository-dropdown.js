import { text } from 'ember-cli-page-object';

export default {
  activeRepositoryName: text('[data-test-active-repository-name]'),
  scope: '[data-test-repository-dropdown]',
};
