import parseDiffAsDocument from 'codecrafters-frontend/utils/parse-diff-as-document';
import { module, test } from 'qunit';

module('Unit | Utility | parse-diff-as-document', function () {
  test('it converts a diff to a document object', async function (assert) {
    const result = parseDiffAsDocument(' 1234\n+2345\n 6789\n-0123\n');
    assert.strictEqual(result.current, '1234\n2345\n6789\n', 'current document is parsed correctly');
    assert.strictEqual(result.original, '1234\n6789\n0123\n', 'original document is parsed correctly');
  });

  test('it does not break if passed an undefined diff', async function (assert) {
    const result = parseDiffAsDocument(undefined);
    assert.strictEqual(result.current, '', 'current document is an empty string');
    assert.strictEqual(result.original, '', 'original document is an empty string');
  });

  test('it strips "\\ No newline at end of file" messages from the diff', async function (assert) {
    const result = parseDiffAsDocument(' 1234\n\\ No newline at end of file\n+2345\n 6789\n-0123\n');
    assert.strictEqual(result.current, '1234\n2345\n6789\n', 'current document is parsed correctly');
    assert.strictEqual(result.original, '1234\n6789\n0123\n', 'original document is parsed correctly');
  });
});
