import { collection, text, visitable } from 'ember-cli-page-object';
import createPage from 'codecrafters-frontend/tests/support/create-page';

import finishRender from 'codecrafters-frontend/tests/support/finish-render';

export default createPage({
  visit: visitable('/users/:username'),
});
