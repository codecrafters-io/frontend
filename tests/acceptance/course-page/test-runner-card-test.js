import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | test-runner-card', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('suggests Git by default for stage 2', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/stages/2', 'current URL is course page URL');

    await coursePage.testRunnerCard.click(); // Expand to view instructions

    assert.strictEqual(coursePage.testRunnerCard.copyableTerminalCommands.length, 1, 'only one copyable terminal command is present by default');

    assert.deepEqual(coursePage.testRunnerCard.copyableTerminalCommands[0].commands, [
      'git add .',
      'git commit --allow-empty -m "pass stage" # any message',
      'git push origin master',
    ]);

    await coursePage.testRunnerCard.clickOnToggleAlternateClientInstructionsLink();

    assert.strictEqual(coursePage.testRunnerCard.copyableTerminalCommands.length, 2, 'two copyable terminal commands are present');
    assert.deepEqual(coursePage.testRunnerCard.copyableTerminalCommands[1].commands, ['codecrafters test']);

    await coursePage.testRunnerCard.clickOnToggleAlternateClientInstructionsLink();
    assert.strictEqual(coursePage.testRunnerCard.copyableTerminalCommands.length, 1, 'only one copyable terminal command is present by default');
  });

  test('suggests CLI by default for stage 3', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/stages/3', 'current URL is course page URL');

    await coursePage.testRunnerCard.click(); // Expand to view instructions

    assert.strictEqual(coursePage.testRunnerCard.copyableTerminalCommands.length, 1, 'only one copyable terminal command is present by default');
    assert.deepEqual(coursePage.testRunnerCard.copyableTerminalCommands[0].commands, ['codecrafters test']);

    await coursePage.testRunnerCard.clickOnToggleAlternateClientInstructionsLink();

    assert.strictEqual(coursePage.testRunnerCard.copyableTerminalCommands.length, 2, 'two copyable terminal commands are present');
    assert.deepEqual(coursePage.testRunnerCard.copyableTerminalCommands[1].commands, [
      'git add .',
      'git commit --allow-empty -m "pass stage" # any message',
      'git push origin master',
    ]);

    await coursePage.testRunnerCard.clickOnToggleAlternateClientInstructionsLink();
    assert.strictEqual(coursePage.testRunnerCard.copyableTerminalCommands.length, 1, 'only one copyable terminal command is present by default');
  });
});
