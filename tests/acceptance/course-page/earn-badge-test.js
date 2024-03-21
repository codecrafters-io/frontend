import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | earn-badge', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

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

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Bind to a port', 'first stage is active');
    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'Tests failed.', 'footer is tests failed');

    const submission = this.server.create('submission', 'withStageCompletion', {
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

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await animationsSettled();

    assert.strictEqual(coursePage.desktopHeader.stepName, 'Bind to a port', 'first stage is still active');
    assert.contains(coursePage.earnedBadgeNotice.text, 'You just earned the Tesla Badge! Read the story.', 'badge notice text is correct');

    await percySnapshot('Course Stage - Earned Badged Notice');

    await coursePage.earnedBadgeNotice.click();
    assert.strictEqual(coursePage.earnedBadgeNotice.badgeEarnedModal.badgeName, 'The Tesla Badge');

    await percySnapshot('Course Stage - View Earned Badged');
  });
});
