import { clickable, clickOnText, text } from 'ember-cli-page-object';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default {
  activeRepositoryName: text('[data-test-active-repository-name]'),

  async click() {
    this.clickRaw();
    await finishRender();
  },

  clickRaw: clickable('button'),

  clickOnRepositoryLink(repositoryName) {
    return this.content.clickOnRepositoryLink(repositoryName);
  },

  clickOnAction(text) {
    return this.content.clickOnAction(text);
  },

  content: {
    clickOnRepositoryLink: clickOnText('[data-test-repository-link]'),
    clickOnAction: clickOnText('[data-test-dropdown-action]'),
    scope: '[data-test-repository-dropdown-content]',
    resetScope: true,
  },

  get isClosed() {
    return !this.content.isVisible;
  },

  scope: '[data-test-repository-dropdown]',
};
