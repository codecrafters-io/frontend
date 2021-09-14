import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | switch-repository', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can switch repository', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

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

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    assert.equal(currentURL(), '/courses/next/redis', 'current URL is course page URL');
    assert.equal(this.server.pretender.handledRequests.length, 4); // Fetch course (courses page + course page) + fetch repositories + leaderboard

    assert.equal(coursePage.repositoryDropdown.activeRepositoryName, goRepository.name, 'repository with last push should be active');
    assert.equal(coursePage.activeCourseStageItem.title, 'Bind to a port');

    await this.clock.tick(3000);

    assert.equal(this.server.pretender.handledRequests.length, 5, 'polling should have run');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnRepositoryLink(pythonRepository.name);

    assert.equal(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name, 'selected repository should be active');
    assert.ok(coursePage.repositoryDropdown.isClosed, 'repository dropdown should be closed');
    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING');

    await coursesPage.visit(); // Poller is active
  });
});
