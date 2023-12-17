import replaceMetaTag from 'codecrafters-frontend/utils/replace-meta-tag';
import { module, test } from 'qunit';

module('Unit | Utility | replace-meta-tag', function () {
  test('it exists and is a function', function (assert) {
    assert.ok(replaceMetaTag, 'it exists');
    assert.ok(replaceMetaTag instanceof Function, 'it is an instance of Function');
  });

  test('it overwrites content of specified meta tags in passed text', function (assert) {
    assert.strictEqual(
      replaceMetaTag('<meta property="og:image" content="old image">', 'property', 'og:image', 'new image'),
      '<meta property="og:image" content="new image">',
      'old content is replaced with new content',
    );
    assert.strictEqual(
      replaceMetaTag('<meta name="twitter:image" content="old twitter image">', 'name', 'twitter:image', 'new twitter image'),
      '<meta name="twitter:image" content="new twitter image">',
      'old twitter content is replaced with new content',
    );
    assert.strictEqual(
      replaceMetaTag(
        '<meta property="og:image" content="old image"><meta property="og:image" content="old image again">',
        'property',
        'og:image',
        'new image',
      ),
      '<meta property="og:image" content="new image"><meta property="og:image" content="new image">',
      'old content is replaced with new content twice in the input text',
    );
  });

  test('it supports both single and double quotes for attribute values', function (assert) {
    assert.strictEqual(
      replaceMetaTag('<meta property="og:image" content="old image">', 'property', 'og:image', 'new image'),
      '<meta property="og:image" content="new image">',
      'old content is replaced with new content when double-quotes are used',
    );
    assert.strictEqual(
      replaceMetaTag("<meta property='og:image' content='old image'>", 'property', 'og:image', 'new image'),
      "<meta property='og:image' content='new image'>",
      'old content is replaced with new content when single-quotes are used',
    );
  });

  test('it preserves the original text around replaced meta tags', function (assert) {
    assert.strictEqual(
      replaceMetaTag(
        '<meta foo="bar" content="top tag"><meta property="og:image" content="old image"><meta bar="baz" content="bottom tag">',
        'property',
        'og:image',
        'new image',
      ),
      '<meta foo="bar" content="top tag"><meta property="og:image" content="new image"><meta bar="baz" content="bottom tag">',
      'content around replaced tags is preserved',
    );
  });
});
