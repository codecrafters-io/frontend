import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';

module('Acceptance | course-admin | view-code-example', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view code example', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.previousStepsIncompleteModal.clickOnJustExploringButton();

    assert.strictEqual(coursePage.codeExamplesTab.solutionCards[0].changedFiles.length, 2, 'shows 2 changed files');
    assert.strictEqual(coursePage.codeExamplesTab.solutionCards[0].unchangedFiles.length, 2, 'shows 2 unchanged files');

    await coursePage.codeExamplesTab.solutionCards[0].unchangedFiles[0].clickOnExpandButton();
    await animationsSettled();

    assert.true(coursePage.codeExamplesTab.solutionCards[0].unchangedFiles[0].codeMirror.hasRendered, 'code mirror has rendered');
    assert.strictEqual(
      coursePage.codeExamplesTab.solutionCards[0].unchangedFiles[0].codeMirror.text,
      'Unchanged file content',
      'file contents rendered correctly',
    );
  });
});
