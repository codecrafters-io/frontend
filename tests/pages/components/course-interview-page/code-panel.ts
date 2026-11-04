import { attribute, clickable, collection, isVisible, text } from 'ember-cli-page-object';

export default {
  codeHighlightLabelText: text('[data-test-code-highlight-label]'),
  emptyStateIsVisible: isVisible('[data-test-code-panel-empty]'),

  fileTabs: collection('[data-test-code-file-tab]', {
    ariaSelected: attribute('aria-selected'),
    click: clickable(),
    hasHighlightedFileIndicator: isVisible('[data-test-highlighted-file-indicator]'),
  }),

  highlightedLines: collection('[data-test-active-code-file] .cm-highlightedLine'),
  scope: '[data-test-code-panel]',
};
