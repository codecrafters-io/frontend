import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, skip } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import { waitUntil } from '@ember/test-helpers';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';

// This isn't exposed as a feature anymore, disable for now
module('Acceptance | course-page | autofix', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  skip('can trigger autofix when last submission failed', async function (assert) {
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
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnTab('AI Hints');
    await coursePage.testResultsBar.autofixSection.clickOnStartAutofixButton();

    await waitUntil(() => fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    const autofixRequest = this.server.schema.autofixRequests.first();
    const logstream = this.server.schema.fakeLogstreams.first();
    assert.ok(autofixRequest, 'autofix request was created');
    assert.ok(logstream, 'fake logstream was created');

    logstream.update({ chunks: ['Running tests...\n\n'] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await finishRender();

    await percySnapshot('Autofix - Short logs', { scope: '[data-test-test-results-bar]' });

    const chunks = Array.from({ length: 100 }, (_, i) => `\x1b[92m[stage-${i}] passed\x1b[0m\n`);
    logstream.update({ chunks: ['Running tests...\n\n', ...chunks] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await finishRender();

    const testResultsBarHeight = coursePage.testResultsBar.height;
    const testResultsBarContentsHeight = coursePage.testResultsBar.contents.height;
    assert.ok(testResultsBarContentsHeight < testResultsBarHeight, 'Test results bar contents should be smaller than the bar');

    await percySnapshot('Autofix - Long logs', { scope: '[data-test-test-results-bar]' });

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
    await finishRender();
    await waitUntil(() => !fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    await percySnapshot('Autofix - Success', { scope: '[data-test-test-results-bar]' });
  });

  skip('renders failed autofix', async function (assert) {
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
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnTab('AI Hints');
    await coursePage.testResultsBar.autofixSection.clickOnStartAutofixButton();

    await waitUntil(() => fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    const autofixRequest = this.server.schema.autofixRequests.first();
    const logstream = this.server.schema.fakeLogstreams.first();

    autofixRequest.update({
      status: 'failure',
      logsBase64: btoa('Failure reason: xxx.'),
    });

    logstream.update({ isTerminated: true });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });
    await finishRender();

    await waitUntil(() => !fakeActionCableConsumer.hasSubscription('LogstreamChannel'));

    await percySnapshot('Autofix - Failure', { scope: '[data-test-test-results-bar]' });
    assert.strictEqual(1, 1); // Add at least one assertion
  });

  skip('is not visible for stage 3 and beyond', async function (assert) {
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
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    assert.deepEqual(coursePage.testResultsBar.tabNames, ['Logs', 'AI Hints']);

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: redis.stages.models.toSorted(fieldComparator('position'))[1],
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    fakeActionCableConsumer.sendData('CourseLeaderboardChannel', { event: 'updated' });
    await finishRender();
    assert.deepEqual(coursePage.testResultsBar.tabNames, ['Logs']);
  });
});
