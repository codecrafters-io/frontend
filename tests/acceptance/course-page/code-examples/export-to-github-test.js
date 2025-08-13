import { module, test } from 'qunit';
import { settled, waitUntil } from '@ember/test-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import percySnapshot from '@percy/ember';
import window from 'ember-window-mock';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | code-examples | export-to-github', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

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

  test('shows view on github button for unpublished solutions', async function (assert) {
    await navigateToCodeExamples();
    await percySnapshot('Code Examples - View on GitHub button (unpublished solution)');

    assert.ok(codeExamplesPage.solutionCards[0].hasViewOnGithubButton, 'should show view on github button');
    assert.notOk(codeExamplesPage.solutionCards[0].hasDirectGithubLink, 'should not show direct github link');
  });

  test('redirects to github works when unexpired export exists', async function (assert) {
    this.server.create('community-solution-export', {
      communitySolution: this.solution,
    });

    await navigateToCodeExamples();

    window.open = (url, target, features) => {
      assert.strictEqual(url, 'https://github.com/test-user/test-repo/blob/main/server.rb', 'should open correct github url');
      assert.strictEqual(target, '_blank', 'should open in new tab');
      assert.strictEqual(features, 'noopener,noreferrer', 'should have correct features');
    };

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
  });

  test('shows loading state when creating new export', async function (assert) {
    this.server.timing = 100;

    await navigateToCodeExamples();

    codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();

    await waitUntil(() => {
      const fileCard = codeExamplesPage.solutionCards[0].highlightedFileCards[0];

      return fileCard.viewOnGithubButtonText.includes('Loading');
    });

    const fileCard = codeExamplesPage.solutionCards[0].highlightedFileCards[0];
    assert.ok(fileCard.viewOnGithubButtonText.includes('Loading'), 'should show loading text');
    assert.ok(fileCard.viewOnGithubButtonIsDisabled, 'should be disabled during loading');

    await settled();

    assert.notOk(fileCard.viewOnGithubButtonText.includes('Loading'), 'should not show loading text after completion');
    assert.notOk(fileCard.viewOnGithubButtonIsDisabled, 'should not be disabled after completion');
    assert.ok(fileCard.viewOnGithubButtonText.includes('View on GitHub'), 'should show view on github text');
  });

  test('shows direct GitHub link when solution is published', async function (assert) {
    this.solution.update({
      githubRepositoryName: 'author/redis-solution',
      githubRepositoryIsPrivate: false,
      commitSha: 'abc123',
    });

    await navigateToCodeExamples();

    assert.notOk(codeExamplesPage.solutionCards[0].hasViewOnGithubButton, 'should not show view button for published solutions');
    assert.ok(codeExamplesPage.solutionCards[0].hasDirectGithubLink, 'should show direct GitHub link');
  });
});
