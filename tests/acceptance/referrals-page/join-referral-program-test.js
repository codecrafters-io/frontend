import referralPage from 'codecrafters-frontend/tests/pages/referral-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | referral-page | join-referral-program', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view join page when referral link is not present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await referralPage.visit();
    assert.ok(referralPage.getStartedButton.isVisible);

    await percySnapshot('Referral Page | Join Referral Program');
  });

  test('can join referral program', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await referralPage.visit();
    await referralPage.getStartedButton.click();

    assert.notOk(referralPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Referral Page | Empty Referrals List');
  });
});
