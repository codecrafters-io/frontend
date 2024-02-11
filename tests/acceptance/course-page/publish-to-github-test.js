import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { settled } from '@ember/test-helpers';

module('Acceptance | course-page | publish-to-github-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can initiate GitHub integration setup', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Publish to GitHub');

    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github modal is open');
  });

  test('can view broken GitHub installation if sync was not setup', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    // This happens when you access repositories for the first time.
    this.server.create('github-app-installation', { user: currentUser, status: 'active', githubConfigureUrl: 'https://google.com/' });

    this.server.get('/github-app-installations/:id/accessible-repositories', function () {
      return [];
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.repositoryDropdown.click();

    await animationsSettled();

    await coursePage.repositoryDropdown.clickOnAction('Publish to GitHub');

    await animationsSettled();

    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github modal is open');
    assert.ok(coursePage.configureGithubIntegrationModal.fixGitHubAppInstallationPrompt.isVisible, 'fix github app installation prompt is visible');

    this.server.get('/github-app-installations/:id/accessible-repositories', function () {
      return [
        { id: 564057934, full_name: 'rohitpaulk/cc-publish-test', created_at: '2022-11-09T22:40:59Z' },
        { id: 564057935, full_name: 'rohitpaulk/other-repo', created_at: '2022-10-08T22:40:59Z' },
      ];
    });

    await coursePage.configureGithubIntegrationModal.fixGitHubAppInstallationPrompt.refreshStatusButton.click();

    await animationsSettled();

    assert.notOk(
      coursePage.configureGithubIntegrationModal.fixGitHubAppInstallationPrompt.isVisible,
      'fix github app installation prompt is not visible',
    );
  });

  test('can complete GitHub integration setup', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('github-app-installation', { user: currentUser, githubConfigureUrl: 'https://google.com' });

    await coursePage.visit({ course_slug: 'redis', action: 'github_app_installation_completed' });
    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github modal is open');

    window.confirm = () => true;

    await settled();
    await animationsSettled();

    await coursePage.configureGithubIntegrationModal.clickOnPublishButton();
    await coursePage.configureGithubIntegrationModal.clickOnDisconnectRepositoryButton();

    await settled();
    await animationsSettled();

    await coursePage.configureGithubIntegrationModal.clickOnPublishButton();
  });
});
