import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | switch-repository', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can switch repository', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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
    await catalogPage.clickOnCourse('Build your own Redis');

    const baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'fetch courses (course page)',
      'fetch repositories (course page)',
      'fetch leaderboard entries (course page)',
      'fetch hints (course page)',
    ].length;

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, goRepository.name, 'repository with last push should be active');
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Bind to a port');

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    assert.strictEqual(apiRequestsCount(this.server), baseRequestsCount + 2, 'polling should have run');

    await coursePage.repositoryDropdown.click();

    assert.strictEqual(coursePage.repositoryDropdown.content.nonActiveRepositoryCount, 1, 'non active repositories should be 1');

    await coursePage.repositoryDropdown.clickOnRepositoryLink(pythonRepository.name);

    assert.strictEqual(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'selected repository should be active');
    assert.ok(coursePage.repositoryDropdown.isClosed, 'repository dropdown should be closed');
    assert.strictEqual(coursePage.desktopHeader.stepName, 'Respond to PING');
  });
});
