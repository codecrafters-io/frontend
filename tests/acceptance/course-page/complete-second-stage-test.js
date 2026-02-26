import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsStaff, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-course-stage-solution';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';

module('Acceptance | course-page | complete-second-stage', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete second stage when hints & solution are present', async function (assert) {
    testScenario(this.server, ['dummy']);
    signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

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
      courseStage: course.stages.models.find((stage) => stage.position === 2),
      clientType: 'system',
    });

    const solution = createCourseStageSolution(this.server, course, 2, python);

    solution.update({
      hintsJson: [
        {
          body_markdown: 'test',
          title_markdown: 'How do I XYZ?',
        },
        {
          body_markdown: 'test',
          title_markdown: 'How do I ABC?',
        },
      ],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.notOk(coursePage.secondStageYourTaskCard.steps[0].isComplete, 'First step is not complete');
    assert.notOk(coursePage.secondStageYourTaskCard.steps[1].isComplete, 'Second step is not complete');

    // Asserts that we don't show the "To run tests again..." message for a system submission
    assert.contains(coursePage.secondStageYourTaskCard.steps[1].text, 'To run tests, make changes to your code');

    // Initially, no hints should be expanded
    assert.notOk(coursePage.secondStageYourTaskCard.hints[0].hasContent, 'First hint is not expanded initially');
    assert.notOk(coursePage.secondStageYourTaskCard.hints[1].hasContent, 'Second hint is not expanded initially');

    // Click on first hint
    await coursePage.secondStageYourTaskCard.hints[0].clickOnHeader();
    await animationsSettled();

    assert.ok(coursePage.secondStageYourTaskCard.hints[0].hasContent, 'First hint is expanded after clicking');
    assert.notOk(coursePage.secondStageYourTaskCard.hints[1].hasContent, 'Second hint is still not expanded');

    // Click on second hint
    await coursePage.secondStageYourTaskCard.hints[1].clickOnHeader();
    await animationsSettled();

    assert.notOk(coursePage.secondStageYourTaskCard.hints[0].hasContent, 'First hint is collapsed after clicking second hint');
    assert.ok(coursePage.secondStageYourTaskCard.hints[1].hasContent, 'Second hint is expanded after clicking');

    // Click on first hint again
    await coursePage.secondStageYourTaskCard.hints[0].clickOnHeader();
    await animationsSettled();

    assert.ok(coursePage.secondStageYourTaskCard.hints[0].hasContent, 'First hint is expanded again');
    assert.notOk(coursePage.secondStageYourTaskCard.hints[1].hasContent, 'Second hint is collapsed');

    // Click on the same hint again to collapse it
    await coursePage.secondStageYourTaskCard.hints[0].clickOnHeader();
    await animationsSettled();

    assert.notOk(coursePage.secondStageYourTaskCard.hints[0].hasContent, 'First hint is collapsed when clicking the expanded hint');
    assert.notOk(coursePage.secondStageYourTaskCard.hints[1].hasContent, 'Second hint remains collapsed');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: course.stages.models.find((stage) => stage.position === 2),
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.ok(coursePage.secondStageYourTaskCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageYourTaskCard.steps[1].isComplete, 'Second step is complete');

    assert.ok(coursePage.testsPassedModal.isVisible, 'Tests passed modal is visible');
    assert.deepEqual(
      coursePage.testsPassedModal.actionButtons.map((actionButton) => actionButton.title),
      ['Refactor code (optional)', 'Mark stage as complete'],
      'Tests passed modal actions are ordered and labeled correctly',
    );
    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');

    assert.notOk(coursePage.testsPassedModal.isVisible, 'Tests passed modal disappears');
    assert.ok(coursePage.currentStepCompleteModal.isVisible, 'Current step complete modal is visible');
  });

  test('can complete second stage when solution & hints are not present', async function (assert) {
    testScenario(this.server, ['dummy']);
    signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

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
      courseStage: course.stages.models.find((stage) => stage.position === 2),
      clientType: 'system',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.notOk(coursePage.secondStageYourTaskCard.steps[0].isComplete, 'First step is not complete');
    assert.notOk(coursePage.secondStageYourTaskCard.steps[1].isComplete, 'Second step is not complete');

    // Asserts that we don't show the "To run tests again..." message for a system submission
    assert.contains(coursePage.secondStageYourTaskCard.steps[1].text, 'To run tests, make changes to your code');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: course.stages.models.find((stage) => stage.position === 2),
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.ok(coursePage.secondStageYourTaskCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageYourTaskCard.steps[1].isComplete, 'Second step is complete');

    assert.ok(coursePage.testsPassedModal.isVisible, 'Tests passed modal is visible');
    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');

    assert.notOk(coursePage.testsPassedModal.isVisible, 'Tests passed modal disappears');
    assert.ok(coursePage.currentStepCompleteModal.isVisible, 'Current step complete modal is visible');
  });

  test('cannot complete second stage if tests passed via CLI', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

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
    await courseOverviewPage.clickOnStartCourse();

    this.server.create('submission', 'withSuccessStatus', {
      clientType: 'cli',
      repository: repository,
      courseStage: course.stages.models.find((stage) => stage.position === 2),
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.ok(coursePage.secondStageYourTaskCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageYourTaskCard.steps[1].isComplete, 'Second step is complete');

    assert.ok(coursePage.testsPassedModal.isVisible, 'Tests passed modal is visible');
    assert.strictEqual(coursePage.testsPassedModal.title, 'Tests passed!', 'Tests passed modal title is correct');

    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');
    assert.strictEqual(coursePage.testsPassedModal.title, 'Submit code', 'Tests passed modal title is correct');

    this.server.create('submission', 'withSuccessStatus', {
      clientType: 'git',
      repository: repository,
      courseStage: course.stages.models.find((stage) => stage.position === 2),
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    assert.ok(coursePage.testsPassedModal.isVisible, 'Tests passed modal is visible');
    assert.strictEqual(coursePage.testsPassedModal.title, 'Submit code', 'Tests passed modal title is correct');

    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');

    assert.notOk(coursePage.testsPassedModal.isVisible, 'Tests passed modal is not visible');
    assert.ok(coursePage.currentStepCompleteModal.isVisible, 'Current step complete modal is visible');
  });

  test('passing stage 2 should show valid clickable stage 2 completion discount', async function (assert) {
    testScenario(this.server);
    // The discount timer is currently behind a feature flag
    const user = signInAsStaff(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: user,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[0],
    });

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    this.server.schema.promotionalDiscounts.create({
      user: user,
      type: 'stage_2_completion',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000 - 30 * 60 * 1000), // Subtract 30 minutes from the expiration time
    });

    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');

    assert.ok(coursePage.header.discountTimerBadge.isVisible, 'Badge is visible');
    assert.strictEqual(coursePage.header.discountTimerBadge.timeLeftText, '23 hours left', 'should show correct time remaining');

    await coursePage.header.discountTimerBadge.click();
    assert.strictEqual(currentURL(), '/pay');
  });
});
