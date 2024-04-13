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

  module('Formatting', function () {
    skip('it shows line numbers when @lineNumbers is true');
    skip('it shows collapse controls when @collapseControls is true');
    skip('it formats passed document according to language');
  });

  module('Updating passed document', function () {
    skip('it updates rendered document when @document changes');
    skip('it replaces edit history when @replaceHistoryOnDocumentUpdate is true');
    skip('it preserves edit history when @replaceHistoryOnDocumentUpdate is false');
  });

  module('Edit Mode', function () {
    skip('it uses read-only mode when @readOnly is true');
    skip('it calls @onChange when document is modified in the editor');
    skip('it shows an unsaved indicator when there are unsaved changes');
    skip('it saves changes immediately when @autoSave is enabled');
    skip('it calls @onDirtyChanged when state of saved changes changes');
    skip('it shows a confirmation when leaving the page with unsaved changes');
  });

  module('Line Comments', function () {
    skip('it shows number of comments next to each line when @lineCommentCounters is true');
    skip('it shows an "Add Comment" button when there are no comments and @lineCommentButton is true');
    skip('it shows line comments when comments count is clicked');
    skip('it shows line comments when "Add Comment" button is clicked');
    skip('it shows a new comment comment after it is added');
    skip('it replaces "Add Comment" button with comments count after comment is added');
    skip('it hides line comments if all comments are deleted');
    skip('it replaces comments count with "Add Comment" button if all comments are deleted');
  });

  module('Diff Editor', function () {
    skip('it uses unified view when @diffUnifiedView is true, or split view otherwise');
    module('Unified View', function () {
      skip('it updates original document when @originalDocument changes');
      skip('it updates rendered document when @document changes');
      skip('it replaces edit history when @replaceHistoryOnDocumentUpdate is true');
      skip('it preserves edit history when @replaceHistoryOnDocumentUpdate is false');
      skip('it uses read-only mode when @readOnly is true');
      skip('it shows a collapse controls gutter when @collapseControls is true');
      skip('it shows a line numbers gutter when @lineNumbers is true');
      skip('it shows merge controls when @diffMergeControls is true');
      skip('it calls @onChange when document is modified in the editor');
      skip('it allows collapsing unchanged lines');
    });
    module('Split View', function () {
      skip('it updates original document when @originalDocument changes');
      skip('it updates rendered document when @document changes');
      skip('it replaces edit history when @replaceHistoryOnDocumentUpdate is true');
      skip('it preserves edit history when @replaceHistoryOnDocumentUpdate is false');
      skip('it uses read-only mode when @readOnly is true');
      skip('it shows two collapse controls gutters in split view mode when @collapseControls is true');
      skip('it shows two line numbers gutters when @lineNumbers is true');
      skip('it shows merge controls when @diffMergeControls is true');
      skip('it calls @onChange when document is modified in the editor');
      skip('it allows collapsing unchanged lines');
    });
  });
});
