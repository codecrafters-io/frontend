import { clickOnText, clickable, collection, fillable, hasClass } from 'ember-cli-page-object';
import CommentCard from 'codecrafters-frontend/tests/pages/components/comment-card';

export default {
  clickOnTabHeader: clickOnText('[data-test-tab-header]'),
  clickOnSubmitButton: clickable('[data-test-submit-button]'),
  submitButtonIsDisabled: hasClass('cursor-not-allowed', '[data-test-submit-button]'),
  commentCards: collection('[data-test-comment-card][data-test-child-comment=false]', CommentCard),
  fillInCommentInput: fillable('[data-test-comment-input]'),

  toggleRejectedCommentsButton: {
    scope: '[data-test-toggle-rejected-comments-button]',
    click: clickable(),
  },

  scope: '[data-test-comment-list]',
};
