import { collection, create, visitable } from 'ember-cli-page-object';
import CourseCard from 'codecrafters-frontend/tests/pages/components/course-card';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default create({
  async clickOnCourse(courseName) {
    this.courseCards.toArray().findBy('name', courseName).click();
    await finishRender(); // Page has poller
  },

  courseCards: collection('[data-test-course-card]', CourseCard),
  visit: visitable('/courses'),
});
