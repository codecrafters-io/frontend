import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import createCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-course-stage-solution';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCourseStageComment from 'codecrafters-frontend/mirage/utils/create-course-stage-comment';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscribedTeamMember, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | course-page | view-course-stage-solutions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can switch between solution diffs & explanations + switch languages', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Code Examples', 'active header tab link should be solutions');

    await coursePage.courseStageSolutionModal.clickOnHeaderTabLink('Verified Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Verified Solution', 'active tab should be Verified Solution');

    await percySnapshot('Stage Solution Modal - Verified Solution');

    await coursePage.courseStageSolutionModal.clickOnNextStageButton();
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs', 'title should be respond to multiple pings');

    await coursePage.courseStageSolutionModal.clickOnPreviousStageButton();
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to multiple pings');
  });

  test('can view solutions before starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING', 'title should be respond to ping');
    await coursePage.courseStageSolutionModal.clickOnCloseButton();

    await coursePage.clickOnCollapsedItem('Bind to a port');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #1: Bind to a port');
    await coursePage.courseStageSolutionModal.clickOnCloseButton();

    // Test whether this works with a course that doesn't have solutions
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own SQLite');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Print table names');
    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Print table names', 'title should be respond to ping');
    await coursePage.courseStageSolutionModal.clickOnCloseButton();
  });

  // eslint-disable-next-line qunit/require-expect
  test('can view solutions after starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    this.server.schema.courseStageSolutions.all().models.map((courseStageSolution) => courseStageSolution.destroy());

    // Stage 2: Completed, has solutions in other languages, and comments
    createCourseStageSolution(this.server, redis, 2, python);
    createCourseStageSolution(this.server, redis, 2, go);
    createCourseStageComment(this.server, redis, 2);

    // Stage 3: Incomplete, no solutions in other languages, no comments
    createCourseStageSolution(this.server, redis, 3, python);

    // Stage 4: Incomplete, has solutions in other language, no comments
    createCourseStageSolution(this.server, redis, 4, python);
    createCourseStageSolution(this.server, redis, 4, go);

    // Stage 5: Incomplete, no solutions in other language, has comments
    createCourseStageSolution(this.server, redis, 5, python);
    createCourseStageComment(this.server, redis, 5);

    // Stage 6: Incomplete, has solutions in other language & has comments
    createCourseStageSolution(this.server, redis, 6, python);
    createCourseStageSolution(this.server, redis, 6, go);
    createCourseStageComment(this.server, redis, 6);

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
      completedAt: new Date(new Date().getTime() - 5 * 86400000), // 5 days ago
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    const revealSolutionOverlay = coursePage.courseStageSolutionModal.revealSolutionOverlay;

    const switchToSolutionsForStage = async (stageNumber) => {
      await coursePage.courseStageSolutionModal.clickOnCloseButton();
      await coursePage.collapsedItems[stageNumber - 1].click();
      await animationsSettled();
      await coursePage.activeCourseStageItem.clickOnActionButton('Code Examples');
      await coursePage.courseStageSolutionModal.clickOnHeaderTabLink('Verified Solution');
    };

    // const assertHeading = function (expectedText) {
    //   assert.strictEqual(revealSolutionOverlay.headingText, expectedText, 'heading is present');
    // };

    // const assertInstructions = function (expectedInstructions) {
    //   assert.strictEqual(revealSolutionOverlay.instructionsText, expectedInstructions, 'instructions are present');
    // };

    // const assertButtons = function (expectedButtons) {
    //   assert.deepEqual(revealSolutionOverlay.availableActionButtons, expectedButtons, 'buttons are present');
    // };

    // const clickButton = async function (buttonText) {
    //   await revealSolutionOverlay.clickOnActionButton(buttonText);
    // };

    // Stage 2: (Completed, has solutions & comments)
    await coursePage.collapsedItems[2].click();
    await animationsSettled();
    await coursePage.activeCourseStageItem.clickOnActionButton('Code Examples');

    assert.notOk(revealSolutionOverlay.isVisible, 'Blurred overlay is not visible');

    // Stage 3 (Incomplete, no solutions in other languages, no comments)
    await switchToSolutionsForStage(3);
    assert.notOk(revealSolutionOverlay.isVisible, 'Blurred overlay is not visible');

    // We don't have the overlay anymore
    // await percySnapshot('Verified Solutions Overlay | No other langs, no comments');

    // assertHeading('Taking a peek?');
    // assertInstructions("Looks like you haven't completed this stage yet. Just a heads up, this tab will expose solutions.");
    // assertButtons(['Just taking a peek']);
    // await clickButton('Just taking a peek');

    // assert.notOk(revealSolutionOverlay.isVisible);

    // // Stage 4: Incomplete, has solutions in other language, no comments
    // await switchToSolutionsForStage(4);
    // await percySnapshot('Verified Solutions Overlay | Has other langs, no comments');

    // assertInstructions(
    //   "Looks like you haven't completed this stage in Python yet. In case you wanted a hint, you can also check out solutions in other languages. Could inspire you."
    // );
    // assertButtons(['Good idea', 'Reveal Python solution']);

    // assert.notOk(coursePage.courseStageSolutionModal.languageDropdown.isVisible, 'Language dropdown is not visible');
    // await clickButton('Good idea');
    // assert.ok(coursePage.courseStageSolutionModal.languageDropdown.isVisible, 'clicking button should reveal language dropdown');

    // // Stage 5: Create comments
    // await switchToSolutionsForStage(5);
    // await percySnapshot('Verified Solutions Overlay | No other langs, has comments');

    // assertInstructions("Looks like you haven't completed this stage yet. In case you wanted a hint, you can also peek at the comments.");
    // assertButtons(['View hints', 'Reveal solution']);
    // await clickButton('View hints');
    // assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Hints', 'active header tab link should be comments');

    // // Stage 6: Incomplete, has solutions in other language & has comments
    // await switchToSolutionsForStage(6);
    // await percySnapshot('Verified Solutions Overlay | Has other langs & comments');

    // assertInstructions(
    //   "Looks like you haven't completed this stage in Python yet. In case you wanted a hint, you can also peek at the comments, or check out solutions in other languages."
    // );
    // assertButtons(['View hints', 'Another language', 'Reveal Python solution']);
  });

  test('can view solutions for previous stages after completing them', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
      completedAt: new Date(new Date().getTime() - 5 * 86400000), // 5 days ago
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      completedAt: new Date(new Date().getTime() - (1 + 86400000)), // yesterday
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[3],
      completedAt: new Date(new Date().getTime() - 10000), // today
    });

    this.server.create('course-stage-feedback-submission', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[3],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(coursePage.activeCourseStageItem.title, 'Implement the ECHO command');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #2: Respond to PING');

    await coursePage.courseStageSolutionModal.clickOnCloseButton();
    assert.notOk(coursePage.courseStageSolutionModal.isOpen, 'modal should be closed');

    await coursePage.clickOnCollapsedItem('Respond to multiple PINGs');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs');

    await coursePage.courseStageSolutionModal.clickOnCloseButton();
    assert.notOk(coursePage.courseStageSolutionModal.isOpen, 'modal should be closed');
  });

  test('viewing solution should not lead to /pay if user is a subscriber', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      name: 'Go',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.collapsedItems[3].click(); // The previous completed stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs');

    assert.strictEqual(currentURL(), '/courses/redis', 'route should be course route');

    await coursePage.collapsedItems[4].click(); // The next pending stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should not be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #5: Implement the ECHO command');
  });

  test('viewing solution should not lead to /pay if user team has a subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscribedTeamMember(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      name: 'Go',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[2],
      status: 'closed',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.collapsedItems[3].click(); // The previous completed stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #3: Respond to multiple PINGs');

    assert.strictEqual(currentURL(), '/courses/redis', 'route should be course route');

    await coursePage.collapsedItems[4].click(); // The next pending stage
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solution');
    assert.ok(coursePage.courseStageSolutionModal.isOpen, 'modal should not be open');
    assert.strictEqual(coursePage.courseStageSolutionModal.title, 'Stage #5: Implement the ECHO command');
  });
});
