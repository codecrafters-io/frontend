import { module, test } from 'qunit';

import { setupTest } from 'codecrafters-frontend/tests/helpers';

import ConceptGroup from 'codecrafters-frontend/models/concept-group';

module('Unit | Serializer | application', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('application');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('user', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });

  test('it replaces array with a single primary record in normalizeQueryRecordResponse', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('application');

    const dummyRecord = {
      id: 'c000000a-e004-4005-b009-cc09f2000000',
      type: 'concept-groups',
      attributes: {
        'concept-slugs': ['networking-protocols'],
        'description-markdown': '',
        slug: 'rust-primer',
        title: 'Rust Primer',
      },
      relationships: {
        author: {
          data: {
            id: '80000001-500e-4003-a00d-600000000002',
            type: 'users',
          },
        },
      },
    };

    const result = serializer.normalizeQueryRecordResponse(store, ConceptGroup, { data: [dummyRecord] }, null, 'queryRecord');

    assert.notOk(result.data instanceof Array, 'data should not be an Array');
    assert.ok(result.data instanceof Object, 'data should be an Object');
    assert.strictEqual(result.data.id, dummyRecord.id, 'IDs of objects should match');
  });

  test('it replaces array with null in normalizeQueryRecordResponse if data is empty', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('application');

    const result = serializer.normalizeQueryRecordResponse(store, ConceptGroup, { data: [] }, null, 'queryRecord');

    assert.strictEqual(result.data, null, 'data must be null');
  });
});
