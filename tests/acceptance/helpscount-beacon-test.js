import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupAnimationTest, animationsSettled } from 'ember-animated/test-support';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { waitUntil, visit } from '@ember/test-helpers';
import { signIn, signInAsAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import helpscoutBeacon from 'codecrafters-frontend/tests/pages/components/helpscout-beacon';
import conceptsPage from '../pages/concepts-page';
import userPage from 'codecrafters-frontend/tests/pages/user-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import dummy from 'codecrafters-frontend/mirage/concept-fixtures/dummy';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';

function createConcepts(server) {
  createConceptFromFixture(server, networkProtocols);
  createConceptFromFixture(server, dummy);
}

module('Acceptance | helpscout-beacon-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('beacon renders on catalog page', async function (assert) {
    testScenario(this.server);
    await catalogPage.visit();

    assert.ok(catalogPage.helpscoutBeacon.isPresent, 'Helpscout Beacon is present');
  });

  test("beacon doesn't render on concepts page", async function (assert) {
    testScenario(this.server);
    await conceptsPage.visit();

    assert.false(conceptsPage.helpscoutBeacon.isPresent, 'Helpscout Beacon is not present');
  });
  
  test("beacon doesn't render on concepts page", async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    await conceptsPage.visit();
    await conceptsPage.clickOnConceptCard('Network Protocols');
    assert.false(conceptsPage.helpscoutBeacon.isPresent, 'Helpscout Beacon is not present');
  });

  test("beacon doesn't render on user pages", async function (assert) {
    testScenario(this.server);
    await userPage.visit({ username: 'rohitpaulk' });

    assert.false(userPage.helpscoutBeacon.isPresent, 'Helpscout Beacon is not present');
  });
});
