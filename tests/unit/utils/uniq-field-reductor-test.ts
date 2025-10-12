import uniqFieldReductor from 'codecrafters-frontend/utils/uniq-field-reductor';
import { module, test } from 'qunit';

module('Unit | Utility | uniq-field-reductor', function () {
  test('it filters an array of objects by unique properties', function (assert) {
    const arr = [
      { a: 1, b: 'unique-1' },
      { a: 1, b: 'non-unique' },
      { a: 2, b: 'unique-2' },
      { a: 3, b: 'non-unique' },
      { a: 1, b: 'non-unique' },
    ];

    assert.deepEqual(
      arr.reduce(uniqFieldReductor('a'), []),
      [
        { a: 1, b: 'unique-1' },
        { a: 2, b: 'unique-2' },
        { a: 3, b: 'non-unique' },
      ],
      'array is filtered to only contain objects with unique property a',
    );

    assert.deepEqual(
      arr.reduce(uniqFieldReductor('b'), []),
      [
        { a: 1, b: 'unique-1' },
        { a: 1, b: 'non-unique' },
        { a: 2, b: 'unique-2' },
      ],
      'array is filtered to only contain objects with unique property b',
    );
  });
});
