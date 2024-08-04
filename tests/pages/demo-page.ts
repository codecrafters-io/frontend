import { attribute, clickable, collection, create, text, visitable } from 'ember-cli-page-object';
import CodeMirror from 'codecrafters-frontend/tests/pages/components/code-mirror';
import DarkModeToggle from 'codecrafters-frontend/tests/pages/components/dark-mode-toggle';
import FileContentsCard from 'codecrafters-frontend/tests/pages/components/file-contents-card';

export default create({
  tabSwitcher: {
    scope: '[data-test-demo-tab-switcher]',

    tabs: collection('a', {
      click: clickable(),
    }),

    findTabByText(text: string) {
      return this.tabs.findOneBy('text', text);
    },

    clickOnTab(text: string) {
      return this.findTabByText(text).click();
    },
  },

  demoTabs: {
    codeMirror: {
      visit: visitable('/demo/code-mirror'),
      component: CodeMirror,
    },

    darkModeToggle: {
      visit: visitable('/demo/dark-mode-toggle'),
      component: DarkModeToggle,

      currentLocalStoragePreference: {
        scope: '[data-test-current-local-storage-preference]',
        text: text(),
      },

      currentSystemPreference: {
        scope: '[data-test-current-system-preference]',
        text: text(),
      },
    },

    fileContentsCard: {
      visit: visitable('/demo/file-contents-card'),
      component: FileContentsCard,

      componentOptions: collection('component-options label', {
        text: text(),

        checkbox: {
          scope: 'input[type=checkbox]',
          click: clickable(),
          isDisabled: attribute('disabled'),
        },
      }),

      findComponentOptionByText(text: string) {
        return this.componentOptions.findOneBy('text', text);
      },

      clickOnComponentOption(text: string) {
        return this.findComponentOptionByText(text).click();
      },
    },
  },

  visit: visitable('/demo'),
});
