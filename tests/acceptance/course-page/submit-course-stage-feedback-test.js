import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | submit-course-stage-feedback', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can submit course stage feedback after passing course stage', async function (assert) {
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

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1], // Stage #2
    });

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2], // Stage #3
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs', '3rd is expanded');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage completed');
    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'has feedback prompt');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', '2nd stage is expanded');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage completed');
    assert.notOk(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'does not have feedback prompt');

    await animationsSettled();
  });

  test('is not prompted for course stage feedback again if closed', async function (assert) {
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

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1], // Stage #2
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1], // Stage #2
      language: go,
      user: currentUser,
      status: 'closed',
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs', '3rd stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'Listening for a git push...', 'footer text is git push listener');

    await animationsSettled();
  });

  // Is shown next stage after feedback is submitted
});
