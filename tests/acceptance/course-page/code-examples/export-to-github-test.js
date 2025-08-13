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

  hooks.beforeEach(function () {
    testScenario(this.server);
    const currentUser = signIn(this.owner, this.server);

    const solutionAuthor = this.server.create('user', {
      avatarUrl: 'https://github.com/author.png',
      createdAt: new Date(),
      githubUsername: 'author',
      username: 'author',
    });

    const redis = this.server.schema.courses.findBy({ slug: 'redis' });
    const python = this.server.schema.languages.findBy({ slug: 'python' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.solution = createCommunityCourseStageSolution(this.server, redis, 2, python, solutionAuthor);
  });

  async function navigateToCodeExamples() {
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');
  }

  test('creates new export when none exists', async function (assert) {
    let exportCreateCalled = false;

    const solution = this.solution;
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
    const exportRecord = this.server.schema.communitySolutionExports.first();
    assert.ok(exportRecord, 'export should exist in database');
    assert.strictEqual(exportRecord.status, 'provisioned', 'export should have correct status');
    assert.strictEqual(exportRecord.githubRepositoryUrl, 'https://github.com/test-user/test-repo', 'export should have correct URL');
  });

  test('reuses existing unexpired export and redirects', async function (assert) {
    const existingExport = this.server.create('community-solution-export', {
      status: 'provisioned',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      githubRepositoryUrl: 'https://github.com/existing-repo/test',
      communitySolution: this.solution,
    });

    const exportsBefore = this.server.schema.communitySolutionExports.all().length;

    let exportCreateCalled = false;
    this.server.post('/community-solution-exports', function () {
      exportCreateCalled = true;

      return { data: {} };
    });

    await navigateToCodeExamples();
    await percySnapshot('Code Examples - View on GitHub button (with existing export)');

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();

    const exportsAfter = this.server.schema.communitySolutionExports.all().length;
    assert.strictEqual(exportsAfter, exportsBefore, 'should not create new export when reusing existing one');
    assert.notOk(exportCreateCalled, 'should not call create export API');

    const allExports = this.server.schema.communitySolutionExports.all();
    assert.strictEqual(allExports.length, 1, 'should have exactly one export');
    const firstExport = allExports.models[0];
    assert.ok(firstExport, 'should have an export');
    assert.strictEqual(firstExport.id, existingExport.id, 'should reuse the existing export');
  });

  test('creates new export when existing export is expired', async function (assert) {
    let exportCreateCalled = false;

    this.server.create('community-solution-export', {
      status: 'provisioned',
      expiresAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      githubRepositoryUrl: 'https://github.com/expired-repo/test',
      communitySolution: this.solution,
    });

    const solution = this.solution;
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
    const exportRecord = this.server.schema.communitySolutionExports.findBy({ githubRepositoryUrl: 'https://github.com/new-repo/test' });
    assert.ok(exportRecord, 'should create new export when existing is expired');
    assert.strictEqual(exportRecord.status, 'provisioned', 'export should have correct status');
  });

  test('shows direct GitHub link when solution is published', async function (assert) {
    this.solution.update({
      githubRepositoryName: 'author/redis-solution',
      githubRepositoryIsPrivate: false,
      commitSha: 'abc123',
    });

    const exportsBefore = this.server.schema.communitySolutionExports.all().length;

    this.server.post('/community-solution-exports', function () {
      return { data: {} };
    });

    await navigateToCodeExamples();
    await percySnapshot('Code Examples - Direct GitHub link (published solution)');

    assert.notOk(codeExamplesPage.solutionCards[0].hasViewOnGithubButton, 'should not show view button for published solutions');
    assert.ok(codeExamplesPage.solutionCards[0].hasDirectGithubLink, 'should show direct GitHub link');

    const exportsAfter = this.server.schema.communitySolutionExports.all().length;
    assert.strictEqual(exportsAfter, exportsBefore, 'should not create export when solution is published');
  });

  test('handles export creation failure gracefully', async function (assert) {
    this.server.post('/community-solution-exports', function () {
      return new Response(500, {}, { error: 'Export creation failed' });
    });

    await navigateToCodeExamples();

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();

    assert.ok(codeExamplesPage.solutionCards[0].hasViewOnGithubButton, 'view button should still exist after failure');
  });
});
