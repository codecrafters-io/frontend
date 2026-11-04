import { clickable, collection, text } from 'ember-cli-page-object';

export default {
  clickOnRetakeButton: clickable('[data-test-retake-button]'),
  overallVerdictText: text('[data-test-overall-verdict]'),

  questions: collection('[data-test-report-question]', {
    codeExcerptLines: collection('[data-test-code-excerpt-line]'),
    evidenceQuoteText: text('[data-test-evidence-quote]'),
    questionText: text('[data-test-question-text]'),
    verdictText: text('[data-test-question-verdict]'),
  }),

  questionsDemonstratedText: text('[data-test-questions-demonstrated]'),
  reviewSuggestionsText: text('[data-test-review-suggestions]'),
  scope: '[data-test-report]',
  summaryText: text('[data-test-report-summary]'),
};
