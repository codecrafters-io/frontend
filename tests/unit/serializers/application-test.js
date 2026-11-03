import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';
import ConceptGroup from 'codecrafters-frontend/models/concept-group';
import { SERIALIZER_SHOEBOX_IDENTIFIER } from 'codecrafters-frontend/serializers/application';
import { stub } from 'sinon';

module('Unit | Serializer | application', function (hooks) {
  setupTest(hooks);

  function stubFastBootShoebox(owner) {
    const shoeboxContents = new Map();
    const fastboot = owner.lookup('service:fastboot');

    stub(fastboot, 'isFastBoot').value(true);
    stub(fastboot, 'shoebox').value({ put: (key, value) => shoeboxContents.set(key, value), retrieve: (key) => shoeboxContents.get(key) });

    return shoeboxContents;
  }

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

  test('it leaves stage instructions out of the FastBoot shoebox', function (assert) {
    const shoeboxContents = stubFastBootShoebox(this.owner);

    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('application');

    const stage = {
      id: 'c000000a-e004-4005-b009-cc09f2000001',
      type: 'course-stages',
      attributes: {
        name: 'Respond to PING',
        'community-solution-counts': { go: 3 },
        'description-markdown-template': 'Respond with +PONG',
        'marketing-markdown': 'Respond to the PING command',
      },
    };

    const result = serializer.normalize(store.modelFor('course-stage'), stage);
    const [shoeboxStage] = shoeboxContents.get(SERIALIZER_SHOEBOX_IDENTIFIER);

    assert.deepEqual(shoeboxStage.attributes, { name: 'Respond to PING' }, 'shoebox copy has no instructions');
    assert.strictEqual(result.data.attributes.descriptionMarkdownTemplate, 'Respond with +PONG', 'store still gets the instructions');
    assert.strictEqual(stage.attributes['description-markdown-template'], 'Respond with +PONG', 'payload is not changed');
  });

  test('it puts other records in the FastBoot shoebox unchanged', function (assert) {
    const shoeboxContents = stubFastBootShoebox(this.owner);

    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('application');

    const course = {
      id: 'c000000a-e004-4005-b009-cc09f2000002',
      type: 'courses',
      attributes: {
        name: 'Build your own Redis',
        'description-markdown': 'Redis is an in-memory data store.',
      },
    };

    serializer.normalize(store.modelFor('course'), course);

    assert.deepEqual(shoeboxContents.get(SERIALIZER_SHOEBOX_IDENTIFIER), [course]);
  });
});
