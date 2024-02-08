import affiliatePage from 'codecrafters-frontend/tests/pages/affiliate-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsAffiliate } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | affiliate-page | join-affiliate-program', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view join page when affiliate link is not present', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await affiliatePage.visit();
    assert.ok(affiliatePage.getStartedButton.isVisible);

    await percySnapshot('Affiliate Page | Join Affiliate Program');
  });

  test('can join affiliate program', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await affiliatePage.visit();
    await affiliatePage.getStartedButton.click();

    assert.notOk(affiliatePage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Affiliate Page | Empty Affiliate Referrals List');
  });
});
