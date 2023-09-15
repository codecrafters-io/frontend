import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | enable-extensions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can enable extensions', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('course-extension', {
      course: redis,
      name: 'Persistence',
      slug: 'persistence',
      descriptionMarkdown: `In this challenge extension you'll add [persistence][redis-persistence] support to your Redis implementation.

Along the way you'll learn about Redis's [RDB file format][rdb-file-format], the [SAVE][save-command] command, and more.

[redis-persistence]: https://redis.io/docs/manual/persistence/
[rdb-file-format]: https://github.com/sripathikrishnan/redis-rdb-tools/blob/548b11ec3c81a603f5b321228d07a61a0b940159/docs/RDB_File_Format.textile
[save-command]: https://redis.io/commands/save/`,
    });

    this.server.create('course-extension', {
      course: redis,
      name: 'Replication',
      slug: 'replication',
      descriptionMarkdown: `In this challenge extension you'll add support for [Replication][1] to your Redis implementation.

Along the way you'll learn about how Redis's leader-follower replication works, the [WAIT][2] command, the [PSYNC][3] command and more.

[1]: https://redis.io/docs/manual/replication
[2]: https://redis.io/commands/wait/
[3]: https://redis.io/commands/psync/`,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'current URL is course page URL');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 9, 'step list has 9 items');

    await coursePage.sidebar.clickOnConfigureExtensionsButton();
    await coursePage.configureExtensionsModal.enableExtension('Persistence');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 11, 'step list has 3 items');
  });
});
