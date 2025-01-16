import submissionsPage from 'codecrafters-frontend/tests/pages/course-admin/submissions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

// Example diff is defined as array because VSCode strips trailing spaces
// in blank lines when saving the file, even inside multiline strings
const EXAMPLE_DIFF = [
  ' import socket',
  ' import logging',
  ' import threading',
  ' ',
  ' # Configure the logging module',
  " logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')",
  ' ',
  ' def handle_request(connection, address, redis_dict):',
  '     logging.info(f"Accepted connection from {address}")',
  ' ',
  '     while True:',
  '         data = connection.recv(1024)',
  ' ',
  '         if not data:',
  '             break',
  ' ',
  '+        logging.info(f"Data received: {data}")',
  ' ',
  '         commands = parse_resp(data)',
  ' ',
  '         logging.info(f"Parsed commands: {commands}")',
  ' ',
  '     connection.close()',
  '     logging.info(f"Connection closed from {address}")',
  ' ',
  ' def main():',
  '     logging.info("Logs from your program will appear here!")',
  ' ',
  '     with socket.create_server(("localhost", 6379), reuse_port=True) as server_socket:',
  '+        logging.info("Server is running and waiting for connections...")',
  '         redis_dict = dict()',
  '         while True:',
  '             # Block until we receive an incoming connection',
  '             connection, address = server_socket.accept()',
  '             # Start a new thread to handle the request',
  '             client_thread = threading.Thread(target=handle_request, args=(connection, address, redis_dict,))',
  '             client_thread.start()',
  ' ',
  ' if __name__ == "__main__":',
  '     main()',
].join('\n');

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
        filename: 'server.py',
        diff: EXAMPLE_DIFF,
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
      'Expand 13 unchanged lines',
      'The first placeholder should show correct number of lines',
    );

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[1].text,
      'Expand 6 unchanged lines',
      'The second placeholder should show correct number of lines',
    );

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[2].text,
      'Expand 7 unchanged lines',
      'The third placeholder should show correct number of lines',
    );

    await submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[0].click();

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      2,
      'The first placeholder should be expanded after clicking',
    );

    await submissionsPage.diffTab.changedFiles[0].codeMirror.gutters.collapseUnchangedGutter.collapseUnchangedBarSiblings[0].click();

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      1,
      "The second placeholder should be expanded after clicking on it's gutter sibling",
    );

    await submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders[0].click();

    assert.strictEqual(
      submissionsPage.diffTab.changedFiles[0].codeMirror.content.collapsedLinesPlaceholders.length,
      0,
      'The third placeholder should be expanded after clicking',
    );
  });
});
