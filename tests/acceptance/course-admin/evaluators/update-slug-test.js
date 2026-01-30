import codeExampleEvaluatorPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluator-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | evaluators | update-slug-test', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.course = this.server.schema.courses.findBy({ slug: 'redis' });

    this.evaluator = this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
      status: 'draft',
    });
  });

  test('can update evaluator slug', async function (assert) {
    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });

    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators/relevance', 'URL is correct initially');

    await codeExampleEvaluatorPage.slugField.clickOnDisplay();
    await codeExampleEvaluatorPage.slugField.fillInput('new-slug');
    await codeExampleEvaluatorPage.slugField.clickOnConfirmButton();

    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators/new-slug', 'URL is updated after slug change');
    assert.strictEqual(this.evaluator.reload().slug, 'new-slug', 'Evaluator slug is updated in the database');
  });
});
