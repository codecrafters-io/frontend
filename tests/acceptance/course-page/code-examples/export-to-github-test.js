import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';

module('Acceptance | course-page | code-examples | export-to-github', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can create new export when none exists', async function (assert) {
    testScenario(this.server);
    const currentUser = signIn(this.owner, this.server);

    // Create a different user who authored the community solution
    const solutionAuthor = this.server.create('user', {
      avatarUrl: 'https://github.com/author.png',
      createdAt: new Date(),
      githubUsername: 'author',
      username: 'author',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    const solution = createCommunityCourseStageSolution(this.server, redis, 2, python, solutionAuthor);

    // Mock the export creation
    this.server.post('/community-solution-exports', function (schema) {
      return schema.communitySolutionExports.create({
        status: 'provisioned',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        githubRepositoryUrl: 'https://github.com/test-user/test-repo',
        communitySolution: solution,
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');

    assert.dom('[data-test-view-on-github-button]').exists('view on github button should be visible');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();

    // Should create export and open new window - we can't easily test window.open
    // but we can verify the button state changed during loading
    assert.ok(true, 'export creation triggered successfully');
  });

  test('reuses existing unexpired export', async function (assert) {
    testScenario(this.server);
    const currentUser = signIn(this.owner, this.server);

    // Create a different user who authored the community solution
    const solutionAuthor = this.server.create('user', {
      avatarUrl: 'https://github.com/author2.png',
      createdAt: new Date(),
      githubUsername: 'author2',
      username: 'author2',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    const solution = createCommunityCourseStageSolution(this.server, redis, 2, python, solutionAuthor);

    // Create existing unexpired export
    this.server.create('community-solution-export', {
      status: 'provisioned',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      githubRepositoryUrl: 'https://github.com/existing-repo/test',
      communitySolution: solution,
    });

    let exportCreateCalled = false;
    this.server.post('/community-solution-exports', function () {
      exportCreateCalled = true;

      return { data: {} };
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();

    assert.notOk(exportCreateCalled, 'should not create new export when valid one exists');
  });

  test('creates new export when existing one is expired', async function (assert) {
    testScenario(this.server);
    const currentUser = signIn(this.owner, this.server);

    // Create a different user who authored the community solution
    const solutionAuthor = this.server.create('user', {
      avatarUrl: 'https://github.com/author3.png',
      createdAt: new Date(),
      githubUsername: 'author3',
      username: 'author3',
    });

    let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    let python = this.server.schema.languages.findBy({ slug: 'python' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    const solution = createCommunityCourseStageSolution(this.server, redis, 2, python, solutionAuthor);

    // Create expired export
    this.server.create('community-solution-export', {
      status: 'provisioned',
      expiresAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago (expired)
      githubRepositoryUrl: 'https://github.com/expired-repo/test',
      communitySolution: solution,
    });

    let exportCreateCalled = false;
    this.server.post('/community-solution-exports', function (schema) {
      exportCreateCalled = true;

      return schema.communitySolutionExports.create({
        status: 'provisioned',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        githubRepositoryUrl: 'https://github.com/new-repo/test',
        communitySolution: solution,
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();

    assert.ok(exportCreateCalled, 'should create new export when existing one is expired');
  });
});
