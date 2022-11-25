import referralsPage from 'codecrafters-frontend/tests/pages/referrals-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import percySnapshot from '@percy/ember';

module('Acceptance | referrals-page | join-referral-program', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view join page when referral link is not present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await referralsPage.visit();
    assert.ok(referralsPage.getStartedButton.isVisible);

    await percySnapshot('Referrals Page | Join Referral Program');
  });

  test('can join referral program', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await referralsPage.visit();
    await referralsPage.getStartedButton.click();

    assert.notOk(referralsPage.getStartedButton.isVisible, 'Get Started button is not visible');

    await percySnapshot('Referrals Page | Empty Referrals List');
    await this.pauseTest();
  });
});
