import percySnapshot from '@percy/ember';
import referralPage from 'codecrafters-frontend/tests/pages/referral-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referrals-page | join-referral-program', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view join page when referral link is not present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await referralPage.visit();
    assert.ok(referralPage.getStartedButton.isVisible, 'expect to see get started button');

    await percySnapshot('Referral Page | Join Referral Program');
  });

  test('can join referral program', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await referralPage.visit();
    await referralPage.getStartedButton.click();

    assert.notOk(referralPage.getStartedButton.isVisible, 'expect get started button to be hidden');

    await percySnapshot('Referral Page | Empty Referrals List');
  });
});
