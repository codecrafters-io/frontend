import { module, test } from 'qunit';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import demoPage from 'codecrafters-frontend/tests/pages/demo-page';

module('Acceptance | demo page | file-contents-card', function (hooks) {
  setupApplicationTest(hooks);

  test('it works', async function (assert) {
    await demoPage.demoTabs.fileContentsCard.visit();
    assert.strictEqual(currentURL(), '/demo/file-contents-card', 'URL is correct');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.isVisible, 'component has rendered');
  });

  test('it allows toggling `isCollapsible` option', async function (assert) {
    await demoPage.demoTabs.fileContentsCard.visit();

    // isCollapsible is disabled by default
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.expandButton.isVisible, 'expand button is not present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.collapseButton.isVisible, 'collapse button is not present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.collapseButton.isVisible, 'collapse button is not present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.codeMirror.isVisible, 'CodeMirror is present');

    // enable isCollapsible
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('isCollapsible');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.expandButton.isVisible, 'expand button is not present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.header.collapseButton.isVisible, 'collapse button is present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.collapseButton.isVisible, 'collapse button is present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.codeMirror.isVisible, 'CodeMirror is present');

    // collapse the card by clicking on header
    await demoPage.demoTabs.fileContentsCard.component.header.click();
    assert.ok(demoPage.demoTabs.fileContentsCard.component.header.expandButton.isVisible, 'expand button is present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.collapseButton.isVisible, 'collapse button is not present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.collapseButton.isVisible, 'collapse button is not present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.codeMirror.isVisible, 'CodeMirror is not present');

    // expand the card by clicking on header
    await demoPage.demoTabs.fileContentsCard.component.header.click();
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.expandButton.isVisible, 'expand button is not present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.header.collapseButton.isVisible, 'collapse button is present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.collapseButton.isVisible, 'collapse button is present');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.codeMirror.isVisible, 'CodeMirror is present');

    // collapse the card by clicking Collapse button in the footer
    await demoPage.demoTabs.fileContentsCard.component.collapseButton.click();
    assert.ok(demoPage.demoTabs.fileContentsCard.component.header.expandButton.isVisible, 'expand button is present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.collapseButton.isVisible, 'collapse button is not present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.collapseButton.isVisible, 'collapse button is not present');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.codeMirror.isVisible, 'CodeMirror is not present');
  });

  test("it disables 'scrollIntoViewOnCollapse' option when 'isCollapsible' is unchecked", async function (assert) {
    await demoPage.demoTabs.fileContentsCard.visit();
    assert.ok(
      demoPage.demoTabs.fileContentsCard.findComponentOptionByText('scrollIntoViewOnCollapse').checkbox.isDisabled,
      'scrollIntoViewOnCollapse checkbox is disabled',
    );
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('isCollapsible');
    assert.notOk(
      demoPage.demoTabs.fileContentsCard.findComponentOptionByText('scrollIntoViewOnCollapse').checkbox.isDisabled,
      'scrollIntoViewOnCollapse checkbox is enabled',
    );
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('isCollapsible');
    assert.ok(
      demoPage.demoTabs.fileContentsCard.findComponentOptionByText('scrollIntoViewOnCollapse').checkbox.isDisabled,
      'scrollIntoViewOnCollapse checkbox is disabled',
    );
  });

  test("it disables 'headerTooltipText' option when 'isCollapsible' is unchecked", async function (assert) {
    await demoPage.demoTabs.fileContentsCard.visit();
    assert.ok(
      demoPage.demoTabs.fileContentsCard.findComponentOptionByText('headerTooltipText').checkbox.isDisabled,
      'headerTooltipText checkbox is disabled',
    );
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('isCollapsible');
    assert.notOk(
      demoPage.demoTabs.fileContentsCard.findComponentOptionByText('headerTooltipText').checkbox.isDisabled,
      'headerTooltipText checkbox is enabled',
    );
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('isCollapsible');
    assert.ok(
      demoPage.demoTabs.fileContentsCard.findComponentOptionByText('headerTooltipText').checkbox.isDisabled,
      'headerTooltipText checkbox is disabled',
    );
  });

  test("it allows toggling 'headerTooltipText' option", async function (assert) {
    await demoPage.demoTabs.fileContentsCard.visit();
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.header.tooltipBubble.isVisible, 'tooltip is not present');
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('isCollapsible');
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('headerTooltipText');
    await demoPage.demoTabs.fileContentsCard.component.header.click();
    await demoPage.demoTabs.fileContentsCard.component.header.hover();
    assert.ok(demoPage.demoTabs.fileContentsCard.component.header.tooltipBubble.isVisible, 'tooltip is present');
    assert.strictEqual(
      demoPage.demoTabs.fileContentsCard.component.header.tooltipBubble.text,
      'Example tooltip message',
      'correct tooltip message is displayed',
    );
  });

  test("it allows toggling 'foldGutter' option", async function (assert) {
    await demoPage.demoTabs.fileContentsCard.visit();
    assert.ok(demoPage.demoTabs.fileContentsCard.component.codeMirror.gutters.foldGutter.isVisible, 'fold gutter is present');
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('foldGutter');
    assert.notOk(demoPage.demoTabs.fileContentsCard.component.codeMirror.gutters.foldGutter.isVisible, 'fold gutter is not present');
    await demoPage.demoTabs.fileContentsCard.clickOnComponentOption('foldGutter');
    assert.ok(demoPage.demoTabs.fileContentsCard.component.codeMirror.gutters.foldGutter.isVisible, 'fold gutter is present again');
  });
});
