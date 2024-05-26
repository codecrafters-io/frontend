import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  evaluators: collection('[data-test-evaluator-item]', {
    viewCodeExampleEvaluatorButton: {
      scope: '[data-test-view-code-example-evaluator-button]',
    },
  }),

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators'),
});
