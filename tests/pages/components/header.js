import { clickable } from 'ember-cli-page-object';

export default {
  clickOnTracksLink: clickable('[data-test-tracks-link]'),
  scope: '[data-test-header]',
};
