import giftsManagePage from 'codecrafters-frontend/tests/pages/gifts-manage-page';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

module('Acceptance | manage-gift-page | view', function (hooks) {
  setupApplicationTest(hooks);

  test('redirects to 404 if gift is not found', async function (assert) {
    await giftsManagePage.visit({ management_token: 'invalid' });
    assert.strictEqual(currentURL(), '/404');
  });

  test('renders page if gift is found', async function (assert) {
    const membershipGift = this.server.schema.membershipGifts.create({
      managementToken: 'valid-token',
      secretToken: 'xyz',
      senderMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      redeemedAt: null,
    });

    await giftsManagePage.visit({ management_token: 'valid-token' });
    assert.strictEqual(currentURL(), `/gifts/manage/${membershipGift.managementToken}`);
  });

  test('redirects to redeemed page if gift is redeemed', async function (assert) {
    this.server.schema.membershipGifts.create({
      managementToken: 'valid-token',
      secretToken: 'xyz',
      senderMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      redeemedAt: new Date(),
    });

    await giftsManagePage.visit({ management_token: 'valid-token' });
    assert.strictEqual(currentURL(), '/gifts/redeemed');
  });
});
