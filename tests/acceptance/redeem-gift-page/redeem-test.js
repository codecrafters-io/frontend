import redeemGiftPage from 'codecrafters-frontend/tests/pages/redeem-gift-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { assertTooltipContent } from 'ember-tooltips/test-support';

module('Acceptance | redeem-gift-page | redeem', function (hooks) {
  setupApplicationTest(hooks);

  test('user cannot redeem a gift if they are not logged in', async function (assert) {
    testScenario(this.server);

    this.server.schema.membershipGifts.create({
      secretToken: 'xyz',
      giftMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      claimedAt: null,
    });

    await redeemGiftPage.visit({ secret_token: 'xyz' });
    assert.notOk(redeemGiftPage.redeemButton.isDisabled, 'Redeem button should be enabled for anonymous users');

    await redeemGiftPage.redeemButton.hover();
    assertTooltipContent(assert, { contentString: 'Click to login via GitHub' });
  });

  test('user cannot redeem a gift if they already have a membership', async function (assert) {
    testScenario(this.server);

    signInAsSubscriber(this.owner, this.server);

    this.server.schema.membershipGifts.create({
      secretToken: 'xyz',
      giftMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      claimedAt: null,
    });

    await redeemGiftPage.visit({ secret_token: 'xyz' });
    assert.ok(redeemGiftPage.redeemButton.isDisabled, 'Redeem button should be disabled for users with existing membership');

    await redeemGiftPage.redeemButton.hover();

    assertTooltipContent(assert, {
      contentString: 'You already have full access to CodeCrafters. You can claim this gift once your membership expires.',
    });
  });
});
