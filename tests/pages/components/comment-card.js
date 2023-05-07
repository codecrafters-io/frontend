import { clickOnText, clickable, collection, text } from 'ember-cli-page-object';
import CommentForm from './course-page/course-stage-solution-modal/comment-form';

export default {
  clickOnDropdownLink: clickOnText('[data-test-more-dropdown-content] div[role="button"]'),
  clickOnReplyButton: clickable('[data-test-reply-button]'),
  commentBodyText: text('[data-test-comment-body]'),
  commentForm: CommentForm,
  downvoteButton: { scope: '[data-test-downvote-button]' },
  replyCards: collection('[data-test-comment-card]', {}),
  toggleDropdown: clickable('[data-test-more-dropdown-toggle]:eq(0)'),
  upvoteButton: { scope: '[data-test-upvote-button]' },
  scope: '[data-test-comment-card]',
};
