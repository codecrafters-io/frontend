import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | dark-mode-toggle', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<DarkModeToggle />`);

    assert.dom().exists();

    // Template block usage:
    await render(hbs`
      <DarkModeToggle>
        template block text
      </DarkModeToggle>
    `);

    assert.dom().exists();
  });
});
