import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsBetaParticipant } from 'codecrafters-frontend/tests/support/authentication-helpers';
import adminCoursesPage from 'codecrafters-frontend/tests/pages/admin/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | admin | view-course-submissions', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await adminCoursesPage.visit();
    await adminCoursesPage.clickOnLink('Build your own Redis');
    await this.pauseTest();
  });
});
