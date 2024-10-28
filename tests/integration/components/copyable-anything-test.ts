import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { spy } from 'sinon';
import { timeout } from 'ember-concurrency';
import config from 'codecrafters-frontend/config/environment';

module('Integration | Component | copyable-anything', function (hooks) {
  setupRenderingTest(hooks);

  test('it copies passed `@value` to clipboard when yielded `performCopyTask` is called', async function (assert) {
    await render(hbs`
      <CopyableAnything @value="Test value for copying" as |performCopyTask|>
        <button data-test-copy-button type="button" {{on "click" performCopyTask}} />
      </CopyableAnything>
    `);
    assert.strictEqual(await navigator.clipboard.readText(), '', 'clipboard is initially empty');
    await click('[data-test-copy-button]');
    assert.strictEqual(await navigator.clipboard.readText(), 'Test value for copying', 'clipboard contains expected text');
  });

  test('it calls an optional `@onCopied` callback after copying', async function (assert) {
    const callback = spy();
    this.set('onCopiedCallback', callback);
    await render(hbs`
      {{! @glint-expect-error it thinks onCopiedCallback is not defined}}
      <CopyableAnything @onCopied={{this.onCopiedCallback}} as |performCopyTask|>
        <button data-test-copy-button type="button" {{on "click" performCopyTask}} />
      </CopyableAnything>
    `);
    await click('[data-test-copy-button]');
    assert.ok(callback.calledOnce, 'callback was called once');
  });

  /**
   * Requires browser to be in focus
   */
  test('it yields a `hasRecentlyCopied` boolean, true for a configured interval after copying', async function (assert) {
    await render(hbs`
      <CopyableAnything as |performCopyTask hasRecentlyCopied|>
        <button data-test-copy-button type="button" {{on "click" performCopyTask}} />
        <span data-test-copy-button-text>{{if hasRecentlyCopied "COPIED!" "COPY"}}</span>
      </CopyableAnything>
    `);
    assert.dom('[data-test-copy-button-text]').hasText('COPY');
    click('[data-test-copy-button]'); // Do not await
    await timeout(config.x.copyConfirmationTimeout / 2); // Await for hasRecentlyCopied to propagate
    assert.dom('[data-test-copy-button-text]').hasText('COPIED!');
    await timeout(config.x.copyConfirmationTimeout); // Await for hasRecentlyCopied to revert
    assert.dom('[data-test-copy-button-text]').hasText('COPY');
  });

  /**
   * Requires browser to be in focus
   */
  test('it does nothing when `@isDisabled` is true', async function (assert) {
    const callback = spy();
    this.set('onCopiedCallback', callback);
    await render(hbs`
      <CopyableAnything
        @value="Test value for copying"
        @isDisabled={{true}}
        {{! @glint-expect-error it thinks onCopiedCallback is not defined}}
        @onCopied={{this.onCopiedCallback}}
      as |performCopyTask hasRecentlyCopied|>
        <button data-test-copy-button type="button" {{on "click" performCopyTask}} />
        <span data-test-copy-button-text>{{if hasRecentlyCopied "COPIED!" "COPY"}}</span>
      </CopyableAnything>
    `);
    click('[data-test-copy-button]'); // Do not await
    await timeout(config.x.copyConfirmationTimeout / 2); // Await for hasRecentlyCopied to propagate
    assert.dom('[data-test-copy-button-text]').hasText('COPY');
    await timeout(config.x.copyConfirmationTimeout); // Await for hasRecentlyCopied to revert
    assert.dom('[data-test-copy-button-text]').hasText('COPY');
    assert.ok(callback.notCalled, 'callback was not called when @isDisabled is true');
    assert.strictEqual(await navigator.clipboard.readText(), '', 'clipboard is not written when @isDisabled is true');
  });
});
