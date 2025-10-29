import groupByFieldReducer from 'codecrafters-frontend/utils/group-by-field-reducer';
import { module, test } from 'qunit';

module('Unit | Utility | group-by-field-reducer', function () {
  test('it groups an array of objects by values of their field', function (assert) {
    const arr = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 1 }, { a: 2 }, { a: 4 }];

    const result = arr.reduce(
      groupByFieldReducer((obj) => obj.a),
      {},
    );
    assert.deepEqual(
      result,
      {
        1: [{ a: 1 }, { a: 1 }],
        2: [{ a: 2 }, { a: 2 }],
        3: [{ a: 3 }],
        4: [{ a: 4 }],
      },
      'array is correctly grouped by values of a field',
    );
  });
});
