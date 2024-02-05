import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import syncRepositoryStageLists from 'codecrafters-frontend/mirage/utils/sync-repository-stage-lists';

module('Unit | Utility | sync-repository-stage-list', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test('it exists', function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    assert.strictEqual(repository.stageList.items.models.length, 6, 'repository has 2 stage list items');
    assert.strictEqual(repository.stageList.items.models[0].position, 1, 'first stage list item position is 1');
    assert.strictEqual(repository.stageList.items.models[1].position, 2, 'first stage list item position is 1');
    assert.strictEqual(repository.stageList.items.models[2].position, 3, 'third stage list item position is 3');
    assert.strictEqual(repository.stageList.items.models[3].position, 4, 'fourth stage list item position is 4');
    assert.strictEqual(repository.stageList.items.models[4].position, 5, 'third stage list item position is 5');
    assert.strictEqual(repository.stageList.items.models[5].position, 6, 'fourth stage list item position is 6');

    syncRepositoryStageLists(this.server);

    // No changes if repository state is the same
    assert.strictEqual(repository.stageList.items.models.length, 6, 'repository has 2 stage list items');
    assert.strictEqual(repository.stageList.items.models[0].position, 1, 'first stage list item position is 1');
    assert.strictEqual(repository.stageList.items.models[1].position, 2, 'second stage list item position is 2');
    assert.strictEqual(repository.stageList.items.models[2].position, 3, 'third stage list item position is 3');
    assert.strictEqual(repository.stageList.items.models[3].position, 4, 'fourth stage list item position is 4');
    assert.strictEqual(repository.stageList.items.models[4].position, 5, 'third stage list item position is 5');
    assert.strictEqual(repository.stageList.items.models[5].position, 6, 'fourth stage list item position is 6');

    const firstExtension = this.server.schema.courseExtensions.findBy({ slug: 'ext1' });
    const secondExtension = this.server.schema.courseExtensions.findBy({ slug: 'ext2' });
    assert.ok(firstExtension, 'extension exists');
    assert.ok(secondExtension, 'extension exists');

    const firstExtensionActivation = this.server.schema.courseExtensionActivations.findBy({ extensionId: firstExtension.id, repositoryId: repository.id })
    firstExtensionActivation.destroy();

    syncRepositoryStageLists(this.server);
    assert.strictEqual(repository.stageList.items.models.length, 4, 'repository has 4 stage list items');
    assert.strictEqual(repository.stageList.items.models[0].position, 1, 'first stage list item position is 1');
    assert.strictEqual(repository.stageList.items.models[1].position, 2, 'second stage list item position is 2');
    assert.strictEqual(repository.stageList.items.models[2].position, 3, 'third stage list item position is 3');
    assert.strictEqual(repository.stageList.items.models[3].position, 4, 'fourth stage list item position is 4');

    const secondExtensionActivation = this.server.schema.courseExtensionActivations.findBy({ extensionId: secondExtension.id, repositoryId: repository.id })
    secondExtensionActivation.destroy();

    syncRepositoryStageLists(this.server);
    assert.strictEqual(repository.stageList.items.models.length, 2, 'repository has 2 stage list items');
    assert.strictEqual(repository.stageList.items.models[0].position, 1, 'first stage list item position is 1');
    assert.strictEqual(repository.stageList.items.models[1].position, 2, 'second stage list item position is 2');
  });
});
