import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';

module('Acceptance | course-page | code-examples | toggle-diff-source', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can toggle diff source if staff', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    createCommunityCourseStageSolution(this.server, redis, 2, go);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    assert.strictEqual(codeExamplesPage.solutionCards.length, 1, 'expected 1 Go solution to be present');

    assert.ok(codeExamplesPage.solutionCards[0].diffSourceSwitcher.changedFilesIconIsActive, 'expected changed files icon to be active');
    assert.notOk(codeExamplesPage.solutionCards[0].diffSourceSwitcher.highlightedFilesIconIsActive, 'expected highlighted files icon to be inactive');

    await codeExamplesPage.solutionCards[0].diffSourceSwitcher.click();
    assert.notOk(codeExamplesPage.solutionCards[0].diffSourceSwitcher.changedFilesIconIsActive, 'expected changed files icon to be inactive');
    assert.ok(codeExamplesPage.solutionCards[0].diffSourceSwitcher.highlightedFilesIconIsActive, 'expected highlighted files icon to be active');

    await codeExamplesPage.solutionCards[0].diffSourceSwitcher.click();
    assert.ok(codeExamplesPage.solutionCards[0].diffSourceSwitcher.changedFilesIconIsActive, 'expected changed files icon to be active');
    assert.notOk(codeExamplesPage.solutionCards[0].diffSourceSwitcher.highlightedFilesIconIsActive, 'expected highlighted files icon to be inactive');
  });
});
