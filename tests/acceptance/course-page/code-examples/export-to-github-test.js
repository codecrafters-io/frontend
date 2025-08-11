import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { settled } from '@ember/test-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';

module('Acceptance | course-page | code-examples | export-to-github', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  async function setupTestScenario(server) {
    testScenario(server);
    const currentUser = signIn(this.owner, server);

    const solutionAuthor = server.create('user', {
      avatarUrl: 'https://github.com/author.png',
      createdAt: new Date(),
      githubUsername: 'author',
      username: 'author',
    });

    const redis = server.schema.courses.findBy({ slug: 'redis' });
    const python = server.schema.languages.findBy({ slug: 'python' });

    server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    return {
      currentUser,
      solutionAuthor,
      redis,
      python,
      solution: createCommunityCourseStageSolution(server, redis, 2, python, solutionAuthor),
    };
  }

  async function navigateToCodeExamples() {
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');
  }

  test('creates new export when none exists', async function (assert) {
    const { solution } = await setupTestScenario.call(this, this.server);

    let exportCreateCalled = false;
    this.server.post('/community-solution-exports', function (schema) {
      exportCreateCalled = true;

      return schema.communitySolutionExports.create({
        status: 'provisioned',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        githubRepositoryUrl: 'https://github.com/test-user/test-repo',
        communitySolution: solution,
      });
    });

    await navigateToCodeExamples();
    await percySnapshot('Code Examples - View on GitHub button (unpublished solution)');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();

    assert.ok(exportCreateCalled, 'should create new export');
  });

  test('reuses existing unexpired export', async function (assert) {
    const { solution } = await setupTestScenario.call(this, this.server);

    this.server.create('community-solution-export', {
      status: 'provisioned',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      githubRepositoryUrl: 'https://github.com/existing-repo/test',
      communitySolution: solution,
    });

    let exportCreateCalled = false;
    this.server.post('/community-solution-exports', function () {
      exportCreateCalled = true;

      return { data: {} };
    });

    await navigateToCodeExamples();
    await percySnapshot('Code Examples - View on GitHub button (with existing export)');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();

    assert.notOk(exportCreateCalled, 'should reuse existing export');
  });

  test('creates new export when existing export is expired', async function (assert) {
    const { solution } = await setupTestScenario.call(this, this.server);

    this.server.create('community-solution-export', {
      status: 'provisioned',
      expiresAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
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

    await navigateToCodeExamples();
    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();

    assert.ok(exportCreateCalled, 'should create new export when existing is expired');
  });

  test('shows direct GitHub link when solution is published', async function (assert) {
    const { solution } = await setupTestScenario.call(this, this.server);

    solution.update({
      githubRepositoryName: 'author/redis-solution',
      githubRepositoryIsPrivate: false,
      commitSha: 'abc123',
    });

    let exportCreateCalled = false;
    this.server.post('/community-solution-exports', function () {
      exportCreateCalled = true;

      return { data: {} };
    });

    await navigateToCodeExamples();
    await percySnapshot('Code Examples - Direct GitHub link (published solution)');

    // Published solutions show a direct link, not a button
    assert.dom('[data-test-view-on-github-button]').doesNotExist('should not show view button for published solutions');
    assert.dom('a[href*="github.com/author/redis-solution"]').exists('should show direct GitHub link');
    assert.notOk(exportCreateCalled, 'should not create export when solution is published');
  });

  test('handles export creation failure gracefully', async function (assert) {
    await setupTestScenario.call(this, this.server);

    this.server.post('/community-solution-exports', function () {
      return new Response(500, {}, { error: 'Export creation failed' });
    });

    await navigateToCodeExamples();

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();

    assert.dom('[data-test-view-on-github-button]').exists('view button should still exist after failure');
  });
});
