import { isVisible, text } from 'ember-cli-page-object';

export default {
  latestCaptionIsVisible: isVisible('[data-test-latest-caption]'),
  latestCaptionText: text('[data-test-latest-caption]'),
  listeningIndicatorIsVisible: isVisible('[data-test-listening-indicator]'),
  previousCaptionText: text('[data-test-previous-caption]'),
  scope: '[data-test-captions-panel]',
};
