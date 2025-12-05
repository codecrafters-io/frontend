import giftsManagePage from 'codecrafters-frontend/tests/pages/gifts-manage-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

module('Acceptance | manage-gift-page | edit-message', function (hooks) {
  setupApplicationTest(hooks);

  test('can edit gift message', async function (assert) {
    testScenario(this.server);

    const membershipGift = this.server.schema.membershipGifts.create({
      managementToken: 'valid-token',
      secretToken: 'xyz',
      senderMessage: 'Happy Birthday! Enjoy your CodeCrafters membership.',
      validityInDays: 365,
      purchasedAt: new Date(),
      claimedAt: null,
    });

    await giftsManagePage.visit({ management_token: 'valid-token' });

    assert.strictEqual(
      giftsManagePage.giftMessageContainer.messageText,
      'Happy Birthday! Enjoy your CodeCrafters membership.',
      'Initial message is displayed',
    );

    await giftsManagePage.clickOnEditButton();

    const editableElement = document.querySelector('[data-test-gift-message-editable]');
    editableElement.textContent = 'Updated message for the recipient!';
    editableElement.dispatchEvent(new Event('input', { bubbles: true }));

    await giftsManagePage.clickOnSaveButton();
    await settled();

    assert.strictEqual(giftsManagePage.giftMessageContainer.messageText, 'Updated message for the recipient!', 'Message is updated after saving');

    const updatedGift = this.server.schema.membershipGifts.find(membershipGift.id);
    assert.strictEqual(updatedGift.senderMessage, 'Updated message for the recipient!', 'Message is persisted in the database');
  });

  test('can add gift message when none exists', async function (assert) {
    testScenario(this.server);

    const membershipGift = this.server.schema.membershipGifts.create({
      managementToken: 'valid-token-2',
      secretToken: 'xyz2',
      senderMessage: null,
      validityInDays: 365,
      purchasedAt: new Date(),
      claimedAt: null,
    });

    await giftsManagePage.visit({ management_token: 'valid-token-2' });

    assert.ok(document.querySelector('[data-test-add-gift-message-button]'), 'Add gift message button is shown when no message exists');

    await giftsManagePage.clickOnAddGiftMessageButton();

    const editableElement = document.querySelector('[data-test-gift-message-editable]');
    assert.ok(editableElement, 'Editable element is present after clicking add button');
    assert.strictEqual(editableElement.getAttribute('contenteditable'), 'true', 'Editable element is in editing mode');

    editableElement.textContent = 'New message for the recipient!';
    editableElement.dispatchEvent(new Event('input', { bubbles: true }));

    await giftsManagePage.clickOnSaveButton();
    await settled();

    assert.strictEqual(giftsManagePage.giftMessageContainer.messageText, 'New message for the recipient!', 'Message is saved after adding');

    const updatedGift = this.server.schema.membershipGifts.find(membershipGift.id);
    assert.strictEqual(updatedGift.senderMessage, 'New message for the recipient!', 'Message is persisted in the database');
  });
});
