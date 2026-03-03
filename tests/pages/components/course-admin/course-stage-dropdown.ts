import { clickable, text } from 'ember-cli-page-object';
import { click, waitUntil } from '@ember/test-helpers';

const DROPDOWN_CONTENT_SELECTOR = '[data-test-course-stage-dropdown-content]';
const COURSE_STAGE_LINK_SELECTOR = '[data-test-course-stage-link]';

export default {
  async click() {
    await this.clickRaw();

    await waitUntil(() => !!document.querySelector(DROPDOWN_CONTENT_SELECTOR));
  },

  async clickOnStageLink(stageName: string) {
    await waitUntil(() => {
      const stageLinks = Array.from(document.querySelectorAll(`${DROPDOWN_CONTENT_SELECTOR} ${COURSE_STAGE_LINK_SELECTOR}`));

      return stageLinks.some((stageLink) => stageLink.textContent?.trim() === stageName);
    });

    const stageLink = Array.from(document.querySelectorAll(`${DROPDOWN_CONTENT_SELECTOR} ${COURSE_STAGE_LINK_SELECTOR}`)).find(
      (element) => element.textContent?.trim() === stageName,
    );

    if (!(stageLink instanceof HTMLElement)) {
      throw new Error(`Could not find course stage link: ${stageName}`);
    }

    await click(stageLink);
  },

  clickRaw: clickable('[data-test-course-stage-dropdown-trigger]'),

  currentStageName: text('[data-test-current-course-stage-name]'),
  scope: '[data-test-course-stage-dropdown]',
};
