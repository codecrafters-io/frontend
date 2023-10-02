import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import percySnapshot from '@percy/ember';
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

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders when user is logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders when user accesses URL directly', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await courseOverviewPage.visit({ course_slug: 'redis' });
    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders when anonymous user views alpha course', async function (assert) {
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'grep' });
    assert.strictEqual(currentURL(), '/courses/grep/overview');
  });

  test('it renders for course with extensions', async function (assert) {
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'redis' });
    await percySnapshot('Course Overview - With Extensions');

    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders for course without extensions', async function (assert) {
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'docker' });
    await percySnapshot('Course Overview - No Extensions');

    assert.strictEqual(currentURL(), '/courses/docker/overview');
  });
});
