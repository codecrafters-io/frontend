import blendColors from 'codecrafters-frontend/utils/blend-colors';
import { module, test } from 'qunit';

module('Unit | Utility | blend-colors', function () {
  test('it blends a foreground color over background with given opacity', function (assert) {
    assert.ok(blendColors, 'it exists');
    assert.ok(blendColors instanceof Function, 'it is an instance of Function');
    assert.strictEqual(blendColors(), '#ffffff');
    assert.strictEqual(blendColors('x'), '#ffffff');
    assert.strictEqual(blendColors('x', 1, 'x'), '#ffffff');
    assert.strictEqual(blendColors('x', undefined, 'x'), '#ffffff');
    assert.strictEqual(blendColors('#aabbcc', undefined, '#99ccff'), '#aabbcc');
    assert.strictEqual(blendColors('#ffffff'), '#ffffff');
    assert.strictEqual(blendColors('#ffffff', 0.5), '#ffffff');
    assert.strictEqual(blendColors('#ffffff', 0.5, '#000000'), '#808080');
    assert.strictEqual(blendColors('#ffffff', 0.5, '#aabbcc'), '#d4dde6');
    assert.strictEqual(blendColors('#aabbcc', 0.3), '#e5ebf0');
    assert.strictEqual(blendColors('#aabbcc', 0.3, '#99ccff'), '#9ec7f0');
    assert.strictEqual(blendColors('#aabbcc', 0.5, '#99ccff'), '#a2c3e6');
    assert.strictEqual(blendColors('#aabbcc', 1, '#99ccff'), '#aabbcc');
  });
});
