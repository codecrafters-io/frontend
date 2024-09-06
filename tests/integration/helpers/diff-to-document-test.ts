import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | diff-to-document', function (hooks) {
  setupRenderingTest(hooks);

  test('it converts a diff to a document object', async function (assert) {
    await render(hbs`
      {{#let (diff-to-document ' 1234\n+2345\n 6789\n') as |doc|}}
        <pre data-test-current-document>{{doc.current}}</pre>
        <pre data-test-original-document>{{doc.original}}</pre>
      {{/let}}
    `);

    assert.dom('[data-test-current-document]').hasText(/^1234\n2345\n6789\n$/);
    assert.dom('[data-test-original-document]').hasText(/^1234\n6789\n$/);
  });
});
