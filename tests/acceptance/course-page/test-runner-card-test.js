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

  test('suggests CLI by default for stage 2', async function (assert) {
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

    assert.strictEqual(
      coursePage.testRunnerCard.copyableTerminalCommands[0].copyableText,
      'codecrafters test # Visit https://codecrafters.io/cli to install',
      'copyable text mentions cli by default',
    );

    await coursePage.testRunnerCard.copyableTerminalCommands[0].clickOnVariantButton('git');

    assert.strictEqual(
      coursePage.testRunnerCard.copyableTerminalCommands[0].copyableText,
      ['git add .', 'git commit --allow-empty -m "pass stage" # any message', 'git push origin master'].join(' '),
      'copyable text is updated to include git commands',
    );

    await coursePage.testRunnerCard.copyableTerminalCommands[0].clickOnVariantButton('codecrafters cli');

    assert.strictEqual(
      coursePage.testRunnerCard.copyableTerminalCommands[0].copyableText,
      'codecrafters test # Visit https://codecrafters.io/cli to install',
      'copyable text mentions cli after switching back',
    );
  });
});
