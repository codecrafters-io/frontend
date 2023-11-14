import partnerPage from 'codecrafters-frontend/tests/pages/partner-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsAffiliate } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | partner-page | join-partner-program', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view join page when affiliate link is not present', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await partnerPage.visit();
    assert.ok(partnerPage.getStartedButton.isVisible);

    await percySnapshot('Partner Page | Join Referral Program');
  });

  test('can join partner program', async function (assert) {
    testScenario(this.server);
    signInAsAffiliate(this.owner, this.server);

    await partnerPage.visit();
    await partnerPage.getStartedButton.click();

    assert.notOk(partnerPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Partner Page | Empty Referrals List');
  });
});
