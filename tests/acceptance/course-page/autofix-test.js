import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | course-page | autofix', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can trigger autofix when last submission failed', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnTab('AI Hints');
    await coursePage.testResultsBar.autofixSection.clickOnStartAutofixButton();

    await waitUntil(() => fakeActionCableConsumer.hasSubscriptionForChannel('LogstreamChannel'));

    const autofixRequest = this.server.schema.autofixRequests.first();
    const logstream = this.server.schema.fakeLogstreams.first();
    assert.ok(autofixRequest, 'autofix request was created');
    assert.ok(logstream, 'fake logstream was created');

    logstream.update({ chunks: ['Running tests...\n\n'] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    await percySnapshot('Autofix - Short logs', { scope: '[data-test-test-results-bar]' });

    const chunks = Array.from({ length: 100 }, (_, i) => `\x1b[92m[stage-${i}] passed\x1b[0m\n`);
    logstream.update({ chunks: ['Running tests...\n\n', ...chunks] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    await percySnapshot('Autofix - Long logs', { scope: '[data-test-test-results-bar]' });
    // await this.pauseTest();

    autofixRequest.update({
      status: 'success',
      logsBase64: btoa(logstream.chunks.join('')),
      explanationMarkdown: '## Autofix succeeded!\n\n - [x] Fix 1\n - [x] Fix 2\n - [ ] Fix 3\n\n',
      changedFiles: [
        {
          filename: 'test.py',
          diff: [
            ' def test_0():',
            '      assert 0 == 0',
            '      assert 0 == 0',
            '      assert 0 == 0',
            '      assert 0 == 0',
            '      assert 0 == 0',
            ' ',
            ' def test_1():',
            '-    assert 1 == 2',
            '+    assert 1 == 1',
            ' ',
            ' def test_2():',
            '      assert 2 == 2',
            '      assert 2 == 2',
            '      assert 2 == 2',
            '      assert 2 == 2',
            '      assert 2 == 2',
          ].join('\n'),
        },
      ],
    });

    logstream.update({ isTerminated: true });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await waitUntil(() => !fakeActionCableConsumer.hasSubscriptionForChannel('LogstreamChannel'));

    await percySnapshot('Autofix - Success', { scope: '[data-test-test-results-bar]' });
    // await this.pauseTest();
  });

  test('renders failed autofix', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnTab('AI Hints');
    await coursePage.testResultsBar.autofixSection.clickOnStartAutofixButton();

    await waitUntil(() => fakeActionCableConsumer.hasSubscriptionForChannel('LogstreamChannel'));

    const autofixRequest = this.server.schema.autofixRequests.first();
    const logstream = this.server.schema.fakeLogstreams.first();

    autofixRequest.update({
      status: 'failure',
      logsBase64: btoa('Failure reason: xxx.'),
    });

    logstream.update({ isTerminated: true });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    await waitUntil(() => !fakeActionCableConsumer.hasSubscriptionForChannel('LogstreamChannel'));

    await percySnapshot('Autofix - Failure', { scope: '[data-test-test-results-bar]' });
    assert.strictEqual(1, 1); // Add at least one assertion
  });

  test('is not visible for stage 3 and beyond', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.testResultsBar.clickOnBottomSection();
    assert.deepEqual(coursePage.testResultsBar.tabNames, ['Logs', 'AI Hints']);

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    assert.deepEqual(coursePage.testResultsBar.tabNames, ['Logs']);
  });

  test('can resize test results bar', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.resizeHandler.mouseDown();

    const desiredHeight = 500;

    await coursePage.testResultsBar.resizeHandler.mouseMove({ clientY: window.innerHeight - desiredHeight });
    await coursePage.testResultsBar.resizeHandler.mouseUp();

    const testResultsBarHeight = coursePage.testResultsBar.height;
    assert.strictEqual(testResultsBarHeight, desiredHeight);
  });
});
