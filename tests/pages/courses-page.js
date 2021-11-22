import { collection, create, visitable } from 'ember-cli-page-object';
import AccountDropdown from 'codecrafters-frontend/tests/pages/components/account-dropdown';
import CourseCard from 'codecrafters-frontend/tests/pages/components/course-card';
import SubscribeModal from 'codecrafters-frontend/tests/pages/components/subscribe-modal';

import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default create({
  accountDropdown: AccountDropdown,

  async clickOnCourse(courseName) {
    this.courseCards.toArray().findBy('name', courseName).click();
    await finishRender(); // Page has poller
  },

  courseCards: collection('[data-test-course-card]', CourseCard),
  subscribeModal: SubscribeModal,
  visit: visitable('/courses'),
});
