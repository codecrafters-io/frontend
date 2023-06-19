import { collection, create, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CourseCard from 'codecrafters-frontend/tests/pages/components/course-card';
import TrackCard from 'codecrafters-frontend/tests/pages/components/tracks-page/track-card';
import Header from 'codecrafters-frontend/tests/pages/components/header';

import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default create({
  accountDropdown: AccountDropdown,

  async clickOnCourse(courseName) {
    this.courseCards.toArray().findBy('name', courseName).click();
    await finishRender(); // Page has poller
  },

  async clickOnTrack(trackName) {
    this.trackCards.toArray().findBy('name', trackName).click();
    await finishRender(); // Page has poller
  },

  courseCards: collection('[data-test-course-card]', CourseCard),
  trackCards: collection('[data-test-track-card]', TrackCard),
  header: Header,
  visit: visitable('/catalog'),
});
