import { collection, create, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CheckoutSessionSuccessfulModal from 'codecrafters-frontend/tests/pages/components/checkout-session-successful-modal';
import TrackCard from 'codecrafters-frontend/tests/pages/components/tracks-page/track-card';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import SubscribeModal from 'codecrafters-frontend/tests/pages/components/subscribe-modal';

import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default create({
  accountDropdown: AccountDropdown,

  async clickOnTrack(trackName) {
    this.trackCards.toArray().findBy('name', trackName).click();
    await finishRender(); // Page has poller
  },

  trackCards: collection('[data-test-track-card]', TrackCard),
  header: Header,
  visit: visitable('/tracks'),
});
