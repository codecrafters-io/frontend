import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import createCourseStageComment from 'codecrafters-frontend/mirage/utils/create-course-stage-comment';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';

module('Acceptance | course-page | view-code-examples', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

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
    const solution3 = createCommunityCourseStageSolution(this.server, redis, 2, go);

    solution3.update({
      commitSha: '1234567890',
      githubRepositoryName: 'sarupbanskota/redis',
      githubRepositoryIsPrivate: false,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    assert.strictEqual(coursePage.codeExamplesTab.solutionCards.length, 2, 'expected 2 Go solutions to be present'); // Go is picked by default

    // Trigger logic that runs on expand
    await coursePage.codeExamplesTab.solutionCards[1].clickOnExpandButton();
    await coursePage.codeExamplesTab.solutionCards[1].clickOnCollapseButton();

    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Python');

    assert.strictEqual(coursePage.codeExamplesTab.solutionCards.length, 1, 'expected 1 python solution to be present');

    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('C');

    assert.strictEqual(coursePage.codeExamplesTab.solutionCards.length, 0, 'expected no C solutions to be present');
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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    // Stage 2: (Completed, has solutions & comments)
    await coursePage.sidebar.clickOnStepListItem('Respond to PING').click();
    await animationsSettled();
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await percySnapshot('Community Solutions');

    assert.strictEqual(coursePage.codeExamplesTab.solutionCards.length, 1, 'Solutions are visible');
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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    assert.strictEqual(coursePage.codeExamplesTab.solutionCards.length, 2);
  });

  test('stage incomplete modal shows up when code examples are viewed before completing a stage', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    assert.ok(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is visible');
  });

  test('stage incomplete modal does not show up on stage two even if stage is not completed', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    assert.notOk(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is not visible');
  });

  test('stage incomplete model does not show up if stage is completed', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    await coursePage.sidebar.clickOnStepListItem('Respond to multiple PINGs');
    await animationsSettled();

    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    assert.notOk(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is not visible');
  });

  test('back to instructions button in stage incomplete modal redirects to instructions', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.stageIncompleteModal.clickOnInstructionsButton();

    assert.ok(coursePage.yourTaskCard.isVisible, 'user is redirected to instructions');
  });

  test('show code button in stage incomplete modal shows code examples', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.stageIncompleteModal.clickOnShowCodeButton();

    assert.notOk(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is not visible');
  });

  test('stage incomplete modal does not render if no solutions for language exist', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    assert.notOk(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is not visible');
  });

  test('stage incomplete modal does not show up again if show code button is clicked when user switches to a different language', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);
    createCommunityCourseStageSolution(this.server, redis, 3, go);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.stageIncompleteModal.clickOnShowCodeButton();

    await coursePage.codeExamplesTab.languageDropdown.toggle();
    await coursePage.codeExamplesTab.languageDropdown.clickOnLink('Go');

    assert.notOk(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is not visible');
  });

  test('stage incomplete modal shows up on a later stage even after being dismissed in a previous stage', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);
    createCommunityCourseStageSolution(this.server, redis, 3, go);
    createCommunityCourseStageSolution(this.server, redis, 4, python);
    createCommunityCourseStageSolution(this.server, redis, 4, go);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');
    await coursePage.codeExamplesTab.stageIncompleteModal.clickOnShowCodeButton();

    assert.notOk(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is not visible');

    await coursePage.sidebar.clickOnStepListItem('Handle concurrent clients');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    assert.ok(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is visible');
  });

  test('stage incomplete modal status should not change if a course stage is updated', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 3, python);
    createCommunityCourseStageSolution(this.server, redis, 3, go);
    createCommunityCourseStageSolution(this.server, redis, 4, python);
    createCommunityCourseStageSolution(this.server, redis, 4, go);

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

    this.server.create('submission', 'withStageCompletion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.yourTaskCard.clickOnActionButton('Code Examples');

    assert.ok(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is visible');

    this.server.schema.courseStages.findBy({ name: 'Respond to multiple PINGs' }).update({ marketingMarkdown: 'Updated marketing markdown' });

    assert.ok(coursePage.codeExamplesTab.stageIncompleteModal.isVisible, 'stage incomplete modal is visible');
  });
});
