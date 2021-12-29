import { create, clickOnText, visitable } from 'ember-cli-page-object';

export default create({
  clickOnLink: clickOnText(),
  visit: visitable('/admin/courses/:course_slug'),
});
