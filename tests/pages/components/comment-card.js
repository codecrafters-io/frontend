import { clickOnText, clickable, collection, text, triggerable } from 'ember-cli-page-object';
import CommentForm from 'codecrafters-frontend/tests/pages/components/comment-form';

export default {
  clickOnDropdownLink: clickOnText('[data-test-more-dropdown-content] div[role="button"]'),
  clickOnReplyButton: clickable('[data-test-reply-button]'),
  commentBodyText: text('[data-test-comment-body]:eq(0)'),
  commentForm: CommentForm,
  downvoteButton: { scope: '[data-test-downvote-button]' },
  replyCards: collection('[data-test-comment-card]', {
    commentBodyText: text('[data-test-comment-body]:eq(0)'),
  }),
  toggleDropdown: clickable('[data-test-more-dropdown-toggle]:eq(0)'),
  upvoteButton: { scope: '[data-test-upvote-button]' },

  userLabel: {
    scope: '[data-test-user-label]',
    hover: triggerable('mouseenter'),
  },

  approvalStatusLabel: {
    scope: '[data-test-approval-status-label]:eq(0)',
  },

  hideRejectedCommentsButton: {
    scope: '[data-test-hide-rejected-comments-button]',
    click: clickable(),
  },

  scope: '[data-test-comment-card]',
};
