import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import verifyApiRequests from 'codecrafters-frontend/tests/support/verify-api-requests';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

module('Acceptance | course-page | switch-repository', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can switch repository', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    let currentUser = this.server.schema.users.first();

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let go = this.server.schema.languages.findBy({ name: 'Go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    let goRepository = this.server.create('repository', 'withFirstStageInProgress', {
      course: redis,
      language: go,
      user: currentUser,
      name: 'Go #1',
    });

    await catalogPage.visit();

    let expectedRequests = [
      '/api/v1/repositories', // fetch repositories (catalog page)
      '/api/v1/courses', // fetch courses (catalog page)
      '/api/v1/languages', // fetch languages (catalog page)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after visiting catalog page');

    await catalogPage.clickOnCourse('Build your own Redis');

    expectedRequests = [
      '/api/v1/courses', // fetch course details (course overview page)
      '/api/v1/repositories', // fetch repositories (course overview page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course overview page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries after subscribed (course overview page)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after visiting course overview page');

    await courseOverviewPage.clickOnStartCourse();

    expectedRequests = [
      '/api/v1/courses', // refresh course (course page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-stage-comments', // fetch stage comments (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries after subscribed (course page)
      '/api/v1/repositories', // fetch repositories after subscribed (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries after subscribed (course page)
    ];

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, goRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.header.stepName, 'Bind to a port');

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    fakeActionCableConsumer.sendData('CourseLeaderboardChannel', { event: 'updated' });
    await finishRender();
    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence after polling');

    await coursePage.repositoryDropdown.click();
    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 1, 'non active repositories should be 1');

    await coursePage.repositoryDropdown.clickOnRepositoryLink(pythonRepository.name);

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'selected repository should be active');
    assert.ok(coursePage.repositoryDropdown.isClosed, 'repository dropdown should be closed');
    assert.strictEqual(coursePage.header.stepName, 'Respond to PING');
  });
});
