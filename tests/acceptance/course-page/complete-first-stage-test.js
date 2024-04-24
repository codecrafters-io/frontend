import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | complete-first-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete first stage', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    this.server.create('repository', {
      course: course,
      language: python,
      user: currentUser,
    });

    // Pushed empty commit
    this.server.create('submission', {
      repository: this.server.schema.repositories.find(1),
      status: 'failure',
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 1),
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    await coursePage.firstStageInstructionsCard.scrollIntoView();

    assert.notOk(coursePage.firstStageInstructionsCard.steps[0].isComplete, 'First step is not complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[0].isExpanded, 'First step is not expanded');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[1].isComplete, 'Second step is not complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[1].isExpanded, 'Second step is not expanded');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isComplete, 'Third step is not complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isExpanded, 'Third step is not expanded');

    await coursePage.firstStageInstructionsCard.steps[0].click();

    assert.notOk(coursePage.firstStageInstructionsCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.firstStageInstructionsCard.steps[0].isExpanded, 'First step is expanded');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[1].isComplete, 'Second step is not complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[1].isExpanded, 'Second step is not expanded');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isComplete, 'Third step is not complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isExpanded, 'Third step is not expanded');

    await coursePage.firstStageInstructionsCard.clickOnCompleteStepButton();

    assert.ok(coursePage.firstStageInstructionsCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[0].isExpanded, 'First step is collapsed');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[1].isComplete, 'Second step is not complete');
    assert.ok(coursePage.firstStageInstructionsCard.steps[1].isExpanded, 'Second step is expanded');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isComplete, 'Third step is not complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isExpanded, 'Third step is not expanded');

    await coursePage.firstStageInstructionsCard.clickOnCompleteStepButton();

    this.server.create('submission', 'withStageCompletion', {
      repository: this.server.schema.repositories.find(1),
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 1),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.ok(coursePage.firstStageInstructionsCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[0].isExpanded, 'First step is collapsed');
    assert.ok(coursePage.firstStageInstructionsCard.steps[1].isComplete, 'Second step is complete');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[1].isExpanded, 'Second step is collapsed');
    assert.notOk(coursePage.firstStageInstructionsCard.steps[2].isExpanded, 'Third step is collapsed');
    assert.ok(coursePage.firstStageInstructionsCard.steps[2].isComplete, 'Third step is complete');

    assert.strictEqual(coursePage.desktopHeader.progressIndicatorText, 'You completed this stage today.', 'header says stage completed');
  });
});
