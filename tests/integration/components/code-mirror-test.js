import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { blurrable, create, clickable, collection, fillable, focusable, text } from 'ember-cli-page-object';
import { alias } from 'ember-cli-page-object/macros';

const codeMirror = create({
  scope: '[data-test-code-mirror-component]',
  componentText: text(),

  editor: {
    scope: '> .cm-editor',
    scroller: {
      scope: '> .cm-scroller',
      content: {
        scope: '> .cm-content',
        text: text(),
        focus: focusable(),
        blur: blurrable(),
        lines: collection('> .cm-line', {
          click: clickable(),
          fillIn: fillable(),
        }),
      },
    },
  },

  content: alias('editor.scroller.content'),

  hasRendered: alias('content.isPresent'),
  text: alias('content.text'),
});

module('Integration | Component | code-mirror', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<CodeMirror />`);
    assert.ok(codeMirror.isPresent);
    assert.ok(codeMirror.editor.isPresent);
    assert.ok(codeMirror.editor.scroller.isPresent);
    assert.ok(codeMirror.editor.scroller.content.isPresent);
    assert.ok(codeMirror.hasRendered);
    assert.strictEqual(codeMirror.componentText, '');
    assert.strictEqual(codeMirror.text, '');
  });

  test('it renders (block form)', async function (assert) {
    await render(hbs`<CodeMirror>template block text</CodeMirror>`);
    assert.ok(codeMirror.isPresent);
    assert.ok(codeMirror.editor.isPresent);
    assert.ok(codeMirror.editor.scroller.isPresent);
    assert.ok(codeMirror.editor.scroller.content.isPresent);
    assert.ok(codeMirror.hasRendered);
    assert.strictEqual(codeMirror.componentText, 'template block text');
    assert.strictEqual(codeMirror.text, '');
  });

  test('it renders passed document', async function (assert) {
    const exampleText = 'function myJavaScriptFunction() { return "hello world"; }';
    this.set('document', exampleText);
    await render(hbs`<CodeMirror @document={{this.document}} />`);
    assert.strictEqual(codeMirror.text, exampleText);
  });

  test('it renders passed document (block form)', async function (assert) {
    const exampleText = 'function myJavaScriptFunction() { return "hello world"; }';
    this.set('document', exampleText);
    await render(hbs`<CodeMirror @document={{this.document}}>template block text</CodeMirror>`);
    assert.strictEqual(codeMirror.componentText, `template block text ${exampleText}`);
    assert.strictEqual(codeMirror.text, exampleText);
  });

  module('Updating passed document', function () {
    test('it updates rendered document when @document changes', async function (assert) {
      const exampleText = 'function myJavaScriptFunction() { return "hello world"; }';
      const exampleTextUpdated = 'export const function myJavaScriptFunction() { return "hello world"; }';
      this.set('document', exampleText);
      await render(hbs`<CodeMirror @document={{this.document}} />`);
      assert.strictEqual(codeMirror.text, exampleText);
      this.set('document', exampleTextUpdated);
      assert.strictEqual(codeMirror.text, exampleTextUpdated);
    });

    skip('it resets edit history when @presereveHistory is false');

    skip('it preserves edit history when @presereveHistory is true');
  });

  module('Updating edited document', function () {
    test('it calls @onDocumentUpdate when document is edited inside the editor', async function (assert) {
      const exampleText = 'function myJavaScriptFunction() { return "hello world"; }';
      let callCount = 0;

      const documentDidChange = (_target, newValue) => {
        callCount++;
        assert.strictEqual(newValue, 'New Content', 'new value is passed to onDocumentUpdate');

        if (newValue !== this.document) {
          this.set('document', newValue);
        }
      };

      this.set('document', exampleText);
      this.set('documentDidChange', documentDidChange);
      await render(hbs`<CodeMirror @document={{this.document}} @editable={{true}} @onDocumentUpdate={{fn this.documentDidChange this}} />`);
      assert.strictEqual(codeMirror.text, exampleText, 'initial text is rendered');
      await codeMirror.content.focus();
      await codeMirror.content.lines.objectAt(0).click();
      await codeMirror.content.lines.objectAt(0).fillIn('New Content');
      await codeMirror.content.blur();
      assert.strictEqual(callCount, 1, 'onDocumentUpdate is called once');
      assert.strictEqual(codeMirror.text, 'New Content', 'text in the editor is updated');
    });
  });

  module('Options', function () {
    module('allowMultipleSelections', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('allowMultipleSelections', true);
        await render(hbs`<CodeMirror @allowMultipleSelections={{this.allowMultipleSelections}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('allowMultipleSelections', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('autocompletion', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('autocompletion', true);
        await render(hbs`<CodeMirror @autocompletion={{this.autocompletion}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('autocompletion', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('bracketMatching', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('bracketMatching', true);
        await render(hbs`<CodeMirror @bracketMatching={{this.bracketMatching}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('bracketMatching', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('closeBrackets', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('closeBrackets', true);
        await render(hbs`<CodeMirror @closeBrackets={{this.closeBrackets}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('closeBrackets', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('crosshairCursor', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('crosshairCursor', true);
        await render(hbs`<CodeMirror @crosshairCursor={{this.crosshairCursor}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('crosshairCursor', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('drawSelection', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('drawSelection', true);
        await render(hbs`<CodeMirror @drawSelection={{this.drawSelection}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('drawSelection', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('dropCursor', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('dropCursor', true);
        await render(hbs`<CodeMirror @dropCursor={{this.dropCursor}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('dropCursor', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('editable', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('editable', true);
        await render(hbs`<CodeMirror @editable={{this.editable}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('editable', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('foldGutter', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('foldGutter', true);
        await render(hbs`<CodeMirror @foldGutter={{this.foldGutter}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('foldGutter', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('highlightActiveLine', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightActiveLine', true);
        await render(hbs`<CodeMirror @highlightActiveLine={{this.highlightActiveLine}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('highlightActiveLine', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('highlightSelectionMatches', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightSelectionMatches', true);
        await render(hbs`<CodeMirror @highlightSelectionMatches={{this.highlightSelectionMatches}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('highlightSelectionMatches', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('highlightSpecialChars', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightSpecialChars', true);
        await render(hbs`<CodeMirror @highlightSpecialChars={{this.highlightSpecialChars}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('highlightSpecialChars', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('highlightTrailingWhitespace', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightTrailingWhitespace', true);
        await render(hbs`<CodeMirror @highlightTrailingWhitespace={{this.highlightTrailingWhitespace}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('highlightTrailingWhitespace', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('highlightWhitespace', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('highlightWhitespace', true);
        await render(hbs`<CodeMirror @highlightWhitespace={{this.highlightWhitespace}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('highlightWhitespace', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('history', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('history', true);
        await render(hbs`<CodeMirror @history={{this.history}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('history', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('indentOnInput', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('indentOnInput', true);
        await render(hbs`<CodeMirror @indentOnInput={{this.indentOnInput}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('indentOnInput', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('indentUnit', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('indentUnit', '  ');
        await render(hbs`<CodeMirror @indentUnit={{this.indentUnit}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('indentUnit', '\t');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('indentWithTab', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('indentWithTab', true);
        await render(hbs`<CodeMirror @indentWithTab={{this.indentWithTab}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('indentWithTab', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('filename', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('filename', 'javascript.js');
        await render(hbs`<CodeMirror @filename={{this.filename}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('filename', 'python.py');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('language', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('language', 'javascript');
        await render(hbs`<CodeMirror @language={{this.language}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('language', 'markdown');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('lineNumbers', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('lineNumbers', true);
        await render(hbs`<CodeMirror @lineNumbers={{this.lineNumbers}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('lineNumbers', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('lineSeparator', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('lineSeparator', '\n');
        await render(hbs`<CodeMirror @lineSeparator={{this.lineSeparator}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('lineSeparator', '\r\n');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('lineWrapping', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('lineWrapping', true);
        await render(hbs`<CodeMirror @lineWrapping={{this.lineWrapping}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('lineWrapping', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('mergeControls', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('mergeControls', true);
        await render(hbs`<CodeMirror @mergeControls={{this.mergeControls}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('mergeControls', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('originalDocument', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('originalDocument', 'original content');
        await render(hbs`<CodeMirror @originalDocument={{this.originalDocument}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('originalDocument', 'original content'); // trigger update with same content
        assert.ok(codeMirror.hasRendered);
        this.set('originalDocument', 'original content modified');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('placeholder', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('placeholder', 'placeholder text');
        await render(hbs`<CodeMirror @placeholder={{this.placeholder}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('placeholder', 'placeholder text modified');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('readOnly', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('readOnly', true);
        await render(hbs`<CodeMirror @readOnly={{this.readOnly}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('readOnly', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('rectangularSelection', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('rectangularSelection', true);
        await render(hbs`<CodeMirror @rectangularSelection={{this.rectangularSelection}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('rectangularSelection', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('scrollPastEnd', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('scrollPastEnd', true);
        await render(hbs`<CodeMirror @scrollPastEnd={{this.scrollPastEnd}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('scrollPastEnd', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('syntaxHighlighting', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('syntaxHighlighting', true);
        await render(hbs`<CodeMirror @syntaxHighlighting={{this.syntaxHighlighting}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('syntaxHighlighting', false);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('tabSize', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('tabSize', 2);
        await render(hbs`<CodeMirror @tabSize={{this.tabSize}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('tabSize', 4);
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });

    module('theme', function () {
      test("it doesn't break the editor when passed", async function (assert) {
        this.set('theme', 'githubLight');
        await render(hbs`<CodeMirror @theme={{this.theme}} />`);
        assert.ok(codeMirror.hasRendered);
        this.set('theme', 'githubDark');
        assert.ok(codeMirror.hasRendered);
      });

      skip('it does something useful with the editor');
    });
  });
});
