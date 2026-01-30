import codeExampleEvaluatorsPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluators-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | evaluators | create-test', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.course = this.server.schema.courses.findBy({ slug: 'redis' });
  });

  test('can create an evaluator when none exist', async function (assert) {
    await codeExampleEvaluatorsPage.visit({ course_slug: this.course.slug });

    assert.strictEqual(codeExampleEvaluatorsPage.evaluators.length, 0, 'no evaluators initially');

    await codeExampleEvaluatorsPage.clickOnCreateEvaluatorButton();

    assert.true(currentURL().includes('/admin/code-example-evaluators/'), 'redirects to the new evaluator page');
  });
});
