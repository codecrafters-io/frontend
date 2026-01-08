import { clickOnText, clickable, collection, text } from 'ember-cli-page-object';
import { timeout } from 'ember-concurrency';

export default {
  currentLanguageName: text('[data-test-language-dropdown-trigger] [data-test-current-language-name]', { resetScope: true }),
  toggle: clickable('[data-test-language-dropdown-trigger]', { resetScope: true }),
  clickOnLink: clickOnText('div[role="button"]'),

  hasLink(text) {
    return [...this.links].some((link) => link.text.includes(text));
  },

  links: collection('div[role="button"]', {
    text: text(),
  }),

  shadowOverlay: {
    scope: 'shadow-overlay',

    get opacity() {
      const el = document.querySelector(this.scope);

      return +el.style.opacity;
    },
  },

  async scrollToPercentage(percentage) {
    const el = document.querySelector(this.scope);
    el.scrollTo({ top: (percentage / 100) * (el.scrollHeight - el.clientHeight), behavior: 'instant' });
    el.dispatchEvent(new MouseEvent('scroll'));
    await timeout(0); // wait till next run-loop for scroll event to propagate
  },

  resetScope: true,
  scope: '[data-test-language-dropdown-content]',
};
