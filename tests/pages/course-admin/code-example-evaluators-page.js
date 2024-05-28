import { waitUntil } from '@ember/test-helpers';
import { collection, create, text, visitable } from 'ember-cli-page-object';

export default create({
  clickOnEvaluator: async function (evaluatorSlug) {
    await waitUntil(() => {
      return this.evaluators.toArray().find((evaluator) => evaluator.slug === evaluatorSlug);
    });

    await this.evaluators
      .toArray()
      .find((evaluator) => evaluator.slug === evaluatorSlug)
      .viewEvaluatorButton.click();
  },

  evaluators: collection('[data-test-evaluator-item]', {
    slug: text('[data-test-evaluator-slug]'),

    viewEvaluatorButton: {
      scope: '[data-test-view-evaluator-button]',
    },
  }),

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators'),
});
