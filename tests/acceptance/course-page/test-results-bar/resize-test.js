import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';

module('Acceptance | course-page | test-results-bar | resize', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can resize test results bar using mouse', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

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
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.testResultsBar.clickOnBottomSection();

    const desiredHeight = 500;
    let testResultsBarHeight = coursePage.testResultsBar.height;

    await coursePage.testResultsBar.resizeHandler.mouseDown({ button: 2 });
    await coursePage.testResultsBar.resizeHandler.mouseMove({ clientY: window.innerHeight - desiredHeight });
    await coursePage.testResultsBar.resizeHandler.mouseUp();

    assert.strictEqual(testResultsBarHeight, coursePage.testResultsBar.height, 'Right mouse button should not resize test results bar');

    await coursePage.testResultsBar.resizeHandler.mouseDown({ button: 0 });
    await coursePage.testResultsBar.resizeHandler.mouseMove({ clientY: window.innerHeight - desiredHeight });
    await coursePage.testResultsBar.resizeHandler.mouseUp();

    testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight, 'Left mouse button should resize test results bar');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnBottomSection();

    testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight, 'Test results bar maintains the height after closing and expanding again');
  });

  test('can resize test results bar using touch', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

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
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();

    const desiredHeight = 500;

    await coursePage.testResultsBar.resizeHandler.touchStart();
    await coursePage.testResultsBar.resizeHandler.touchMove({ touches: [{ clientY: window.innerHeight - desiredHeight }] });
    await coursePage.testResultsBar.resizeHandler.touchEnd();

    let testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight, 'Test results bar should be resized using touch');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnBottomSection();

    testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight, 'Test results bar maintains the height after closing and expanding again');
  });
});
