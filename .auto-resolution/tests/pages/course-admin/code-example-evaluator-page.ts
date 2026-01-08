import EvaluationCard from 'codecrafters-frontend/tests/pages/components/course-admin/code-examples-page/evaluation-card';
import { collection, create, visitable } from 'ember-cli-page-object';

export default create({
  evaluationsSection: {
    evaluationCards: collection('[data-test-evaluation-card]', EvaluationCard),
    scope: '[data-test-evaluations-section]',

    scrollIntoView() {
      return document.querySelector(this.scope)!.scrollIntoView();
    },
  },

  visit: visitable('/courses/:course_slug/admin/code-example-evaluators'),
});
