import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

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

    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'current URL is course page URL');

    assert.strictEqual(
      apiRequestsCount(this.server),
      [
        'fetch courses (courses listing page)',
        'fetch repositories (courses listing page)',
        'fetch courses (course page)',
        'fetch repositories (course page)',
        'fetch leaderboard entries (course page)',
        'fetch hints (course page)',
        // 'fetch language guide (course page)',
      ].length,
    );

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING', 'second stage is active');
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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Ready to run tests...', 'footer text is waiting for git push');

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'You completed this stage today.', 'footer text is stage passed');
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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING', 'second stage is active');
    assert.notOk(coursePage.testRunnerCard.borderIsTeal, 'test runner card is gray');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      clientType: 'cli',
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.ok(coursePage.testRunnerCard.borderIsTeal, 'test runner card is teal');
  });

  test('passing first stage shows badges', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withSetupStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Tests failed.', 'footer is tests failed');

    const submission = this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[0],
    });

    const badge = this.server.create('badge', {
      slug: 'passed-first-stage',
      name: 'Passed first stage',
    });

    this.server.create('badge-award', {
      user: currentUser,
      badge: badge,
      courseStageCompletion: submission.repository.courseStageCompletions.models[0],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    // TODO: Add tests for badge display
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Bind to a port', 'first stage is still active');
    assert.ok(coursePage.earnedBadgeNotice.isVisible, 'badge is visible');

    await coursePage.completedStepNotice.clickOnNextStepButton();
    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'current URL is stage 2');
  });
});
