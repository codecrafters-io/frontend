import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import { module, test } from 'qunit';

module('Unit | Utility | field-comparator', function () {
  test('sorts an array of objects by one or more of their fields', function (assert) {
    const arr = [{ a: 3, b: 2 }, { a: 3, b: 1 }, { a: 2 }, { a: 1 }];

    assert.deepEqual(arr.toSorted(fieldComparator('a')), [{ a: 1 }, { a: 2 }, { a: 3, b: 2 }, { a: 3, b: 1 }], 'array is sorted by one key');
    assert.deepEqual(arr.toSorted(fieldComparator('a', 'b')), [{ a: 1 }, { a: 2 }, { a: 3, b: 1 }, { a: 3, b: 2 }], 'array is sorted by two keys');
  });
});
