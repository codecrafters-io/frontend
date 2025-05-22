import { clickOnText, clickable, collection, text, triggerable } from 'ember-cli-page-object';
import CommentForm from 'codecrafters-frontend/tests/pages/components/comment-form';

export default {
  clickOnDropdownLink: clickOnText('[data-test-more-dropdown-content] div[role="button"]'),
  clickOnReplyButton: clickable('[data-test-reply-button]'),
  commentBodyText: text('[data-test-comment-body]'),
  commentForm: CommentForm,
  downvoteButton: { scope: '[data-test-downvote-button]' },
  replyCards: collection('[data-test-comment-card]', {}),
  toggleDropdown: clickable('[data-test-more-dropdown-toggle]:eq(0)'),
  upvoteButton: { scope: '[data-test-upvote-button]' },

  userLabel: {
    scope: '[data-test-user-label]',
    hover: triggerable('mouseenter'),
  },

  scope: '[data-test-comment-card]',
};
