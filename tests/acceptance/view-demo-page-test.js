import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';

const SELECTOR_COMPONENT = '[data-test-code-mirror-component]';

module('Acceptance | view demo page', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /demo redirects to /demo/code-mirror', async function (assert) {
    await visit('/demo');
    assert.strictEqual(currentURL(), '/demo/code-mirror');
  });

  module('CodeMirror', function () {
    test('visiting /demo/code-mirror renders a CodeMirror editor', async function (assert) {
      await visit('/demo/code-mirror');
      assert.dom(SELECTOR_COMPONENT).exists();
    });
  });
});
