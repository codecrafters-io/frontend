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

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
      wasSubmittedViaCLI: true,
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.ok(coursePage.testsPassedCard.isVisible);
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
      submission: submission,
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    // TODO: Add tests for badge display
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Bind to a port', 'first stage is still active');
    assert.notOk(
      coursePage.completedStepNotice.shareProgressButton.isVisible,
      'completed step notice is not visible after finishing the first stage',
    );

    await coursePage.completedStepNotice.clickOnNextStepButton();
    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'current URL is stage 2');
  });

  test('share progress button is visible after completing the second stage', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.ok(coursePage.completedStepNotice.shareProgressButton.isVisible, 'completed step notice is visible if completed stage is not first stage');
  });

  test('share progress modal has the correct rendered content', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.notOk(coursePage.shareProgressModal.isVisible, 'progress banner modal is not visible');

    await coursePage.completedStepNotice.shareProgressButton.click();
    assert.ok(coursePage.shareProgressModal.isVisible, 'progress banner modal is visible');
    assert.true(
      coursePage.shareProgressModal.copyableText.value.includes(
        'Just completed Stage #2 of the @codecraftersio Build your own Redis challenge in Go.',
      ),
      'correct copyable text is shown',
    );
    assert.true(
      coursePage.shareProgressModal.copyableText.value.includes('https://app.codecrafters.io/courses/redis/overview'),
      'correct link in copyable text is shown',
    );

    await coursePage.shareProgressModal.socialPlatformIcons[1].click();
    assert.true(
      coursePage.shareProgressModal.copyableText.value.includes('Just completed Stage #2 of the CodeCrafters Build your own Redis challenge in Go.'),
      'correct copyable text is shown',
    );
  });

  test('progress banner and share progress modal analytics events are tracked', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    await coursePage.completedStepNotice.shareProgressButton.click();
    await coursePage.shareProgressModal.clickOnCopyButton();

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('copied_share_progress_text'), 'copied_share_progress_text event should be tracked');
    assert.ok(filteredAnalyticsEventsNames.includes('initiated_share_progress_flow'), 'initiated_share_progress_flow event should be tracked');
  });
});
