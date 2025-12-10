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
      senderMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.\n\n— Paul',
      validityInDays: 365,
      purchasedAt: new Date(),
      redeemedAt: null,
    });

    await redeemGiftPage.visit({ secret_token: 'xyz' });
    assert.strictEqual(redeemGiftPage.giftMessageContainer.text, 'Message from sender: Happy Birthday! Enjoy your CodeCrafters membership. — Paul');
  });

  test('displays gift details if gift is redeemed', async function (assert) {
    this.server.schema.membershipGifts.create({
      secretToken: 'xyz',
      senderMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      redeemedAt: new Date(),
    });

    await redeemGiftPage.visit({ secret_token: 'xyz' });
    assert.strictEqual(redeemGiftPage.giftAlreadyRedeemedMessage.text, 'This gift has already been redeemed.');
  });
});
