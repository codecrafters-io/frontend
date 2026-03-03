import { clickable, text } from 'ember-cli-page-object';
import { click, waitUntil } from '@ember/test-helpers';

const DROPDOWN_CONTENT_SELECTOR = '[data-test-language-dropdown-content]';
const LANGUAGE_LINK_SELECTOR = '[data-test-language-link]';

export default {
  async click() {
    await this.clickRaw();

    await waitUntil(() => !!document.querySelector(DROPDOWN_CONTENT_SELECTOR));
  },

  async clickOnLanguageLink(languageName: string) {
    await waitUntil(() => {
      const languageLinks = Array.from(document.querySelectorAll(`${DROPDOWN_CONTENT_SELECTOR} ${LANGUAGE_LINK_SELECTOR}`));

      return languageLinks.some((languageLink) => languageLink.textContent?.trim() === languageName);
    });

    const languageLink = Array.from(document.querySelectorAll(`${DROPDOWN_CONTENT_SELECTOR} ${LANGUAGE_LINK_SELECTOR}`)).find(
      (element) => element.textContent?.trim() === languageName,
    );

    if (!(languageLink instanceof HTMLElement)) {
      throw new Error(`Could not find language link: ${languageName}`);
    }

    await click(languageLink);
  },

  clickRaw: clickable('[data-test-language-dropdown-trigger]'),

  currentLanguageName: text('[data-test-current-language-name]'),
  scope: '[data-test-language-dropdown]',
};
