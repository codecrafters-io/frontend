import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-community-course-stage-solutions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

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
    // TODO: Add comments too?

    // Stage 3: Incomplete, no solutions in other languages, no comments
    createCommunityCourseStageSolution(this.server, redis, 3, python);

    // Stage 4: Incomplete, has solutions in other language, no comments
    createCommunityCourseStageSolution(this.server, redis, 4, python);
    createCommunityCourseStageSolution(this.server, redis, 4, go);

    // Incomplete, has solutions in other language, no comments
    // Stage 5: Create comments

    // Stage 6: Incomplete, has solutions in other language & has comments
    createCommunityCourseStageSolution(this.server, redis, 6, python);
    createCommunityCourseStageSolution(this.server, redis, 6, go);
    // Add comments too

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

    const communitySolutionsTab = coursePage.courseStageSolutionModal.communitySolutionsTab;

    const switchToSolutionsForStage = async function (stageNumber) {
      await coursePage.courseStageSolutionModal.clickOnCloseButton();
      await coursePage.collapsedItems[stageNumber - 1].click();
      await animationsSettled();
      await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    };

    const assertInstructions = function (expectedInstructions) {
      assert.strictEqual(communitySolutionsTab.blurredOverlay.instructionsText, expectedInstructions, 'instructions are present');
    };

    const assertButtons = function (expectedButtons) {
      assert.deepEqual(communitySolutionsTab.blurredOverlay.availableActionButtons, expectedButtons, 'buttons are present');
    };

    const clickButton = async function (buttonText) {
      await communitySolutionsTab.blurredOverlay.clickOnActionButton(buttonText);
    };

    // Stage 2: (Completed, has solutions & comments)
    await coursePage.activeCourseStageItem.clickOnActionButton('Solutions');
    assert.notOk(communitySolutionsTab.blurredOverlay.isVisible, 'Blurred overlay is not visible');
    assert.strictEqual(communitySolutionsTab.solutionCards.length, 1, 'Solutions are visible');

    // Stage 3 (Incomplete, no solutions in other languages, no comments)
    await switchToSolutionsForStage(3);

    assertInstructions("Looks like you haven't completed this stage yet. Sure you want to see the solution?");
    assertButtons(['Reveal solutions']);
    await clickButton('Reveal solutions');

    assert.notOk(communitySolutionsTab.blurredOverlay.isVisible);
    assert.strictEqual(communitySolutionsTab.solutionCards.length, 1);

    // Stage 4: Incomplete, has solutions in other language, no comments
    await switchToSolutionsForStage(4);

    assertInstructions("Looks like you haven't completed this stage in Python yet. Maybe peek at solutions in other languages first?");
    assertButtons(['Good idea', 'Reveal Python solutions']);
    await clickButton('Good idea');

    await this.pauseTest();

    // Stage 5: Create comments
    // Stage 6: Incomplete, has solutions in other language & has comments

    //
    // await coursePage.courseStageSolutionModal.languageDropdown.toggle();
    // await coursePage.courseStageSolutionModal.languageDropdown.clickOnLink('C');
    //
    // assert.strictEqual(coursePage.courseStageSolutionModal.communitySolutionsTab.solutionCards.length, 0);
  });
});
