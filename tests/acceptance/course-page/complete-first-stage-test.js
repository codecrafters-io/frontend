import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | complete-first-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete first stage', async function (assert) {
    testScenario(this.server);
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
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.firstStageYourTaskCard.scrollIntoView();

    assert.notOk(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.firstStageYourTaskCard.steps[0].isExpanded, 'First step is expanded');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[1].isComplete, 'Second step is not complete');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[1].isExpanded, 'Second step is not expanded');

    await coursePage.firstStageYourTaskCard.steps[0].click();

    assert.notOk(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is not complete');
    assert.ok(coursePage.firstStageYourTaskCard.steps[0].isExpanded, 'First step is expanded');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[1].isComplete, 'Second step is not complete');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[1].isExpanded, 'Second step is not expanded');

    await coursePage.firstStageYourTaskCard.clickOnCompleteStepButton();

    assert.ok(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[0].isExpanded, 'First step is collapsed');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[1].isComplete, 'Second step is not complete');
    assert.ok(coursePage.firstStageYourTaskCard.steps[1].isExpanded, 'Second step is expanded');

    this.server.create('submission', 'withSuccessStatus', {
      repository: this.server.schema.repositories.find(1),
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 1),
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await finishRender();

    assert.ok(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[0].isExpanded, 'First step is collapsed');
    assert.ok(coursePage.firstStageYourTaskCard.steps[1].isComplete, 'Second step is complete');
    assert.notOk(coursePage.firstStageYourTaskCard.steps[1].isExpanded, 'Second step is collapsed');

    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');
    assert.ok(coursePage.currentStepCompleteModal.isVisible, 'Current step complete modal is visible');
    assert.strictEqual(coursePage.header.stepName, 'The first stage', 'header shows current step');

    await coursePage.currentStepCompleteModal.clickOnNextOrActiveStepButton();
    assert.strictEqual(coursePage.header.stepName, 'The second stage', 'header shows next step');
  });

  test('retains state when navigating to other course page areas', async function (assert) {
    testScenario(this.server);
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
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.firstStageYourTaskCard.scrollIntoView();
    await coursePage.firstStageYourTaskCard.steps[0].click();
    await coursePage.firstStageYourTaskCard.clickOnCompleteStepButton();

    assert.ok(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is complete');

    await coursePage.sidebar.clickOnStepListItem('Repository Setup');
    await coursePage.sidebar.clickOnStepListItem('The first stage');

    // State is retained even if a user navigates to other areas of the course page
    assert.ok(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is complete');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Try a different language');
    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();
    await coursePage.sidebar.clickOnStepListItem('The first stage');

    // State is wiped if a user switches repositories
    assert.notOk(coursePage.firstStageYourTaskCard.steps[0].isComplete, 'First step is complete');
  });
});
