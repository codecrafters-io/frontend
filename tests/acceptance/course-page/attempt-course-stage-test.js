import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | attempt-course-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

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
      ].length,
    );

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Listening for a git push...', 'footer text is waiting for git push');

    const submission = this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));

    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Tests failed.', 'footer text is tests failed');

    // Update to 15 minutes ago
    submission.update('createdAt', new Date(new Date().getTime() - 15 * 60 * 1000));
    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));

    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Last attempt 15 minutes ago. Try again?', 'footer text includes timestamp');
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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #2: Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'You completed this stage today.', 'footer text is stage passed');
  });

  test('passing first stage shows badges for staff users', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #1: Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Tests failed.', 'footer is tests failed');

    const submission = this.server.create('submission', 'withSuccessStatus', {
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
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Stage #1: Bind to a port', 'first stage is still active');
  });
});
