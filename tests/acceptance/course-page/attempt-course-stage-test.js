import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | attempt-course-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

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

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');

    assert.strictEqual(
      apiRequestsCount(this.server),
      [
        'fetch courses (courses listing page)',
        'fetch repositories (courses listing page)',
        'fetch courses (course page)',
        'fetch repositories (course page)',
        'fetch leaderboard entries (course page)',
      ].length
    );

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await this.clock.tick(2001); // Wait for poll

    // force re-computation
    await catalogPage.visit(); // This interacts with start-course-stage, not sure why
    await catalogPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.strictEqual(
      coursePage.activeCourseStageItem.footerText,
      'Tests failed. Check your git push output for logs.',
      'footer text is tests failed'
    );
    await this.clock.tick(1000 * 601); // Wait for poll + 10 minutes to pass

    // force re-computation
    await catalogPage.visit(); // This interacts with start-course-stage, not sure why
    await catalogPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Last attempt 10 minutes ago. Try again?', 'footer text includes timestamp');

    await catalogPage.visit(); // This interacts with start-course-stage, not sure why
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

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await this.clock.tick(2001); // Wait for poll
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage passed');
  });

  test('passing first stage automatically advances for existing users', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    currentUser.update({ featureFlags: { 'pulsing-solutions-button': 'test' } });

    let repository = this.server.create('repository', 'withSetupStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[0],
    });

    await this.clock.tick(2001); // Wait for poll
    await animationsSettled();

    await this.clock.tick(2001); // Wait for auto-advance
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is still active');
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

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

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

    await this.clock.tick(2001); // Wait for poll
    await animationsSettled();

    await this.clock.tick(2001); // Wait for auto-advance
    await animationsSettled();

    // TODO: Add tests for badge display
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is still active');
  });

  test('passing first stage displays completion video for staff users', async function (assert) {
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

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[0],
    });

    await this.clock.tick(2001); // Wait for poll
    await animationsSettled();

    await this.clock.tick(2001); // Wait for auto-advance
    await animationsSettled();

    // TODO: Add tests for badge display
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is still active');
  });

  test('first-stage footer message before 30min', async function (assert) {
    setupFirstStageScenario(this.owner, this.server);

    await this.clock.tick(1000 * 1741); // Wait for poll + 29 minutes to pass
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');
  });

  test('first-stage footer message after 30min', async function (assert) {
    setupFirstStageScenario(this.owner, this.server);

    await this.clock.tick(1000 * 1801); // Wait for poll + 30 minutes to pass
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.strictEqual(currentURL(), '/courses/redis', 'current URL is course page URL');
    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Last attempt 30 minutes ago. Try again?', 'footer text includes timestamp');
  });
});

function setupFirstStageScenario(owner, server) {
  testScenario(server);
  signInAsSubscriber(owner, server);

  let currentUser = server.schema.users.first();
  let python = server.schema.languages.findBy({ name: 'Python' });
  let redis = server.schema.courses.findBy({ slug: 'redis' });

  server.create('repository', 'withSetupStageCompleted', {
    course: redis,
    language: python,
    user: currentUser,
  });
}
