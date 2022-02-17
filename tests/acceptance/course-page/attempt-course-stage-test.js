import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | attempt-course-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can fail course stage', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

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
    assert.equal(this.server.pretender.handledRequests.length, 5); // Fetch course (courses page + course page) + fetch repositories + leaderboard

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'first stage is active');
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
});
