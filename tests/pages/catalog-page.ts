import { clickable, collection, create, isPresent, visitable } from 'ember-cli-page-object';
import { waitUntil } from '@ember/test-helpers';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CourseCard from 'codecrafters-frontend/tests/pages/components/course-card';
import TrackCard from 'codecrafters-frontend/tests/pages/components/tracks-page/track-card';
import Header from 'codecrafters-frontend/tests/pages/components/header';
import helpscoutBeacon from 'codecrafters-frontend/tests/pages/components/helpscout-beacon';

export default create({
  accountDropdown: AccountDropdown,

  async clickOnCourse(courseName: string) {
    await waitUntil(() => this.courseCards.length > 0); // Ensure skeleton UI is gone

    await this.courseCards
      .toArray()
      .find((courseCard) => courseCard.name === courseName)!
      .click();
  },

  async clickOnTrack(trackName: string) {
    await waitUntil(() => this.trackCards.length > 0); // Ensure skeleton UI is gone

    await this.trackCards
      .toArray()
      .find((trackCard) => trackCard.name === trackName)!
      .click();
  },

  courseCards: collection('[data-test-course-card]', CourseCard),

  courseCardByName(name: string) {
    return this.courseCards.toArray().find((courseCard) => courseCard.name === name);
  },

  helpscoutBeacon: helpscoutBeacon,

  productWalkthroughFeatureSuggestion: {
    clickOnDismissButton: clickable('[data-test-dismiss-button]'),
    clickOnStartHereButton: clickable('[data-test-start-here-button]'),
    hasDismissButton: isPresent('[data-test-dismiss-button]'),
    scope: '[data-test-product-walkthrough-feature-suggestion]',
  },

  trackCards: collection('[data-test-track-card]', TrackCard),
  header: Header,
  visit: visitable('/catalog'),
});
