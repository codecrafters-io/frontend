import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | concept', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('changedAttributes works', async function (assert) {
    let store = this.owner.lookup('service:store');
    let concept = store.createRecord('concept', {});
    await concept.save();

    assert.strictEqual(JSON.stringify(concept.changedAttributes()), JSON.stringify({}));
    assert.ok(concept.id);

    concept.title = 'New Title';
    assert.ok(concept.hasDirtyAttributes, 'should have dirty attributes');
    assert.strictEqual(JSON.stringify(concept.changedAttributes()), JSON.stringify({ title: ['New Concept', 'New Title'] }));

    await concept.save();

    concept.title = 'New Title';

    assert.notOk(concept.hasDirtyAttributes, 'should have dirty attributes');
    assert.strictEqual(JSON.stringify(concept.changedAttributes()), JSON.stringify({}));
  });
});
