import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

// Dummy date to test against
const DUMMY_DATE = new Date('2023-08-24T10:35:31.681'); // No "Z" at the end, to be treated as local time

// Common formats used across the project
const COMMON_FORMAT_EXAMPLES = [
  ['P', '08/24/2023'], // equivalent of "L" in moment.js, used by default
  ['PPP', 'August 24th, 2023'], // equivalent of "LLL" in moment.js
  ['PPPp', 'August 24th, 2023 at 10:35 AM'], // equivalent of "LLL" in moment.js
];

// Default format is "P"
const DEFAULT_FORMAT = COMMON_FORMAT_EXAMPLES[0];

module('Integration | Helper | date-format', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders an empty string if passed an undefined date', async function (assert) {
    await render(hbs`{{date-format this.undefinedDate}}`);
    assert.dom(this.element).hasText('');
  });

  test('it renders an empty string if passed a null date', async function (assert) {
    this.set('nullDate', null);
    await render(hbs`{{date-format this.nullDate}}`);
    assert.dom(this.element).hasText('');
  });

  test('it renders a passed date with format "P" by default', async function (assert) {
    const [, expectedOutput] = DEFAULT_FORMAT;
    this.set('customDate', DUMMY_DATE);
    await render(hbs`{{date-format this.customDate}}`);
    assert.dom(this.element).hasText(expectedOutput);
  });

  // Generate an individual test for every common format example
  for (const [providedFormat, expectedOutput] of COMMON_FORMAT_EXAMPLES) {
    test(`it renders a passed date with custom format "${providedFormat}"`, async function (assert) {
      this.set('customDate', DUMMY_DATE);
      this.set('customFormat', providedFormat);
      await render(hbs`{{date-format this.customDate format=this.customFormat}}`);
      assert.dom(this.element).hasText(expectedOutput);
    });
  }
});
