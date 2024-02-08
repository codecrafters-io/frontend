import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import basicDetailsPage from 'codecrafters-frontend/tests/pages/concept-admin/basic-details-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | concept-admin | view-basic-details', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can view basic details', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('concept', { slug: 'dummy' });

    await basicDetailsPage.visit({ concept_slug: 'dummy' });
    assert.strictEqual(1, 1);

    await percySnapshot('Concept Admin - Basic Details');
  });
});
