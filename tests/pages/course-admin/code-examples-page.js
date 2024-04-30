import { visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  visit: visitable('/courses/:course_slug/admin/code-examples/:code_example_id'),
});
