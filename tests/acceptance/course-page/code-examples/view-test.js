import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | code-examples | view', function (hooks) {
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

    await coursePage.clickOnHeaderTabLink('Code Examples');
    assert.notOk(coursePage.upgradePrompt.isVisible, 'code examples list should not include upgrade prompt for early stages');
    assert.strictEqual(codeExamplesPage.solutionCards.length, 2, 'expected 2 Go solutions to be present'); // Go is picked by default

    // Trigger logic that runs on expand
    await codeExamplesPage.solutionCards[1].clickOnExpandButton();

    await codeExamplesPage.languageDropdown.toggle();

    assert.true(codeExamplesPage.languageDropdown.shadowOverlay.isPresent, 'shadow overlay should be present');

    await codeExamplesPage.languageDropdown.scrollToPercentage(0);
    assert.strictEqual(codeExamplesPage.languageDropdown.shadowOverlay.opacity, 1, 'shadow overlay has opacity 1 when scroll is at the top');

    await codeExamplesPage.languageDropdown.scrollToPercentage(98);
    assert.strictEqual(codeExamplesPage.languageDropdown.shadowOverlay.opacity, 0.2, 'shadow overlay has opacity 0.2 when scroll is at the 98%');

    await codeExamplesPage.languageDropdown.scrollToPercentage(100);
    assert.strictEqual(codeExamplesPage.languageDropdown.shadowOverlay.opacity, 0, 'shadow overlay has opacity 0 when scroll is at the bottom');

    await codeExamplesPage.languageDropdown.scrollToPercentage(0);
    assert.strictEqual(codeExamplesPage.languageDropdown.shadowOverlay.opacity, 1, 'shadow overlay has opacity 1 when scroll is back at the top');

    await codeExamplesPage.languageDropdown.clickOnLink('Python');

    assert.strictEqual(codeExamplesPage.solutionCards.length, 1, 'expected 1 python solution to be present');

    await codeExamplesPage.languageDropdown.toggle();
    await codeExamplesPage.languageDropdown.clickOnLink('C');

    assert.strictEqual(codeExamplesPage.solutionCards.length, 0, 'expected no C solutions to be present');
  });

  test('can view solutions after starting course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    // Stage 2: Completed, has solutions in other languages
    createCommunityCourseStageSolution(this.server, redis, 2, python);
    createCommunityCourseStageSolution(this.server, redis, 2, go);

    // Stage 3: Incomplete, no solutions in other languages
    createCommunityCourseStageSolution(this.server, redis, 3, python);

    // Stage 4: Incomplete, has solutions in other language
    createCommunityCourseStageSolution(this.server, redis, 4, python);
    createCommunityCourseStageSolution(this.server, redis, 4, go);

    // Stage 5: Incomplete, no solutions in other language
    createCommunityCourseStageSolution(this.server, redis, 5, python);

    // Stage 6: Incomplete, has solutions in other language
    createCommunityCourseStageSolution(this.server, redis, 6, python);
    createCommunityCourseStageSolution(this.server, redis, 6, go);

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
      completedAt: new Date(new Date().getTime() - 5 * 86400000), // 5 days ago
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    // Stage 2: (Completed, has solutions)
    await coursePage.sidebar.clickOnStepListItem('Respond to PING').click();
    await animationsSettled();
    await coursePage.clickOnHeaderTabLink('Code Examples');
    await percySnapshot('Community Solutions');

    assert.strictEqual(codeExamplesPage.solutionCards.length, 1, 'Solutions are visible');
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

    await coursePage.clickOnHeaderTabLink('Code Examples');
    assert.strictEqual(codeExamplesPage.solutionCards.length, 2);
  });

  test('can view unchanged files in code examples', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    createCommunityCourseStageSolution(this.server, redis, 2, python);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');

    await codeExamplesPage.solutionCards[0].toggleMoreDropdown();
    await codeExamplesPage.solutionCards[0].moreDropdown.clickOnLink('View full diff');

    assert.strictEqual(codeExamplesPage.solutionCards[0].changedFileCards.length, 2, 'shows 2 changed files');
    assert.strictEqual(codeExamplesPage.solutionCards[0].unchangedFiles.length, 2, 'shows 2 unchanged files');

    await codeExamplesPage.solutionCards[0].unchangedFiles[0].header.click();

    assert.true(codeExamplesPage.solutionCards[0].unchangedFiles[0].isPresent, 'FileContentsCard is present');
    assert.true(codeExamplesPage.solutionCards[0].unchangedFiles[0].codeMirror.hasRendered, 'CodeMirror has rendered');
    assert.strictEqual(
      codeExamplesPage.solutionCards[0].unchangedFiles[0].codeMirror.text,
      'Unchanged file content',
      'file content is rendered correctly',
    );
  });

  test('upgrade prompt is present when viewing code examples for higher stages', async function (assert) {
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

    // 5 is the threshold
    createCommunityCourseStageSolution(this.server, redis, 5, go);
    createCommunityCourseStageSolution(this.server, redis, 5, go);
    createCommunityCourseStageSolution(this.server, redis, 5, go);
    createCommunityCourseStageSolution(this.server, redis, 5, go);
    createCommunityCourseStageSolution(this.server, redis, 5, go);
    createCommunityCourseStageSolution(this.server, redis, 5, go);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Implement the ECHO command');
    await coursePage.clickOnHeaderTabLink('Code Examples');

    await codeExamplesPage.languageDropdown.toggle();
    await codeExamplesPage.languageDropdown.clickOnLink('Go');
    assert.strictEqual(codeExamplesPage.solutionCards.length, 6, 'expected 6 Go solutions to be present');
    assert.ok(coursePage.upgradePrompt.isVisible, 'code examples list should include upgrade prompt');

    await percySnapshot('Community Solutions - Upgrade prompt');
  });
});
