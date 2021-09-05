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

module('Acceptance | course-page | switch-repository-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can switch repository', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let currentUser = this.owner.lookup('service:currentUser').record;

    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let go = this.server.schema.languages.findBy({ name: 'Go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
      lastSubmissionAt: new Date(2020, 7, 1),
    });

    let goRepository = this.server.create('repository', {
      course: redis,
      language: go,
      user: currentUser,
      name: 'Go #1',
      lastSubmissionAt: new Date(2020, 7, 2),
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    await this.pauseTest();

    assert.equal(currentURL(), '/courses/next/redis', 'current URL is course page URL');
    assert.equal(this.server.pretender.handledRequests.length, 3); // Fetch course (courses page + course page) + fetch repositories

    assert.equal(coursePage.repositoryDropdown.activeRepositoryName, goRepository.name); // Repository with last push should be active

    console.log(currentURL());

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnRepositoryLink(pythonRepository.name);

    console.log(currentURL());

    assert.equal(coursePage.repositoryDropdown.activeRepositoryName, pythonRepository.name); // Repository with last push should be active
    assert.ok(coursePage.repositoryDropdown.isClosed); // Repository with last push should be active

    await coursesPage.visit(); // Poller is active
  });
});
