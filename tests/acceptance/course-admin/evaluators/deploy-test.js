import codeExampleEvaluatorPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluator-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | evaluators | deploy-test', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.course = this.server.schema.courses.findBy({ slug: 'redis' });
  });

  test('can deploy draft evaluator', async function (assert) {
    this.evaluator = this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
      status: 'draft',
    });

    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });

    assert.true(codeExampleEvaluatorPage.isDeployButtonVisible, 'Deploy button is visible for draft evaluator');

    await codeExampleEvaluatorPage.clickOnDeployButton();

    assert.strictEqual(this.evaluator.reload().status, 'live', 'Evaluator status is updated to live');
    assert.false(codeExampleEvaluatorPage.isDeployButtonVisible, 'Deploy button is hidden after deployment');
  });

  test('deploy button is hidden for live evaluators', async function (assert) {
    this.evaluator = this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
      status: 'live',
    });

    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });

    assert.false(codeExampleEvaluatorPage.isDeployButtonVisible, 'Deploy button is hidden for live evaluator');
  });
});
