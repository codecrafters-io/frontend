import { collection, create, text } from 'ember-cli-page-object';

export default create({
  screencastPreviews: collection('[data-test-screencasts-previews]', {
    titleText: text('[data-test-screencasts-previews-title]'),
  }),
});
