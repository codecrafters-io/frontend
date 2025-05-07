import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | attempt-course-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can fail course stage', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/stages/rg2', 'current URL is course page URL');

    assert.strictEqual(
      apiRequestsCount(this.server),
      [
        'fetch courses (catalog)',
        'fetch repositories (catalog)',
        'fetch languages (catalog)',
        'fetch courses (course page)',
        'fetch repositories (course page)',
        'fetch leaderboard entries (course page)',
        'fetch hints (course page)',
        'fetch language guide (course page)',
        'fetch course stage comments (course page)',
        'fetch leaderboard entries (course page)',
      ].length,
    );

    assert.strictEqual(coursePage.header.stepName, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Ready to run tests...', 'footer text is waiting for git push');

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Tests failed.', 'footer text is tests failed');

    await percySnapshot('Course Page - Second stage failed');

    await coursePage.testRunnerCard.click();
    await percySnapshot('Test Runner Card - Failed tests');

    await coursePage.testRunnerCard.clickOnHideInstructionsButton();
  });

  test('can pass course stage', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Ready to run tests...', 'footer text is waiting for git push');

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.contains(coursePage.currentStepCompleteModal.completionMessage, 'You completed this stage today.');
  });

  test('can pass tests using CLI', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Respond to PING', 'second stage is active');
    assert.ok(coursePage.testRunnerCard.isVisible, 'test runner card is visible');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      clientType: 'cli',
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.notOk(coursePage.testRunnerCard.isVisible, 'test runner card is not visible');
    assert.ok(coursePage.testsPassedModal.isVisible, 'tests passed modal is visible');
  });
});
