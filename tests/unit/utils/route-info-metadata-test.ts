import RouteInfoMetadata, { RouteColorScheme } from 'codecrafters-frontend/utils/route-info-metadata';
import { module, test } from 'qunit';

module('Unit | Utility | route-info-metadata', function () {
  test('it can be instantiated', function (assert) {
    assert.ok(new RouteInfoMetadata());
  });

  test('it defines a property `colorScheme`, by default set to `RouteColorSheme.Light`', function (assert): void {
    assert.strictEqual(new RouteInfoMetadata().colorScheme, RouteColorScheme.Light);
  });
});
