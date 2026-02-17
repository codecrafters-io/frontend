import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import { waitUntil } from '@ember/test-helpers';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

module('Acceptance | course-page | autofix', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can view live autofix progress', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    const submission = this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    const fakeLogstream = this.server.create('fake-logstream', {
      id: 'fake-logstream-id',
      chunks: [],
      isTerminated: false,
    });

    this.server.create('autofix-request', {
      creatorType: 'system',
      submission: submission,
      repository: repository,
      status: 'in_progress',
      logstreamId: 'fake-logstream-id',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();

    await waitUntil(() => fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    // Simulate tool calls arriving via logstream
    const toolCallEvents = [
      JSON.stringify({ event: 'tool_call_start', params: { tool_call_id: 'tc_1', tool_name: 'read', tool_arguments: { path: 'app/server.py' } } }),
      JSON.stringify({ event: 'tool_call_end', params: { tool_call_id: 'tc_1' } }),
      JSON.stringify({ event: 'tool_call_start', params: { tool_call_id: 'tc_2', tool_name: 'read', tool_arguments: { path: 'app/handler.py' } } }),
      JSON.stringify({ event: 'tool_call_end', params: { tool_call_id: 'tc_2' } }),
      JSON.stringify({
        event: 'tool_call_start',
        params: {
          tool_call_id: 'tc_3',
          tool_name: 'create_draft_hints',
          tool_arguments: {
            hints: [
              {
                slug: 'missing-resp-terminator',
                title_markdown: 'Missing RESP bulk string terminator',
                description_markdown:
                  'The `handle_command` function in `app/server.py` does not append `\\r\\n` after the bulk string response, which violates the RESP protocol. For example, the response `$4\\r\\nPONG` should be `$4\\r\\nPONG\\r\\n`.',
              },
              {
                slug: 'connection-not-closed',
                title_markdown: 'Connection not closed on client disconnect',
                description_markdown:
                  'When the client disconnects, the socket is not properly closed in the `finally` block of `handle_client`, which can lead to resource leaks over time.',
              },
            ],
          },
        },
      }),
      JSON.stringify({
        event: 'tool_call_end',
        params: { tool_call_id: 'tc_3', tool_result: "2 hints recorded. Make sure to finalize hints after you've fixed bugs and tests have passed." },
      }),
      JSON.stringify({ event: 'tool_call_start', params: { tool_call_id: 'tc_4', tool_name: 'edit', tool_arguments: { path: 'app/server.py' } } }),
      JSON.stringify({ event: 'tool_call_end', params: { tool_call_id: 'tc_4' } }),
      JSON.stringify({
        event: 'tool_call_start',
        params: { tool_call_id: 'tc_5', tool_name: 'bash', tool_arguments: { command: 'python test.py' } },
      }),
    ];

    fakeLogstream.update({ chunks: [toolCallEvents.join('\n') + '\n'] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await finishRender();

    // Simulate draft hints arriving (server updates autofix request with hints)
    const autofixRequest = this.server.schema.autofixRequests.first();
    autofixRequest.update({
      hintsJson: [
        {
          slug: 'missing-resp-terminator',
          title_markdown: 'Missing RESP bulk string terminator',
          description_markdown:
            'The `handle_command` function in `app/server.py` does not append `\\r\\n` after the bulk string response, which violates the RESP protocol. For example, the response `$4\\r\\nPONG` should be `$4\\r\\nPONG\\r\\n`.',
        },
        {
          slug: 'connection-not-closed',
          title_markdown: 'Connection not closed on client disconnect',
          description_markdown:
            'When the client disconnects, the socket is not properly closed in the `finally` block of `handle_client`, which can lead to resource leaks over time.',
        },
      ],
    });

    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await finishRender();

    // await this.pauseTest();

    // Simulate hints being finalized (bash completes, then finalize_hints is called)
    const finalizeEvents = [
      JSON.stringify({ event: 'tool_call_end', params: { tool_call_id: 'tc_5' } }),
      JSON.stringify({
        event: 'tool_call_start',
        params: {
          tool_call_id: 'tc_6',
          tool_name: 'finalize_hints',
          tool_arguments: { hint_slugs: ['missing-resp-terminator', 'connection-not-closed'] },
        },
      }),
      JSON.stringify({
        event: 'tool_call_end',
        params: { tool_call_id: 'tc_6', tool_result: '2 hints finalized.' },
      }),
    ];

    fakeLogstream.update({ chunks: [toolCallEvents.join('\n') + '\n', finalizeEvents.join('\n') + '\n'] });
    autofixRequest.update({ status: 'success' });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await finishRender();

    // await this.pauseTest();
  });
});
