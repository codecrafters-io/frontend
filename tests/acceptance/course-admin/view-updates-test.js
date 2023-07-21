import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import updatesPage from 'codecrafters-frontend/tests/pages/course-admin/updates-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | course-admin | view-updates', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when no updates are present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[0].clickOnViewUpdateButton();

    await percySnapshot('Admin - Course Updates - No Updates');
  });
});
