import codeExampleEvaluatorPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluator-page';
import codeExampleEvaluatorsPage from 'codecrafters-frontend/tests/pages/course-admin/code-example-evaluators-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, settled, waitUntil } from '@ember/test-helpers';

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
      status: 'draft',
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

    const evaluationCard = codeExampleEvaluatorPage.evaluationsSection.evaluationCards[0];

    // Helper to open the card and navigate to trusted evaluation tab
    const openTrustedEvaluationTab = async () => {
      await codeExampleEvaluatorPage.evaluationsSection.scrollIntoView();
      await evaluationCard.click();
      await evaluationCard.clickOnTabHeader('Trusted Evaluation');
    };

    await openTrustedEvaluationTab();

    const trustedEvaluationTab = evaluationCard.trustedEvaluationTab;

    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 0, 'No trusted evaluations yet');
    assert.false(trustedEvaluationTab.hasTrustedEvaluation, 'No trusted evaluation message shown');

    // Click "Correct" - creates trusted evaluation with same result as the current evaluation (pass)
    // This collapses the card, so we need to re-open it
    await trustedEvaluationTab.clickOnCorrectButton();
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 1, 'Trusted evaluation created');

    // Re-open to verify trusted evaluation is shown
    await openTrustedEvaluationTab();
    assert.true(trustedEvaluationTab.hasTrustedEvaluation, 'Trusted evaluation message shown');

    // Edit the trusted evaluation - destroys it (does not close the card)
    await trustedEvaluationTab.clickOnEditTrustedEvaluationButton();
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 0, 'Trusted evaluation destroyed');
    assert.false(trustedEvaluationTab.hasTrustedEvaluation, 'No trusted evaluation message shown');

    // Click "Wrong" - creates trusted evaluation with opposite result (fail)
    await trustedEvaluationTab.clickOnWrongButton();
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 1, 'Trusted evaluation created');

    // Re-open to verify trusted evaluation is shown
    await openTrustedEvaluationTab();
    assert.true(trustedEvaluationTab.hasTrustedEvaluation, 'Trusted evaluation message shown');

    // Edit the trusted evaluation again - destroys it
    await trustedEvaluationTab.clickOnEditTrustedEvaluationButton();
    assert.strictEqual(this.server.schema.trustedCommunitySolutionEvaluations.all().models.length, 0, 'No trusted evaluations');
    assert.false(trustedEvaluationTab.hasTrustedEvaluation, 'No trusted evaluation message shown');
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
    assert.true(trustedEvaluationTab.hasTrustedEvaluation, 'Trusted evaluation message is shown');
  });

  test('can delete draft evaluator', async function (assert) {
    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });
    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators/relevance', 'URL is correct');

    assert.true(codeExampleEvaluatorPage.isDeleteButtonVisible, 'Delete button is visible for draft evaluator');
    assert.strictEqual(this.server.schema.communitySolutionEvaluators.all().models.length, 1, 'Evaluator exists');

    await codeExampleEvaluatorPage.deleteButton.mousedown();
    await waitUntil(() => currentURL() === '/courses/redis/admin/code-example-evaluators');
    await settled();

    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators', 'Redirected to evaluators list');
    assert.strictEqual(this.server.schema.communitySolutionEvaluators.all().models.length, 0, 'Evaluator is deleted');
  });

  test('delete button is not visible for live evaluator', async function (assert) {
    this.evaluator.update({ status: 'live' });

    await codeExampleEvaluatorPage.visit({ course_slug: this.course.slug, evaluator_slug: this.evaluator.slug });
    assert.strictEqual(currentURL(), '/courses/redis/admin/code-example-evaluators/relevance', 'URL is correct');

    assert.false(codeExampleEvaluatorPage.isDeleteButtonVisible, 'Delete button is not visible for live evaluator');
    assert.false(codeExampleEvaluatorPage.isDeployButtonVisible, 'Deploy button is not visible for live evaluator');
  });
});
