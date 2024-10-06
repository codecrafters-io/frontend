import blendColors from 'codecrafters-frontend/utils/blend-colors';
import { module, test } from 'qunit';

module('Unit | Utility | blend-colors', function () {
  test('it blends a foreground color over background with given opacity', function (assert) {
    assert.ok(blendColors, 'it exists');
    assert.ok(blendColors instanceof Function, 'it is an instance of Function');
    assert.strictEqual(blendColors('#ffffff', 0.5), '#ffffff');
    assert.strictEqual(blendColors('#ffffff', 0.5, '#000000'), '#ffffff');
    assert.strictEqual(blendColors('#ffffff', 0.5, '#aabbcc'), '#d4dde5');
    assert.strictEqual(blendColors('#aabbcc', 0.3), '#e5eaef');
    assert.strictEqual(blendColors('#aabbcc', 0.3, '#99ccff'), '#9ec6ef');
    assert.strictEqual(blendColors('#aabbcc', 0.5, '#99ccff'), '#a1c3e5');
    assert.strictEqual(blendColors('#aabbcc', 1, '#99ccff'), '#aabbcc');
  });
});
