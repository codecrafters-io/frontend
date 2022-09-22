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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage completed');

    // TODO: Feedback form should be present
    // await this.pauseTest();
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

    // this.server.create('course-stage-feedback-submission', {
    //   repository: repository,
    //   courseStage: redis.stages.models.sortBy('position')[1], // Stage #2
    //   language: go,
    //   user: currentUser,
    //   status: 'closed',
    // });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    await this.pauseTest();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', 'second stage is active');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage completed');

    // TODO: Feedback form should be present
    // await this.pauseTest();
  });

  // Is shown next stage after feedback is submitted
});
