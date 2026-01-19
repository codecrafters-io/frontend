import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import type { TestContext } from '@ember/test-helpers';

interface HtmlSafeTestContext extends TestContext {
  someObject: { unsafeStringProperty: string };
}

module('Integration | Helper | html-safe', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders html code passed as a string', async function (this: HtmlSafeTestContext, assert) {
    this.set('someObject', { unsafeStringProperty: '<span data-test-safe-string-span />' });

    await render<HtmlSafeTestContext>(hbs`{{html-safe this.someObject.unsafeStringProperty}}`);

    assert.dom('[data-test-safe-string-span]').exists('test element is rendered');

    document.querySelector('[data-test-safe-string-span]')?.setAttribute('testAttribute', 'foo');

    assert.dom('[data-test-safe-string-span]').hasAttribute('testAttribute', 'foo', 'test element has the test attribute');

    this.set('someObject', { unsafeStringProperty: '<span data-test-safe-string-span />' });

    // Ensure `testAttribute` is still present, which means that the
    // element didn't get re-inserted after `someObject` had been set
    // to a new object with the same `unsafeStringProperty` string
    assert.dom('[data-test-safe-string-span]').hasAttribute('testAttribute', 'foo', 'test element still has the test attribute');

    this.set('someObject', { unsafeStringProperty: '<span data-test-safe-string-span-2 />' });

    assert.dom('[data-test-safe-string-span]').doesNotExist('test element is un-rendered');
    assert.dom('[data-test-safe-string-span-2]').exists('second test element is rendered');

    this.set('someObject', {});

    assert.dom('[data-test-safe-string-span]').doesNotExist('test element is un-rendered');
    assert.dom('[data-test-safe-string-span-2]').doesNotExist('second test element is un-rendered');
  });
});
