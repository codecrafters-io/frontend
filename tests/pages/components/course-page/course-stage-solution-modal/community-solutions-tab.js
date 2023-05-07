import { clickable, collection } from 'ember-cli-page-object';

export default {
  solutionCards: collection('[data-test-community-solution-card]', {
    clickOnExpandButton: clickable('[data-test-expand-button]'),
    clickOnCollapseButton: clickable('[data-test-collapse-button]'),
    toggleCommentsButtons: collection('[data-test-toggle-comments-button]'),
    commentCards: collection('[data-test-comment-card]'),
  }),
  scope: '[data-test-community-solutions-tab]',
};
