import { setupAnimationTest } from 'codecrafters-frontend/tests/support/animation-helpers';
import { animationsSettled } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
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

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2], // Stage #3
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Handle concurrent clients', '4th is expanded');

    await coursePage.clickOnCollapsedItem('Respond to multiple PINGs');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs', '3rd is expanded');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage completed');
    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'does not have feedback prompt');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', '2nd stage is expanded');
    assert.strictEqual(coursePage.activeCourseStageItem.footerText, 'You completed this stage today.', 'footer text is stage completed');
    assert.notOk(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'does not have feedback prompt');

    await coursePage.clickOnCollapsedItem('Respond to multiple PINGs');
    await animationsSettled();

    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'has feedback prompt');
    await percySnapshot('Course Stage Feedback Prompt - No Selection');

    await coursePage.activeCourseStageItem.feedbackPrompt.clickOnOption('😍');
    await percySnapshot('Course Stage Feedback Prompt - With Selection');

    assert.strictEqual(
      coursePage.activeCourseStageItem.feedbackPrompt.explanationTextareaPlaceholder,
      'Tell us more!',
      'explanation textarea placeholder is correct'
    );

    await coursePage.activeCourseStageItem.feedbackPrompt.clickOnOption('😭');

    assert.strictEqual(
      coursePage.activeCourseStageItem.feedbackPrompt.explanationTextareaPlaceholder,
      'What could be better?',
      'explanation textarea placeholder is correct'
    );

    await coursePage.activeCourseStageItem.feedbackPrompt.clickOnSubmitButton();
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Handle concurrent clients', 'Next stage is expanded');
  });

  test('is shown different prompts based on stage number', async function (assert) {
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

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs', '4th is expanded');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to PING', '2nd stage is expanded');
    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'has feedback prompt');
    assert.strictEqual(coursePage.activeCourseStageItem.feedbackPrompt.questionText, 'Nice work! How did we do?');

    const completeStage = async (stageNumber) => {
      this.server.create('submission', 'withSuccessStatus', {
        repository: repository,
        courseStage: redis.stages.models.sortBy('position')[stageNumber - 1], // Stage #3
      });

      await this.clock.tick(2001); // Wait for poll
    };

    await completeStage(3);
    await coursePage.clickOnCollapsedItem('Respond to multiple PINGs');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs', '3rd stage is expanded');
    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'has feedback prompt');
    assert.strictEqual(coursePage.activeCourseStageItem.feedbackPrompt.questionText, 'Great streak! How did we do?');

    await completeStage(6);
    await coursePage.clickOnCollapsedItem('Implement the SET & GET commands');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Implement the SET & GET commands', 'penultimate stage is expanded');
    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'has feedback prompt');
    assert.strictEqual(coursePage.activeCourseStageItem.feedbackPrompt.questionText, 'Just one more to go! How did we do?');

    await completeStage(7);
    await coursePage.clickOnCollapsedItem('Expiry');
    await animationsSettled();

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Expiry', 'last stage is expanded');
    assert.ok(coursePage.activeCourseStageItem.hasFeedbackPrompt, 'has feedback prompt');
    assert.strictEqual(coursePage.activeCourseStageItem.feedbackPrompt.questionText, 'You did it! How did we do?');
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
});
