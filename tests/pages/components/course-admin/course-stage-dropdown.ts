import { clickOnText, clickable, collection, isVisible, text } from 'ember-cli-page-object';
import { settled } from '@ember/test-helpers';

export default {
  async click() {
    this.clickRaw();
    await settled();
  },

  clickOnStageLink(stageName: string) {
    return this.content.clickOnStageLink(stageName);
  },

  clickRaw: clickable('button'),

  content: {
    clickOnStageLink: clickOnText('[data-test-course-stage-link]'),
    scope: '[data-test-course-stage-dropdown-content]',
  },

  currentStageName: text('[data-test-current-course-stage-name]'),
  isOpen: isVisible('[data-test-course-stage-dropdown-content]'),
  stageLinks: collection('[data-test-course-stage-link]', {
    name: text('[data-test-stage-name]'),
    slug: text('[data-test-stage-slug]'),
  }),
  scope: '[data-test-course-stage-dropdown]',
};
