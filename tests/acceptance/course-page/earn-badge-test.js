import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | earn-badge', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  // Scroll tests don't work with the container docked to the side
  // TODO: Extract this into a common setupApplicationTest function
  hooks.beforeEach(() => {
    const testContainer = document.getElementById('ember-testing-container');
    testContainer.classList.add('ember-testing-container-full-screen');
  });

  // Scroll tests don't work with the container docked to the side
  // TODO: Extract this into a common setupApplicationTest function
  hooks.afterEach(() => {
    const testContainer = document.getElementById('ember-testing-container');
    testContainer.classList.remove('ember-testing-container-full-screen');
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
      slug: 'right-the-first-time',
      name: 'Tesla',
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

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Bind to a port', 'first stage is still active');
    assert.contains(coursePage.activeCourseStageItem.earnedBadgeNotice.text, 'You earned the Tesla badge.', 'text');

    await coursePage.activeCourseStageItem.earnedBadgeNotice.clickOnViewButton();
    assert.strictEqual(coursePage.activeCourseStageItem.earnedBadgeNotice.badgeEarnedModal.badgeName, 'The Tesla badge');
  });
});
