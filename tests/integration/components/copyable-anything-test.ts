import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | copyable-anything', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CopyableAnything />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <CopyableAnything>
        template block text
      </CopyableAnything>
    `);

    assert.dom().hasText('template block text');
  });
});
