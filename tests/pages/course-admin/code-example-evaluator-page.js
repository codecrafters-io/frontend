import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  evaluationsSections: collection('[data-test-evaluations-section]', {
    evaluationCards: collection('[data-test-evaluation-card]', {}),
  }),

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators'),
});
