import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';
import { module, test } from 'qunit';

module('Unit | Utility | route-info-metadata', function () {
  test('it can be instantiated', function (assert) {
    assert.ok(new RouteInfoMetadata());
  });

  test('it defines a property `isDarkRoute`, false by default', function (assert) {
    assert.false(new RouteInfoMetadata().isDarkRoute);
  });
});
