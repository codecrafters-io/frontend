import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const SELECTOR_COMPONENT = '[data-test-code-mirror-component]';
const SELECTOR_EDITOR = `${SELECTOR_COMPONENT} > .cm-editor`;
const SELECTOR_SCROLLER = `${SELECTOR_EDITOR} > .cm-scroller`;
const SELECTOR_CONTENT = `${SELECTOR_SCROLLER} > .cm-content`;

module('Integration | Component | code-mirror', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<CodeMirror />`);
    assert.dom(SELECTOR_COMPONENT).exists();
    assert.dom(SELECTOR_EDITOR).exists();
    assert.dom(SELECTOR_SCROLLER).exists();
    assert.dom(SELECTOR_CONTENT).exists();
    await render(hbs`<CodeMirror>template block text</CodeMirror>`);
    assert.dom(SELECTOR_COMPONENT).exists();
    assert.dom(SELECTOR_EDITOR).exists();
    assert.dom(SELECTOR_SCROLLER).exists();
    assert.dom(SELECTOR_CONTENT).exists();
  });

  test('it renders passed document', async function (assert) {
    const exampleText = 'function myJavaScriptFunction() { return "hello world"; }';
    this.set('document', exampleText);
    await render(hbs`<CodeMirror @document={{this.document}} />`);
    assert.dom(SELECTOR_CONTENT).hasText(exampleText);
    await render(hbs`<CodeMirror @document={{this.document}}>template block text</CodeMirror>`);
    assert.dom(SELECTOR_CONTENT).hasText(exampleText);
  });
});
