import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | complete-second-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete second stage', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    // Auto-create next submission
    this.server.create('submission', 'withEvaluatingStatus', {
      repository: repository,
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 2),
      clientType: 'system',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.notOk(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[0].isExpanded, 'First step is expanded');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isComplete, 'Second step is not complete');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isExpanded, 'Second step is not expanded');

    await coursePage.secondStageTutorialCard.steps[0].click();

    assert.notOk(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[0].isExpanded, 'First step is expanded');

    await coursePage.clickOnHeaderTabLink('Code Examples');
    await coursePage.clickOnHeaderTabLink('Instructions');

    // TODO: See if we can retain expanded/collapsed state after switching tabs?
    assert.notOk(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[0].isExpanded, 'First step is expanded');

    await coursePage.secondStageTutorialCard.steps[0].click();
    await coursePage.secondStageTutorialCard.clickOnCompleteStepButton();

    assert.ok(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.secondStageTutorialCard.steps[0].isExpanded, 'First step is collapsed');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isComplete, 'Second step is not complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[1].isExpanded, 'Second step is expanded');

    await coursePage.clickOnHeaderTabLink('Code Examples');
    await coursePage.clickOnHeaderTabLink('Instructions');

    assert.ok(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isComplete, 'Second step is not complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[1].isExpanded, 'Second step is expanded');

    await coursePage.secondStageTutorialCard.steps[0].click();

    assert.ok(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isComplete, 'Second step is not complete');

    assert.ok(coursePage.secondStageTutorialCard.steps[0].isExpanded, 'First step is expanded');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isExpanded, 'Second step is collapsed');

    await coursePage.secondStageTutorialCard.steps[1].click();

    // Asserts that we don't show the "To run tests again..." message for a system submission
    assert.contains(coursePage.secondStageTutorialCard.steps[1].instructions, 'To run tests, make changes to your code');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 2),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.ok(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[1].isComplete, 'Second step is complete');
    assert.notOk(coursePage.secondStageTutorialCard.steps[0].isExpanded, 'First step is collapsed');
    assert.notOk(coursePage.secondStageTutorialCard.steps[1].isExpanded, 'Second step is collapsed');

    assert.ok(coursePage.testRunnerCard.isExpanded, 'Test runner card is expanded');
    await coursePage.testRunnerCard.clickOnMarkStageAsCompleteButton();

    assert.notOk(coursePage.testRunnerCard.isVisible, 'Test runner card disappears');
    assert.ok(coursePage.completedStepNotice.isVisible, 'Completed step notice is visible');
  });

  test('cannot complete second stage if tests passed via CLI', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    this.server.create('submission', 'withSuccessStatus', {
      clientType: 'cli',
      repository: repository,
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 2),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.ok(coursePage.secondStageTutorialCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageTutorialCard.steps[1].isComplete, 'Second step is complete');

    assert.ok(coursePage.testRunnerCard.isExpanded, 'Test runner card is expanded');
    assert.notOk(coursePage.testRunnerCard.markStageAsCompleteButton.isVisible, 'Mark stage as complete button is not visible');

    this.server.create('submission', 'withSuccessStatus', {
      clientType: 'git',
      repository: repository,
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 2),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.ok(coursePage.testRunnerCard.isExpanded, 'Test runner card is expanded');
    assert.ok(coursePage.testRunnerCard.markStageAsCompleteButton.isVisible, 'Mark stage as complete button is visible');

    await coursePage.testRunnerCard.clickOnMarkStageAsCompleteButton();

    assert.notOk(coursePage.testRunnerCard.isVisible, 'Test runner card disappears');
    assert.ok(coursePage.completedStepNotice.isVisible, 'Completed step notice is visible');
  });
});
