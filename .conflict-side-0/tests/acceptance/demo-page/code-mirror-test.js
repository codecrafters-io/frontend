import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import demoPage from 'codecrafters-frontend/tests/pages/demo-page';

module('Acceptance | demo page | code-mirror', function (hooks) {
  setupApplicationTest(hooks);

  test('it works', async function (assert) {
    await demoPage.demoTabs.codeMirror.visit();
    assert.strictEqual(currentURL(), '/demo/code-mirror', 'URL is correct');
    assert.ok(demoPage.demoTabs.codeMirror.component.hasRendered, 'component has rendered');
  });
});
