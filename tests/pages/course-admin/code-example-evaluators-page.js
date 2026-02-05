import { waitUntil } from '@ember/test-helpers';
import { clickable, collection, create, text, visitable } from 'ember-cli-page-object';

export default create({
  clickOnCreateEvaluatorButton: clickable('[data-test-create-evaluator-button]'),

  clickOnEvaluator: async function (evaluatorSlug) {
    await waitUntil(() => {
      return [...this.evaluators].find((evaluator) => evaluator.slug === evaluatorSlug);
    });

    await [...this.evaluators].find((evaluator) => evaluator.slug === evaluatorSlug).click();
  },

  evaluators: collection('[data-test-evaluator-item]', {
    slug: text('[data-test-evaluator-slug]'),
  }),

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators'),
});
