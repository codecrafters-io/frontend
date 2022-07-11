import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(currentURL(), '/courses/redis', 'current URL is course page URL');

    assert.equal(
      this.server.pretender.handledRequests.length,
      [
        'fetch courses (courses listing page)',
        'fetch repositories (courses listing page)',
        'notify page view (courses listing page)',
        'fetch courses (course page)',
        'fetch repositories (course page)',
        'fetch leaderboard entries (course page)',
        'notify page view (course page)',
      ].length
    );

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.equal(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await this.clock.tick(2001); // Wait for poll

    // force re-computation
    await coursesPage.visit(); // This interacts with start-course-stage, not sure why
    await coursesPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.equal(coursePage.activeCourseStageItem.footerText, 'Tests failed. Check your git push output for logs.', 'footer text is tests failed');
    await this.clock.tick(1000 * 601); // Wait for poll + 10 minutes to pass

    // force re-computation
    await coursesPage.visit(); // This interacts with start-course-stage, not sure why
    await coursesPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.equal(coursePage.activeCourseStageItem.footerText, 'Last attempt 10 minutes ago. Try again?', 'footer text includes timestamp');

    await coursesPage.visit(); // This interacts with start-course-stage, not sure why
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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.equal(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await this.clock.tick(2001); // Wait for poll
    await animationsSettled();

    assert.equal(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage passed');
  });

  test('passing first stage does not automatically advance if a code walkthrough is present', async function (assert) {
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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.equal(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await this.clock.tick(2001); // Wait for poll
    await animationsSettled();

    await this.clock.tick(2001); // Wait for auto-advance
    await animationsSettled();

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is still active');
    assert.ok(coursePage.activeCourseStageItem.hasPostCompletionPrompt, 'view solution prompt is present');

    await percySnapshot('View Solution Prompt - Stage 2 (walkthrough + solution)');
  });

  test('first-stage footer message before 30min', async function (assert) {
    setupFirstStageScenario(this.owner, this.server);

    await this.clock.tick(1000 * 1741); // Wait for poll + 29 minutes to pass
    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.equal(currentURL(), '/courses/redis', 'current URL is course page URL');
    assert.equal(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.equal(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is waiting for git push');
  });

  test('first-stage footer message after 30min', async function (assert) {
    setupFirstStageScenario(this.owner, this.server);

    await this.clock.tick(1000 * 1801); // Wait for poll + 30 minutes to pass
    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await animationsSettled();

    assert.equal(currentURL(), '/courses/redis', 'current URL is course page URL');
    assert.equal(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is active');
    assert.equal(coursePage.activeCourseStageItem.footerText, 'Last attempt 30 minutes ago. Try again?', 'footer text includes timestamp');
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
