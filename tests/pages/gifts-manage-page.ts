import { clickable, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  visit: visitable('/gifts/manage/:management_token'),

  giftMessageContainer: {
    scope: '[data-test-gift-message-container]',
    messageText: text('[data-test-gift-message-editable]'),
  },

  clickOnEditButton: clickable('[data-test-edit-button]'),
  clickOnSaveButton: clickable('[data-test-save-button]'),
  clickOnCancelButton: clickable('[data-test-cancel-button]'),
});
