import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | view-extension-stages', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view extension stages before creating repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    // Stages count (44) + 2 (introduction and repository setup)
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 57, 'step list has 57 items');

    await coursePage.sidebar.clickOnStepListItem('RDB file config');
    assert.strictEqual(currentURL(), '/courses/redis/stages/zg5', 'current URL is stage page URL');
  });

  test('can view extension stages after creating repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();

    await coursePage.welcomeCard.createRepositoryQuestionnaire.selectLanguageStep.clickOnLanguageButton('Python');
    await animationsSettled();

    assert.strictEqual(currentURL(), '/courses/dummy/introduction?repo=1', 'current URL is course page URL');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items');

    // View a stage from extension 2
    await coursePage.sidebar.clickOnStepListItem('Start with ext2');
    assert.strictEqual(currentURL(), '/courses/dummy/stages/ae0?repo=1', 'current URL is stage page URL');
  });
});
