import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import codeExamplesPage from 'codecrafters-frontend/tests/pages/course/code-examples-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import createCommunityCourseStageSolution from 'codecrafters-frontend/mirage/utils/create-community-course-stage-solution';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import window from 'ember-window-mock';
import { waitUntil, settled } from '@ember/test-helpers';

module('Acceptance | course-page | code-examples | view-on-github', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(async function () {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let differentUser = this.server.create('user', {
        avatarUrl: 'https://github.com/sarupbanskota.png',
        createdAt: new Date(),
        githubUsername: 'sarupbanskota',
        username: 'sarupbanskota',
      });

    let ruby = this.server.schema.languages.findBy({ name: 'Ruby' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: ruby,
      user: differentUser,
    });

    this.solution = createCommunityCourseStageSolution(this.server, redis, 2, ruby, differentUser);

    await visitCodeExamplesPage();
  });

  async function visitCodeExamplesPage() {
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.clickOnStepListItem('Respond to PING');
    await coursePage.clickOnHeaderTabLink('Code Examples');
  }

  test('can view export on GitHub if none exists', async function (assert) {
    window.open = (urlToOpen) => {
      assert.strictEqual(urlToOpen, 'https://github.com/cc-code-examples/ruby-redis/blob/main/server.rb', 'should open github with correct URL');
    };

    assert.ok(codeExamplesPage.solutionCards[0].highlightedFileCards[0].hasViewOnGithubButton, 'Expect view on github button to be visible');
    
    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();
  });


  test('can view export on GitHub if an unexpired export exists', async function (assert) {
    this.server.create('communitySolutionExport', {
      communitySolution: this.solution,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      githubRepositoryUrl: 'https://github.com/cc-code-examples/ruby-redis-1',
    });

    await visitCodeExamplesPage();

    window.open = (urlToOpen) => {
      assert.strictEqual(urlToOpen, 'https://github.com/cc-code-examples/ruby-redis-1/blob/main/server.rb', 'should open github with correct (new) URL');
    };

    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();
  });

  test('can view export on GitHub if an expired export exists', async function (assert) {
    this.server.create('communitySolutionExport', {
      communitySolution: this.solution,
      expiresAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      githubRepositoryUrl: 'https://github.com/cc-code-examples/ruby-redis-2',
    });

    await visitCodeExamplesPage();

    window.open = (urlToOpen) => {
      assert.strictEqual(urlToOpen, 'https://github.com/cc-code-examples/ruby-redis/blob/main/server.rb', 'should open github with correct (old) URL');
    };

    assert.ok(codeExamplesPage.solutionCards[0].highlightedFileCards[0].hasViewOnGithubButton, 'Expect view on github button to be visible');
    
    await codeExamplesPage.solutionCards[0].highlightedFileCards[0].clickOnViewOnGithubButton();
    await settled();
  });

  test('shows anchor link if solution is published', async function (assert) {
    this.solution.update({
      githubRepositoryName: 'author/redis-solution',
      githubRepositoryIsPrivate: false,
      commitSha: 'abc123',
    });

    await visitCodeExamplesPage();

    assert.notOk(codeExamplesPage.solutionCards[0].highlightedFileCards[0].hasViewOnGithubButton, 'Expect view on github button to be hidden');
  });
});