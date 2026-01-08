import codeExampleEvaluatorPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluator-page';
import codeExampleEvaluatorsPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluators-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | course-admin | view-code-example-evaluator', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.currentUser = this.server.schema.users.first();
    this.language = this.server.schema.languages.findBy({ name: 'Python' });
    this.course = this.server.schema.courses.findBy({ slug: 'redis' });

    this.evaluator = this.server.create('community-solution-evaluator', {
      slug: 'relevance',
      promptTemplate: 'Is the code example relevant to the prompt?',
    });

    this.solution1 = createCommunityCourseStageSolution(this.server, this.course, 2, this.language);
    this.solution2 = createCommunityCourseStageSolution(this.server, this.course, 2, this.language);

    this.server.create('community-solution-evaluation', {
      communitySolution: this.solution1,
      evaluator: this.evaluator,
      result: 'pass',
    });

    this.server.create('community-solution-evaluation', {
      communitySolution: this.solution2,
      evaluator: this.evaluator,
      result: 'fail',
    });
  });

  test('can create trusted evaluation for existing evaluation', async function (assert) {
    await codeExampleEvaluatorsPage.visit({ course_slug: this.course.slug });

    await codeExampleEvaluatorsPage.clickOnEvaluator('relevance');
    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators/relevance', 'URL is correct');

    await codeExampleEvaluatorPage.evaluationsSection.scrollIntoView();
    await codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0].click();
    await codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0].clickOnTabHeader('Trusted Evaluation');

    const trustedEvaluationTab = codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0].trustedEvaluationTab;

    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 0, 'No trusted evaluations yet');
    assert.strictEqual(trustedEvaluationTab.selectedItemText, 'None', 'Default value is none');

    await trustedEvaluationTab.clickOnValue('Pass');
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 1, 'Trusted evaluation created');
    assert.strictEqual(trustedEvaluationTab.selectedItemText, 'Pass', 'Updated value is pass');

    await trustedEvaluationTab.clickOnValue('Fail');
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 1, 'Trusted evaluation created');
    assert.strictEqual(trustedEvaluationTab.selectedItemText, 'Fail', 'Updated value is fail');

    await trustedEvaluationTab.clickOnValue('None');
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 0, 'No trusted evaluations yet');
    assert.strictEqual(trustedEvaluationTab.selectedItemText, 'None', 'Updated value is none');
  });

  test('can view trusted evaluation for existing evaluation', async function (assert) {
    this.server.create('trusted-community-solution-evaluation', {
      communitySolution: this.solution2,
      evaluator: this.evaluator,
      result: 'pass',
    });

    await codeExampleEvaluatorsPage.visit({ course_slug: this.course.slug });

    await codeExampleEvaluatorsPage.clickOnEvaluator('relevance');
    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators/relevance', 'URL is correct');

    await codeExampleEvaluatorPage.evaluationsSection.scrollIntoView();
    await codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0].click();
    await codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0].clickOnTabHeader('Trusted Evaluation');

    const trustedEvaluationTab = codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0].trustedEvaluationTab;
    assert.strictEqual(trustedEvaluationTab.selectedItemText, 'Pass', 'Updated value is pass');
  });
});
