import { create, text, triggerable } from 'ember-cli-page-object';
import codeMirror from 'codecrafters-frontend/tests/pages/components/code-mirror';

export default create({
  scope: '[data-test-file-contents-card-component]',
  codeMirror,
  header: {
    scope: '[data-test-file-contents-card-header]',

    hover: triggerable('mouseenter', '[data-test-file-contents-card-header-hover-target]'),

    expandButton: {
      scope: '[data-test-file-contents-card-header-expand-button]',
    },

    collapseButton: {
      scope: '[data-test-file-contents-card-header-collapse-button]',
    },

    tooltipBubble: {
      scope: '[data-test-file-contents-card-component] .tooltip.ember-tooltip',
      resetScope: true,
      text: text(),
    },
  },

  collapseButton: {
    scope: '[data-test-file-contents-card-collapse-button]',
  },
});
