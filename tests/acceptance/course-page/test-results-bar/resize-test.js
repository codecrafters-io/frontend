import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, skip } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { settled } from '@ember/test-helpers';

module('Acceptance | course-page | test-results-bar | resize', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  skip('can resize test results bar using mouse', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.testResultsBar.clickOnBottomSection();
    await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for CSS animation to complete

    let previousHeight = coursePage.testResultsBar.height;
    const desiredHeight = previousHeight - 50;

    // Don't know where the +1 comes from, could be border-related
    await coursePage.testResultsBar.resizeHandler.mouseDown({ button: 2 });
    await coursePage.testResultsBar.resizeHandler.mouseMove({ clientY: window.innerHeight - desiredHeight + 1 });
    await coursePage.testResultsBar.resizeHandler.mouseUp();

    assert.strictEqual(previousHeight, coursePage.testResultsBar.height, 'Right mouse button should not resize test results bar');

    // Don't know where the +1 comes from, could be border-related
    await coursePage.testResultsBar.resizeHandler.mouseDown({ button: 0 });
    await coursePage.testResultsBar.resizeHandler.mouseMove({ clientY: window.innerHeight - desiredHeight + 1 });
    await coursePage.testResultsBar.resizeHandler.mouseUp();

    assert.notStrictEqual(previousHeight, coursePage.testResultsBar.height, 'Test results bar should be resized');
    assert.strictEqual(desiredHeight, coursePage.testResultsBar.height, 'Left mouse button should resize test results bar');

    previousHeight = coursePage.testResultsBar.height;

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnBottomSection();
    await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for CSS animation to complete

    assert.strictEqual(previousHeight, coursePage.testResultsBar.height, 'Test results bar maintains the height after closing and expanding again');
  });

  skip('can resize test results bar using touch', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();

    const desiredHeight = 500;

    // Don't know where the +1 comes from, could be border-related
    await coursePage.testResultsBar.resizeHandler.touchStart();
    await coursePage.testResultsBar.resizeHandler.touchMove({ touches: [{ clientY: window.innerHeight - desiredHeight + 1 }] });
    await coursePage.testResultsBar.resizeHandler.touchEnd();
    await settled(); // Flakiness, this seems to fix it

    let testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight, 'Test results bar should be resized using touch');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnBottomSection();
    await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for CSS animation to complete

    testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight, 'Test results bar maintains the height after closing and expanding again');
  });
});
