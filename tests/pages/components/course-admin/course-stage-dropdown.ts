import { clickable, clickOnText, text } from 'ember-cli-page-object';
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
  scope: '[data-test-course-stage-dropdown]',
};
