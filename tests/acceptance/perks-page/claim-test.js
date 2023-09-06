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

    const route = this.owner.lookup('route:perk.claim');
    let urlRedirectedTo;

    route.redirectTo = (url) => {
      urlRedirectedTo = url;
    };

    await perksPage.visitClaim({ slug: 'dummy' });

    assert.strictEqual(urlRedirectedTo, 'https://dummy-claim-url.com');
  });

  test('it tracks claimed perk events', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const route = this.owner.lookup('route:perk.claim');
    route.redirectTo = () => {};

    await perksPage.visitClaim({ slug: 'dummy' });

    const store = this.owner.lookup('service:store');
    const analyticsEvents = await store.findAll('analytics-event', { backgroundReload: false });
    const analyticsEventNames = analyticsEvents.map((event) => event.name);

    assert.ok(analyticsEventNames.includes('claimed_perk'));
  });
});
