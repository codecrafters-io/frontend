import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  evaluationsSection: {
    evaluationCards: collection('[data-test-evaluation-card]', {}),
    scope: '[data-test-evaluations-section]',
  },

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators'),
});
