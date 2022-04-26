import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-course-overview', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when user is not logged in', async function (assert) {
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(currentURL(), '/courses/redis/overview');
  });

  test('it renders when user is logged in', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(currentURL(), '/courses/redis/overview');
  });

  test('it renders when user accesses URL directly', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'redis' });
    assert.equal(currentURL(), '/courses/redis/overview');
  });
});
