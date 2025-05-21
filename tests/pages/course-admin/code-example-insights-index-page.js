import { create, visitable, text, collection } from 'ember-cli-page-object';
import LanguageDropdown from 'codecrafters-frontend/tests/pages/components/course-admin/language-dropdown';

export default create({
  visit: visitable('/courses/:course_slug/admin/code-examples'),

  languageDropdown: LanguageDropdown,

  stageListItems: collection('[data-test-code-example-insights-index-list-item]', {
    text: text(),
  }),

  scope: '[data-test-code-example-insights-index-page]',
});
