import { clickable, collection, text } from 'ember-cli-page-object';
import { waitUntil } from '@ember/test-helpers';

export default {
  get isOpen() {
    return this.isVisible;
  },

  clickOnCloseButton: clickable('[data-test-close-modal-button]'),

  extensionCards: collection('[data-test-course-extension-card]', {
    name: text('[data-test-course-extension-name]'),
    clickOnToggleExtensionButton: clickable('[data-test-toggle-extension-button]'),
  }),

  extensionIdeaCards: collection('[data-test-course-extension-idea-card]'),

  scope: '[data-test-configure-extensions-modal]',

  async toggleExtension(name) {
    await waitUntil(() => this.extensionCards.toArray().length > 0, { timeoutMessage: 'No extension cards found' });

    await waitUntil(() => this.extensionCards.toArray().find((card) => card.name === name), {
      timeoutMessage: `No extension card found with name ${name}`,
    });

    await this.extensionCards
      .toArray()
      .find((card) => card.name === name)
      .clickOnToggleExtensionButton();
  },
};
