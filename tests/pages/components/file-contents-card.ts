import { clickable, create, text, triggerable } from 'ember-cli-page-object';
import codeMirror from 'codecrafters-frontend/tests/pages/components/code-mirror';

export default create({
  scope: '[data-test-file-contents-card-component]',
  codeMirror,
  header: {
    scope: '[data-test-file-contents-card-header]',
    click: clickable(),

    hover: triggerable('mouseenter', '[data-test-file-contents-card-header-hover-target]'),

    expandButton: {
      scope: '[data-test-file-contents-card-header-expand-button]',
      click: clickable(),
    },

    collapseButton: {
      scope: '[data-test-file-contents-card-header-collapse-button]',
      click: clickable(),
    },

    tooltipBubble: {
      scope: '[data-test-file-contents-card-component] .tooltip.ember-tooltip',
      resetScope: true,
      text: text(),
    },
  },

  collapseButton: {
    scope: '[data-test-file-contents-card-collapse-button]',
    click: clickable(),
  },
});
