import redeemGiftPage from 'codecrafters-frontend/tests/pages/redeem-gift-page';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

module('Acceptance | redeem-gift-page | view', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /gifts/redeem/xyz', async function (assert) {
    await redeemGiftPage.visit({ secret_code: 'xyz' });
    assert.strictEqual(currentURL(), '/gifts/redeem/xyz');
  });
});
