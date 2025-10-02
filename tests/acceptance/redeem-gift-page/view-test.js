import redeemGiftPage from 'codecrafters-frontend/tests/pages/redeem-gift-page';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

module('Acceptance | redeem-gift-page | view', function (hooks) {
  setupApplicationTest(hooks);

  test('redirects to 404 if gift is not found', async function (assert) {
    await redeemGiftPage.visit({ secret_token: 'invalid' });
    assert.strictEqual(currentURL(), '/404');
  });

  test('displays gift details', async function (assert) {
    this.server.schema.membershipGifts.create({
      secretToken: 'xyz',
      giftMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      claimedAt: null,
    });

    await redeemGiftPage.visit({ secret_token: 'xyz' });

    assert.strictEqual(redeemGiftPage.giftDetailsContainer.giftMessage, 'Happy Birthday! Enjoy your CodeCrafters membership.');
  });
});
