import createPage from 'codecrafters-frontend/tests/support/create-page';
import { clickable, collection, isVisible, text, visitable } from 'ember-cli-page-object';

export default createPage({
  clickOnUndecidedOnlyToggle: clickable('[data-test-undecided-only-toggle]'),

  quizListItems: collection('[data-test-quiz-list-item]', {
    aiReadText: text('[data-test-ai-read]'),
    clickOnReviewButton: clickable('[data-test-review-button]'),
    competitionText: text('[data-test-competition-name]'),
    decisionText: text('[data-test-review-decision]'),
    retakeBadgeIsVisible: isVisible('[data-test-retake-badge]'),
    usernameText: text('[data-test-participant-username]'),
  }),

  quizzesTabIsVisible: isVisible('[data-test-course-admin-tab="quizzes"]'),
  visit: visitable('/courses/:course_slug/admin/quizzes'),
});
