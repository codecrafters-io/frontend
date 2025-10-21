import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import verifyApiRequests from 'codecrafters-frontend/tests/support/verify-api-requests';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | switch-repository', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can switch repository', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let go = this.server.schema.languages.findBy({ name: 'Go' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    let goRepository = this.server.create('repository', 'withFirstStageInProgress', {
      course: dummy,
      language: go,
      user: currentUser,
      name: 'Go #1',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    const expectedRequests = [
      '/api/v1/repositories', // fetch repositories (catalog page)
      '/api/v1/courses', // fetch courses (catalog page)
      '/api/v1/languages', // fetch languages (catalog page)
      '/api/v1/courses', // fetch course details (course overview page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course page)
      '/api/v1/courses', // refresh course (course page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-stage-comments', // fetch stage comments (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course page)
      '/api/v1/repositories', // poll repositories (course page)
      '/api/v1/course-leaderboard-entries', // poll leaderboard (course page)
    ];

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, goRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.header.stepName, 'The first stage');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after polling');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 1, 'non active repositories should be 1');

    await coursePage.repositoryDropdown.clickOnRepositoryLink(pythonRepository.name);

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'selected repository should be active');
    assert.ok(coursePage.repositoryDropdown.isClosed, 'repository dropdown should be closed');
    assert.strictEqual(coursePage.header.stepName, 'The second stage');
  });
});
