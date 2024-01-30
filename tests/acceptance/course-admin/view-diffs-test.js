import submissionsPage from 'codecrafters-frontend/tests/pages/course-admin/submissions-page';
import SyntaxHighlightedDiffComponent from 'codecrafters-frontend/components/syntax-highlighted-diff';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-diffs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('expandable chunks has the correct number of lines', async function (assert) {
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

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ]);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.strictEqual(submissionsPage.diffTab.expandableChunks.length, 2, 'There should be two expandable chunks');
    assert.ok(
      submissionsPage.diffTab.expandableChunks.objectAt(0).text.includes('Expand 2 lines'),
      'The first chunk should have the correct number of lines',
    );
    assert.ok(
      submissionsPage.diffTab.expandableChunks.objectAt(1).text.includes('Expand 2 lines'),
      'The second chunk should have the correct number of lines',
    );

    await submissionsPage.diffTab.expandableChunks.objectAt(0).click();
    assert.strictEqual(submissionsPage.diffTab.expandableChunks.length, 1, 'The first chunk should have been expanded');
  });

  test('expandable chunks display the hidden code when clicked', async function (assert) {
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

    def listen
      loop do
        client = @server.accept
+       handle_client(client)
+     end
+   end
+
+   def handle_client(client)
+     loop do
+       client.gets
+
        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ]);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.strictEqual(submissionsPage.diffTab.expandableChunks.length, 2, 'There should be two expandable chunks');
    await submissionsPage.diffTab.expandableChunks.objectAt(0).click();
    assert.strictEqual(submissionsPage.diffTab.expandableChunks.length, 1, 'The first chunk should have been expanded');
  });

  test('expandable chunks do not collapse by default within a certain number of lines between changes', async function (assert) {
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

    SyntaxHighlightedDiffComponent.LINES_AROUND_CHANGED_CHUNK = 3;
    SyntaxHighlightedDiffComponent.MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING = 4;

    submission.update('changedFiles', [
      {
        filename: 'server.rb',
        diff: `    end

    def listen
+     loop do
        client = @server.accept
        handle_client(client)
      end
    end

    def handle_client(client)
      loop do
        client.gets

        # TODO: Handle commands other than PING
+       client.write("+PONG\\r\\n")
      end
    end
  end`,
      },
    ]);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.strictEqual(submissionsPage.diffTab.expandableChunks.length, 0, 'There should be no expandable chunk');
  });

  test('expandable chunks collapse by default within a certain number of lines between changes', async function (assert) {
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

    SyntaxHighlightedDiffComponent.LINES_AROUND_CHANGED_CHUNK = 3;
    SyntaxHighlightedDiffComponent.MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING = 4;

    submission.update('changedFiles', [
      {
        filename: 'server.rb',
        diff: `    end

    def listen
+     loop do
        client = @server.accept
        handle_client(client)
      end
    end

    def handle_client(client)
      loop do
        client.gets

        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
+     end
    end
  end`,
      },
    ]);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.strictEqual(submissionsPage.diffTab.expandableChunks.length, 1, 'There should be one expandable chunk');
  });

  test('expandable chunks have no duplicated lines when lines around two chunks are overlapping', async function (assert) {
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

    SyntaxHighlightedDiffComponent.LINES_AROUND_CHANGED_CHUNK = 3;
    SyntaxHighlightedDiffComponent.MIN_LINES_BETWEEN_CHUNKS_BEFORE_COLLAPSING = 4;

    submission.update('changedFiles', [
      {
        filename: 'server.rb',
        diff: `    end

    def listen
     loop do
        client = @server.accept
        handle_client(client)
+      end
    end

    def handle_client(client)
+      loop do
        client.gets

        # TODO: Handle commands other than PING
        client.write("+PONG\\r\\n")
     end
    end
  end`,
      },
    ]);

    await submissionsPage.visit({ course_slug: 'redis' });
    await submissionsPage.timelineContainer.entries.objectAt(1).click();
    await submissionsPage.clickOnLink('Diff');

    assert.ok(
      submissionsPage.diffTab.text.includes('+ end end def handle_client(client) + loop do'),
      'There should be no duplication between changed lines',
    );
  });
});
