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

    assert.ok(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is complete');
    assert.notOk(coursePage.secondStageInstructionsCard.steps[1].isComplete, 'Second step is not complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[1].isExpanded, 'Second step is expanded');

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

    assert.ok(coursePage.secondStageInstructionsCard.steps[0].isComplete, 'First step is complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[1].isComplete, 'Second step is complete');
    assert.ok(coursePage.secondStageInstructionsCard.steps[2].isComplete, 'Third step is complete');

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

  test('should show a screencasts link if there are screencasts available', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-screencast', {
      language: python,
      user: currentUser,
      courseStage: redis.stages.models.sortBy('position')[1],
      authorName: null,
      canonicalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
      publishedAt: '2023-06-30T19:11:29.254Z',
      description: 'Hey there! blah blah',
      durationInSeconds: 808.5666666666664,
      embedHtml:
        '\u003cdiv\u003e\u003cdiv style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"\u003e\u003ciframe src="//cdn.iframe.ly/api/iframe?click_to_play=1\u0026url=https%3A%2F%2Fwww.loom.com%2Fshare%2F1dd746eaaba34bc2b5459ad929934c08%3Fsid%3Da5f6ec60-5ae4-4e9c-9566-33235d483431\u0026key=3aafd05f43d700b9a7382620ac7cdfa3" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen scrolling="no" allow="encrypted-media *;"\u003e\u003c/iframe\u003e\u003c/div\u003e\u003c/div\u003e',
      sourceIconUrl: 'https://cdn.loom.com/assets/favicons-loom/android-chrome-192x192.png',
      originalUrl: 'https://www.loom.com/share/1dd746eaaba34bc2b5459ad929934c08?sid=a5f6ec60-5ae4-4e9c-9566-33235d483431',
      thumbnailUrl: 'https://cdn.loom.com/sessions/thumbnails/1dd746eaaba34bc2b5459ad929934c08-00001.gif',
      title: 'Testing Course Completion Functionality',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.secondStageInstructionsCard.steps[0].click();
    assert.ok(coursePage.secondStageInstructionsCard.hasScreencastsLink, 'screencasts link should be present');
  });
});
