import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | language-guides', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can view language guides', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('course-stage-language-guide', {
      markdownForBeginner: 'In this stage, blah blah...',
      courseStage: redis.stages.models.sortBy('position')[1],
      language: python,
    });

    this.server.create('course-stage-solution', {
      changedFiles: [
        {
          diff: '@@ -1,10 +1,11 @@\n import socket  # noqa: F401\n\n\n def main():\n     server_socket = socket.create_server(("localhost", 6379), reuse_port=True)\n-    server_socket.accept() # wait for client\n+    connection, _ = server_socket.accept()\n+    connection.sendall(b"+PONG\\r\\n")\n\n\n if __name__ == "__main__":\n     main()\n',
          filename: 'app/main.py',
        },
      ],
      courseStage: redis.stages.models.sortBy('position')[1],
      language: python,
    });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    document.getElementById('language-guide-card')?.scrollIntoView();

    await coursePage.secondStageTutorialCard.clickOnRevealSolutionButton();

    await coursePage.languageGuideCard.clickOnToggleExplanationButton();
    assert.strictEqual(
      coursePage.languageGuideCard.text,
      'Hide explanation In this stage, blah blah…',
      'Language guide card displays the correct content',
    );

    await coursePage.languageGuideCard.clickOnToggleExplanationButton();
    assert.strictEqual(coursePage.languageGuideCard.text, 'Show explanation', 'Toggle explanation button hides explanation');
  });
});
