import { clickable, clickOnText, text, count } from 'ember-cli-page-object';
import { settled } from '@ember/test-helpers';

export default {
  activeRepositoryName: text('[data-test-active-repository-name]'),

  async click() {
    await this.clickRaw();
    await settled();
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
    nonActiveRepositoryCount: count('[data-test-repository-link]'),
  },

  get isClosed() {
    return !this.content.isVisible;
  },

  scope: '[data-test-repository-dropdown]',
};
