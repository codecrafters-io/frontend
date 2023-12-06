import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | course-page | autofix', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can trigger autofix when last submission failed', async function (assert) {
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

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.testResultsBar.clickOnBottomSection();
    await coursePage.testResultsBar.clickOnTab('Autofix');
    await coursePage.testResultsBar.autofixSection.clickOnStartAutofixButton();

    await waitUntil(() => fakeActionCableConsumer.hasSubscriptionForChannel('LogstreamChannel'));

    const logstream = this.server.schema.fakeLogstreams.first();
    assert.ok(logstream, 'fake logstream was created');

    logstream.update({ chunks: ['line 1\n'] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    logstream.update({ chunks: ['line 1\n', 'line 2\n'] });
    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    fakeActionCableConsumer.sendData('LogstreamChannel', { event: 'updated' });

    await this.pauseTest();
  });
});
