import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | start-course-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can start course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    assert.equal(currentURL(), '/courses/next/redis');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep);
    assert.equal(coursePage.setupItem.statusText, 'IN PROGRESS');

    await coursePage.setupItem.clickOnLanguageButton('Python');
    assert.ok(coursePage.setupItem.isOnCloneRepositoryStep);
  });
});
