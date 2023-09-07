import perksPage from 'codecrafters-frontend/tests/pages/perks-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | perks-page | claim-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it is redirected to the correct url', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('perk', { slug: 'dummy' });

    const route = this.owner.lookup('route:perk.claim');
    let urlRedirectedTo;

    route.redirectTo = (url) => {
      urlRedirectedTo = url;
    };

    await perksPage.visitClaim({ slug: 'dummy' });

    assert.strictEqual(urlRedirectedTo, 'https://dummy-claim-url.com');
  });
});
