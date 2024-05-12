import { module, test, skip } from 'qunit';
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

  module('Updating passed document', function () {
    test('it updates rendered document when @document changes', async function (assert) {
      const exampleText = 'function myJavaScriptFunction() { return "hello world"; }';
      const exampleTextUpdated = 'export const function myJavaScriptFunction() { return "hello world"; }';
      this.set('document', exampleText);
      await render(hbs`<CodeMirror @document={{this.document}} />`);
      assert.dom(SELECTOR_CONTENT).hasText(exampleText);
      this.set('document', exampleTextUpdated);
      assert.dom(SELECTOR_CONTENT).hasText(exampleTextUpdated);
    });
    skip('it resets edit history when @presereveHistory is false');
    skip('it preserves edit history when @presereveHistory is true');
  });

  module('Updating edited document', function () {
    skip('it calls @onDocumentUpdate when document is edited inside the editor');
  });

  module('Options', function () {
    module('allowMultipleSelections', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('allowMultipleSelections', true);
        await render(hbs`<CodeMirror @allowMultipleSelections={{this.allowMultipleSelections}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('allowMultipleSelections', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('autocompletion', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('autocompletion', true);
        await render(hbs`<CodeMirror @autocompletion={{this.autocompletion}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('autocompletion', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('bracketMatching', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('bracketMatching', true);
        await render(hbs`<CodeMirror @bracketMatching={{this.bracketMatching}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('bracketMatching', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('closeBrackets', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('closeBrackets', true);
        await render(hbs`<CodeMirror @closeBrackets={{this.closeBrackets}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('closeBrackets', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('crosshairCursor', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('crosshairCursor', true);
        await render(hbs`<CodeMirror @crosshairCursor={{this.crosshairCursor}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('crosshairCursor', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('drawSelection', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('drawSelection', true);
        await render(hbs`<CodeMirror @drawSelection={{this.drawSelection}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('drawSelection', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('dropCursor', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('dropCursor', true);
        await render(hbs`<CodeMirror @dropCursor={{this.dropCursor}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('dropCursor', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('editable', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('editable', true);
        await render(hbs`<CodeMirror @editable={{this.editable}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('editable', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('foldGutter', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('foldGutter', true);
        await render(hbs`<CodeMirror @foldGutter={{this.foldGutter}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('foldGutter', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('highlightActiveLine', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightActiveLine', true);
        await render(hbs`<CodeMirror @highlightActiveLine={{this.highlightActiveLine}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('highlightActiveLine', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('highlightSelectionMatches', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightSelectionMatches', true);
        await render(hbs`<CodeMirror @highlightSelectionMatches={{this.highlightSelectionMatches}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('highlightSelectionMatches', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('highlightSpecialChars', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightSpecialChars', true);
        await render(hbs`<CodeMirror @highlightSpecialChars={{this.highlightSpecialChars}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('highlightSpecialChars', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('highlightTrailingWhitespace', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightTrailingWhitespace', true);
        await render(hbs`<CodeMirror @highlightTrailingWhitespace={{this.highlightTrailingWhitespace}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('highlightTrailingWhitespace', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('highlightWhitespace', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightWhitespace', true);
        await render(hbs`<CodeMirror @highlightWhitespace={{this.highlightWhitespace}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('highlightWhitespace', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('history', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('history', true);
        await render(hbs`<CodeMirror @history={{this.history}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('history', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('indentOnInput', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('indentOnInput', true);
        await render(hbs`<CodeMirror @indentOnInput={{this.indentOnInput}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('indentOnInput', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('indentUnit', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('indentUnit', '  ');
        await render(hbs`<CodeMirror @indentUnit={{this.indentUnit}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('indentUnit', '\t');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('indentWithTab', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('indentWithTab', true);
        await render(hbs`<CodeMirror @indentWithTab={{this.indentWithTab}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('indentWithTab', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('filename', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('filename', 'javascript.js');
        await render(hbs`<CodeMirror @filename={{this.filename}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('filename', 'python.py');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('language', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('language', 'javascript');
        await render(hbs`<CodeMirror @language={{this.language}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('language', 'markdown');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('lineNumbers', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('lineNumbers', true);
        await render(hbs`<CodeMirror @lineNumbers={{this.lineNumbers}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('lineNumbers', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('lineSeparator', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('lineSeparator', '\n');
        await render(hbs`<CodeMirror @lineSeparator={{this.lineSeparator}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('lineSeparator', '\r\n');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('lineWrapping', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('lineWrapping', true);
        await render(hbs`<CodeMirror @lineWrapping={{this.lineWrapping}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('lineWrapping', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('mergeControls', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('mergeControls', true);
        await render(hbs`<CodeMirror @mergeControls={{this.mergeControls}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('mergeControls', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('originalDocument', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('originalDocument', 'original content');
        await render(hbs`<CodeMirror @originalDocument={{this.originalDocument}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('originalDocument', 'original content'); // trigger update with same content
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('originalDocument', 'original content modified');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('placeholder', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('placeholder', 'placeholder text');
        await render(hbs`<CodeMirror @placeholder={{this.placeholder}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('placeholder', 'placeholder text modified');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('readOnly', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('readOnly', true);
        await render(hbs`<CodeMirror @readOnly={{this.readOnly}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('readOnly', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('rectangularSelection', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('rectangularSelection', true);
        await render(hbs`<CodeMirror @rectangularSelection={{this.rectangularSelection}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('rectangularSelection', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('scrollPastEnd', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('scrollPastEnd', true);
        await render(hbs`<CodeMirror @scrollPastEnd={{this.scrollPastEnd}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('scrollPastEnd', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('syntaxHighlighting', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('syntaxHighlighting', true);
        await render(hbs`<CodeMirror @syntaxHighlighting={{this.syntaxHighlighting}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('syntaxHighlighting', false);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('tabSize', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('tabSize', 2);
        await render(hbs`<CodeMirror @tabSize={{this.tabSize}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('tabSize', 4);
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
    module('theme', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('theme', 'githubLight');
        await render(hbs`<CodeMirror @theme={{this.theme}} />`);
        assert.dom(SELECTOR_CONTENT).exists();
        this.set('theme', 'githubDark');
        assert.dom(SELECTOR_CONTENT).exists();
      });
      skip('it does something useful with the editor');
    });
  });
});
