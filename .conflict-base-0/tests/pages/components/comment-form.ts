import { clickable } from 'ember-cli-page-object';

export default {
  commentInput: { scope: '[data-test-comment-input]' },
  clickOnCancelButton: clickable('[data-test-cancel-button]'),
  clickOnPostReplyButton: clickable('[data-test-post-reply-button]'),
  clickOnUpdateCommentButton: clickable('[data-test-update-comment-button]'),
  scope: '[data-test-comment-form]',
};
