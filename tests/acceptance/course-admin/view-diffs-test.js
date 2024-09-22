import submissionsPage from 'codecrafters-frontend/tests/pages/course-admin/submissions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-diffs', function (hooks) {
  setupApplicationTest(hooks);

  test('collapsed lines placeholders show correct number of lines and expand when clicked', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    let submission = this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[2],
    });

    submission.update('changedFiles', [
      {
        filename: 'server.rb',
        diff: `    end

    def taste
      loop do
        @server.lick
      end
    end

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
    def taste
      loop do
        @server.lick
      end
    end

    def taste
      loop do
        @server.lick
      end
    end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        client.write("+PONG\\r\\n")
      end
    end

    def feel
      loop do
        @server.touch
      end
    end
  end`,
      },
    ]);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      3,
      'There should be three collapsed lines placeholders',
    );

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[0].text,
      '⦚ 8 unchanged lines ⦚',
      'The first placeholder should show correct number of lines',
    );

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[1].text,
      '⦚ 4 unchanged lines ⦚',
      'The second placeholder should show correct number of lines',
    );

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[2].text,
      '⦚ 7 unchanged lines ⦚',
      'The third placeholder should show correct number of lines',
    );

    await submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[0].click();

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      2,
      'The first placeholder should be expanded after clicking',
    );

    await submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[0].click();

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      1,
      'The second placeholder should be expanded after clicking',
    );

    await submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[0].click();

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      0,
      'The third placeholder should be expanded after clicking',
    );
  });
});
