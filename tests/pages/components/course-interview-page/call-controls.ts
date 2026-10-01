import { animationsSettled } from 'ember-animated/test-support';
import { clickable, text } from 'ember-cli-page-object';

export default {
  _clickOnCaptionsToggleButton: clickable('[data-test-captions-toggle-button]'),
  captionsToggleButtonText: text('[data-test-captions-toggle-button]'),

  async clickOnCaptionsToggleButton() {
    await this._clickOnCaptionsToggleButton();
    await animationsSettled();
  },

  clickOnMuteButton: clickable('[data-test-mute-button]'),
  muteButtonText: text('[data-test-mute-button]'),
  scope: '[data-test-call-controls]',
};
