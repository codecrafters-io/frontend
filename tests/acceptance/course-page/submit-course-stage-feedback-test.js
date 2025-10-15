import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { settled } from '@ember/test-helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | submit-course-stage-feedback', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can submit course stage feedback after passing course stage', async function (assert) {
    testScenario(this.server);
    const currentUser = signInAsSubscriber(this.owner, this.server);

    // TODO: Remove this once leaderboard isn't behind a feature flag
    currentUser.update('featureFlags', { 'should-see-leaderboard': 'test' });

    const go = this.server.schema.languages.findBy({ slug: 'go' });
    const dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
    });

    // Stages 2 and 3 are completed
    [2, 3].forEach((stageNumber) => {
      this.server.create('submission', 'withStageCompletion', {
        repository: repository,
        courseStage: dummy.stages.models.sortBy('position')[stageNumber - 1],
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Finish with ext1', 'stage 4 is active');

    await coursePage.sidebar.clickOnStepListItem('Start with ext1');
    assert.strictEqual(coursePage.header.stepName, 'Start with ext1', 'stage 3 is active');

    assert.ok(coursePage.currentStepCompleteModal.languageLeaderboardRankSection.isVisible, 'language leaderboard rank section is visible');
    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');

    await coursePage.sidebar.clickOnStepListItem('Start with ext1');
    await animationsSettled();

    assert.strictEqual(coursePage.header.stepName, 'Start with ext1', '3rd stage is expanded');
    assert.ok(coursePage.currentStepCompleteModal.languageLeaderboardRankSection.isVisible, 'language leaderboard rank section is visible');
    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');

    await coursePage.sidebar.clickOnStepListItem('The second stage');
    await animationsSettled();

    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');

    // Wait for feedback submission to be created
    await settled();

    await percySnapshot('Course Stage Feedback Prompt - No Selection');

    await coursePage.feedbackPrompt.clickOnOption('😍');
    await percySnapshot('Course Stage Feedback Prompt - With Selection');

    assert.strictEqual(coursePage.feedbackPrompt.explanationTextareaPlaceholder, 'Tell us more!', 'explanation textarea placeholder is correct');

    await coursePage.feedbackPrompt.clickOnOption('😭');

    assert.strictEqual(
      coursePage.feedbackPrompt.explanationTextareaPlaceholder,
      'What could be better?',
      'explanation textarea placeholder is correct',
    );

    await coursePage.feedbackPrompt.fillInExplanation('I love this course!');

    await coursePage.feedbackPrompt.clickOnSubmitButton();
    assert.strictEqual(coursePage.header.stepName, 'Finish with ext1', 'next stage is shown after feedback submission');

    const submission = this.server.schema.courseStageFeedbackSubmissions.first();
    assert.strictEqual(submission.explanation, 'I love this course!', 'explanation is saved');
  });

  test('is shown different prompts based on stage number', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
    });

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: dummy.stages.models.sortBy('position')[1], // Stage #2
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Start with ext1', '3rd stage is expanded');

    await coursePage.sidebar.clickOnStepListItem('The second stage');
    await animationsSettled();

    assert.strictEqual(coursePage.header.stepName, 'The second stage', '2nd stage is expanded');
    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');
    assert.strictEqual(coursePage.feedbackPrompt.questionText, 'Nice work! How did we do?');

    const completeStage = async (stageNumber) => {
      this.server.create('submission', 'withStageCompletion', {
        repository: repository,
        courseStage: dummy.stages.models.sortBy('position')[stageNumber - 1], // Stage #3
      });

      await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    };

    await completeStage(3);
    await coursePage.sidebar.clickOnStepListItem('Start with ext1');
    await animationsSettled();

    assert.strictEqual(coursePage.header.stepName, 'Start with ext1', '3rd stage is expanded');
    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');

    // Wait for feedback submission to be created
    await settled();

    assert.strictEqual(coursePage.feedbackPrompt.questionText, 'Great streak! How did we do?');

    await completeStage(4);
    await coursePage.sidebar.stepListItems[6].click();
    await animationsSettled();

    // TODO: Bring back the last & penultimate feedback prompts!
    //
    // assert.strictEqual(coursePage.header.stepName, 'Implement the SET & GET commands', 'penultimate stage is expanded');
    // assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');
    // assert.strictEqual(coursePage.feedbackPrompt.questionText, 'Just one more to go! How did we do?');

    // await completeStage(7);
    // await coursePage.sidebar.clickOnStepListItem('Expiry');
    // await animationsSettled();

    // assert.strictEqual(coursePage.header.stepName, 'Expiry', 'last stage is expanded');
    // assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');
    // assert.strictEqual(coursePage.feedbackPrompt.questionText, 'You did it! How did we do?');
  });

  test('is not prompted for course stage feedback again if closed', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
    });

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: dummy.stages.models.sortBy('position')[1], // Stage #2
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: dummy.stages.models.sortBy('position')[1], // Stage #2
      language: go,
      user: currentUser,
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.header.stepName, 'Start with ext1', '3rd stage is active');
    assert.strictEqual(coursePage.testResultsBar.progressIndicatorText, 'Ready to run tests...', 'footer text is git push listener');

    await animationsSettled();
  });

  test('can submit course stage feedback after passing base stage', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
    });

    // Complete stages 2 and 3
    [2, 3].forEach((stageNumber) => {
      this.server.create('submission', 'withStageCompletion', {
        repository: repository,
        courseStage: dummy.stages.models.sortBy('position')[stageNumber - 1],
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('Start with ext1');

    // Wait for feedback submission to be created
    await settled();

    await coursePage.feedbackPrompt.clickOnOption('😍');
    await coursePage.feedbackPrompt.fillInExplanation('I love this course!');

    await coursePage.feedbackPrompt.clickOnSubmitButton();
    assert.strictEqual(coursePage.header.stepName, 'Finish with ext1', 'next stage is shown after feedback submission');

    const submission = this.server.schema.courseStageFeedbackSubmissions.first();
    assert.strictEqual(submission.explanation, 'I love this course!', 'explanation is saved');
  });
});
