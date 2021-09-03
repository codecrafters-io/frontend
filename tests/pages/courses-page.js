import { collection, create, visitable } from 'ember-cli-page-object';
import CourseCard from 'codecrafters-frontend/tests/pages/components/course-card';

export default create({
  courseCards: collection('[data-test-course-card]', CourseCard),
  visit: visitable('/courses'),
});
