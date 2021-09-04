import { create, visitable } from 'ember-cli-page-object';
import SetupItem from 'codecrafters-frontend/tests/pages/components/course-page/step-list/setup-item';

export default create({
  setupItem: SetupItem,
  visit: visitable('/courses/next/:course_slug'),
});
