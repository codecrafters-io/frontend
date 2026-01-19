import codeExampleEvaluatorsPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluators-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-code-example-evaluators', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.currentUser = this.server.schema.users.first();
    this.language = this.server.schema.languages.findBy({ name: 'Python' });
    this.course = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
    });
  });

  test('lists code example evaluators', async function (assert) {
    await codeExampleEvaluatorsPage.visit({ course_slug: this.course.slug });
    assert.strictEqual(codeExampleEvaluatorsPage.evaluators.length, 1);
  });
});
