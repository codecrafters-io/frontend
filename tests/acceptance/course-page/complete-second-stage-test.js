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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is not complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isExpanded, 'First step is not expanded');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[1].isComplete, 'Second step is not complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[1].isExpanded, 'Second step is not expanded');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[2].isComplete, 'Third step is not complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[2].isExpanded, 'Third step is not expanded');

    await coursePage.secondStageInstructionsCard.steps[0].click();

    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[0].isExpanded, 'First step is expanded');

    await coursePage.clickOnHeaderTabLink('Code Examples');
    await coursePage.clickOnHeaderTabLink('Instructions');

    // TODO: See if we can retain expanded/collapsed state after switching tabs?
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is not complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isExpanded, 'First step is collapsed');

    await coursePage.secondStageInstructionsCard.steps[0].click();
    await coursePage.secondStageInstructionsCard.clickOnCompleteStepButton();

    assert.ok(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isExpanded, 'First step is collapsed');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[1].isComplete, 'Second step is not complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[1].isExpanded, 'Second step is expanded');

    await coursePage.clickOnHeaderTabLink('Code Examples');
    await coursePage.clickOnHeaderTabLink('Instructions');

    // TODO: See if we can retain completion state after switching tabs?
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is not complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isExpanded, 'First step is collapsed');

    await coursePage.secondStageInstructionsCard.steps[0].click();
    await coursePage.secondStageInstructionsCard.clickOnCompleteStepButton();
    await coursePage.secondStageInstructionsCard.clickOnCompleteStepButton();

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 2),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.ok(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[1].isComplete, 'Second step is complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[2].isComplete, 'Third step is complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[0].isExpanded, 'First step is collapsed');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[1].isExpanded, 'Second step is collapsed');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[2].isExpanded, 'Third step is collapsed');

    assert.ok(coursePage.testRunnerCard.isExpanded, 'Test runner card is expanded');
    await coursePage.testRunnerCard.clickOnMarkStageAsCompleteButton();

    assert.notOk(coursePage.testRunnerCard.isVisible, 'Test runner card disappears');
    assert.ok(coursePage.completedStepNotice.isVisible, 'Completed step notice is visible');
  });

  // TODO: Test screencasts link
});
