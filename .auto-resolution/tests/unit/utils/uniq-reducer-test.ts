import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';
import { module, test } from 'qunit';

module('Unit | Utility | uniq-reducer', function () {
  test('it filters an array of objects and returns only unique objects', function (assert) {
    const objectA = new (class MyClassA {
      name = 'a';
    })();
    const objectB = new (class MyClassB {
      name = 'b';
    })();
    const objectC = new (class MyClassC {
      name = 'c';
    })();

    const arr = [1, objectA, objectA, objectB, objectC, objectA, objectB, objectC, objectC, 42, objectB, 1];

    assert.deepEqual(arr.reduce(uniqReducer(), []), [1, objectA, objectB, objectC, 42], 'array is filtered to only contain unique objects');
  });
});
