import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { time, setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import { waitUntil } from '@ember/test-helpers';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

function fakeToolCallStart(logstream, fakeActionCableConsumer, toolCallId, toolName) {
  logstream.update({
    chunks: logstream.chunks.concat(['\n', JSON.stringify({ event: 'tool_call_start', params: { tool_call_id: toolCallId, tool_name: toolName } })]),
  });

  fakeActionCableConsumer.sendData('LogstreamChannel', 'updated');
}

function fakeToolCallEnd(logstream, fakeActionCableConsumer, toolCallId, toolName) {
  logstream.update({
    chunks: logstream.chunks.concat(['\n', JSON.stringify({ event: 'tool_call_end', params: { tool_call_id: toolCallId, tool_name: toolName } })]),
  });

  fakeActionCableConsumer.sendData('LogstreamChannel', 'updated');
}

module('Acceptance | course-page | autofix', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('renders in-progress autofix', async function (assert) {
    time.runAtSpeed(1);
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    const submission = this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    const autofixRequest = this.server.create('autofix-request', {
      submission: submission,
      repository: repository,
      status: 'in_progress',
    });

    const logstream = this.server.create('fake-logstream', { chunks: [], isTerminated: false });
    autofixRequest.update({ logstreamId: logstream.id });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnTab('Custom Hints');

    let delay = 2000;

    for (let i = 0; i < 3; i++) {
      delay += 50;

      setTimeout(() => {
        fakeToolCallStart(logstream, fakeActionCableConsumer, `read-call-${i}`, 'read');
      }, delay);

      delay += 1;

      setTimeout(() => {
        fakeToolCallEnd(logstream, fakeActionCableConsumer, `read-call-${i}`, 'read');
      }, delay);
    }

    for (let i = 0; i < 2; i++) {
      delay += 1000;

      setTimeout(() => {
        fakeToolCallStart(logstream, fakeActionCableConsumer, `write-call-${i}`, 'write');
      }, delay);

      delay += 500;

      setTimeout(() => {
        fakeToolCallEnd(logstream, fakeActionCableConsumer, `write-call-${i}`, 'write');
      }, delay);
    }

    delay += 100;

    setTimeout(() => {
      autofixRequest.update({
        status: 'success',
        explanationMarkdown: 'This is a test explanation. It is long enough to span multiple lines. Maybe a bit more?',
        summary: 'This is a test hint',
        changedFiles: [
          {
            filename: 'test.txt',
            diff: 'This is a test diff.',
          },
        ],
      });

      fakeActionCableConsumer.sendData('RepositoryChannel', 'updated');
    }, delay);

    await this.pauseTest();
    // await coursePage.testResultsBar.autofixSection.clickOnStartAutofixButton();

    // await waitUntil(() => fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    // const autofixRequest = this.server.schema.autofixRequests.first();
    // const logstream = this.server.schema.fakeLogstreams.first();

    // autofixRequest.update({
    //   status: 'failure',
    //   logsBase64: btoa('Failure reason: xxx.'),
    // });

    // logstream.update({ isTerminated: true });
    // fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    // await waitUntil(() => !fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    // await percySnapshot('Autofix - Failure', { scope: '[data-test-test-results-bar]' });
    // assert.strictEqual(1, 1); // Add at least one assertion
  });
});
