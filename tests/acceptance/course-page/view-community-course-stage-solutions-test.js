import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import createCourseStageComment from 'codecrafters-frontend/mirage/utils/create-course-stage-comment';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { settled, scrollTo } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-community-course-stage-solutions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  // Scroll tests don't work with the container docked to the side
  // TODO: Extract this into a common setupApplicationTest function
  hooks.beforeEach(() => {
    const testContainer = document.getElementById('ember-testing-container');
    testContainer.classList.add('ember-testing-container-full-screen');
  });

  // Scroll tests don't work with the container docked to the side
  // TODO: Extract this into a common setupApplicationTest function
  hooks.afterEach(() => {
    const testContainer = document.getElementById('ember-testing-container');
    testContainer.classList.remove('ember-testing-container-full-screen');
  });

  test('can view solutions before starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 2, go);
    createCommunityCourseStageSolution(this.server, redis, 2, go);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 2);

    await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('Python');

    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 1);

    await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('C');

    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 0);
  });

  // eslint-disable-next-line qunit/require-expect
  test('can view solutions after starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    // Stage 2: Completed, has solutions in other languages, and comments
    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 2, go);
    createCourseStageComment(this.server, redis, 2);

    // Stage 3: Incomplete, no solutions in other languages, no comments
    createCommunityCourseStageSolution(this.server, redis, 3, python);

    // Stage 4: Incomplete, has solutions in other language, no comments
    createCommunityCourseStageSolution(this.server, redis, 4, python);
    createCommunityCourseStageSolution(this.server, redis, 4, go);

    // Stage 5: Incomplete, no solutions in other language, has comments
    createCommunityCourseStageSolution(this.server, redis, 5, python);
    createCourseStageComment(this.server, redis, 5);

    // Stage 6: Incomplete, has solutions in other language & has comments
    createCommunityCourseStageSolution(this.server, redis, 6, python);
    createCommunityCourseStageSolution(this.server, redis, 6, go);
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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    const revealSolutionOverlay = coursePage.courseStageSolutionModal.revealSolutionOverlay;

    const switchToSolutionsForStage = async function (stageNumber) {
      await coursePage.courseStageSolutionModal.clickOnCloseButton();
      await coursePage.collapsedItems[stageNumber - 1].click();
      await animationsSettled();
      await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    };

    const assertHeading = function (expectedText) {
      assert.strictEqual(revealSolutionOverlay.headingText, expectedText, 'heading is present');
    };

    const assertInstructions = function (expectedInstructions) {
      assert.strictEqual(revealSolutionOverlay.instructionsText, expectedInstructions, 'instructions are present');
    };

    const assertButtons = function (expectedButtons) {
      assert.deepEqual(revealSolutionOverlay.availableActionButtons, expectedButtons, 'buttons are present');
    };

    const clickButton = async function (buttonText) {
      await revealSolutionOverlay.clickOnActionButton(buttonText);
    };

    // Stage 2: (Completed, has solutions & comments)
    await coursePage.collapsedItems[2].click();
    await animationsSettled();
    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    await percySnapshot('Community Solutions');

    assert.notOk(revealSolutionOverlay.isVisible, 'Blurred overlay is not visible');
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 1, 'Solutions are visible');

    // Stage 3 (Incomplete, no solutions in other languages, no comments)
    await switchToSolutionsForStage(3);
    await percySnapshot('Community Solutions Overlay | No other langs, no comments');

    assertHeading('Taking a peek?');
    assertInstructions("Looks like you haven't completed this stage yet. Just a heads up, this tab will expose solutions.");
    assertButtons(['Just taking a peek']);
    await clickButton('Just taking a peek');

    assert.notOk(revealSolutionOverlay.isVisible);
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 1, 'Solutions are visible');

    // Stage 4: Incomplete, has solutions in other language, no comments
    await switchToSolutionsForStage(4);
    await percySnapshot('Community Solutions Overlay | Has other langs, no comments');

    assertInstructions(
      "Looks like you haven't completed this stage in Python yet. In case you wanted a hint, you can also check out solutions in other languages. Could inspire you."
    );
    assertButtons(['Good idea', 'Reveal Python solutions']);

    assert.notOk(coursePage.courseStageSolutionModal.languageDropdown.isVisible, 'Language dropdown is not visible');
    await clickButton('Good idea');
    assert.ok(coursePage.courseStageSolutionModal.languageDropdown.isVisible, 'clicking button should reveal language dropdown');

    // Stage 5: Create comments
    await switchToSolutionsForStage(5);
    await percySnapshot('Community Solutions Overlay | No other langs, has comments');

    assertInstructions("Looks like you haven't completed this stage yet. In case you wanted a hint, you can also peek at the comments.");
    assertButtons(['View hints', 'Reveal solutions']);
    await clickButton('View hints');
    assert.strictEqual(coursePage.courseStageSolutionModal.activeHeaderTabLinkText, 'Hints', 'active header tab link should be comments');

    // Stage 6: Incomplete, has solutions in other language & has comments
    await switchToSolutionsForStage(6);
    await percySnapshot('Community Solutions Overlay | Has other langs & comments');

    assertInstructions(
      "Looks like you haven't completed this stage in Python yet. In case you wanted a hint, you can also peek at the comments, or check out solutions in other languages."
    );
    assertButtons(['View hints', 'Another language', 'Reveal Python solutions']);
  });

  test('can view team-restricted solutions', async function (assert) {
    testScenario(this.server);

    const currentUser = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const teamMember = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    const otherUser = this.server.create('user', {
      avatarUrl: 'https://github.com/rohitpaulk.png',
      createdAt: new Date(),
      githubUsername: 'rohitpaulk',
      username: 'rohitpaulk',
    });

    signIn(this.owner, this.server, currentUser);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    let teamMemberSolution = createCommunityCourseStageSolution(this.server, redis, 2, go);
    teamMemberSolution.update({ user: teamMember, isRestrictedToTeam: true });
    let otherUserSolution = createCommunityCourseStageSolution(this.server, redis, 2, go);
    otherUserSolution.update({ user: otherUser });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 2);
  });

  test('paginates if more than three solutions', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });

    for (let i = 1; i <= 7; i++) {
      createCommunityCourseStageSolution(this.server, redis, 2, go);
    }

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 3);

    await scrollTo('[data-test-course-stage-solution-modal]', 0, 99999);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await settled();
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 5);

    await scrollTo('[data-test-course-stage-solution-modal]', 0, 99999);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await settled();
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 7);

    await scrollTo('[data-test-course-stage-solution-modal]', 0, 99999);
    await new Promise((resolve) => setTimeout(resolve, 200));
    await settled();
    assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 7); // No more to load
  });
});
