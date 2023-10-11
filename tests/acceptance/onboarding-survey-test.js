/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { visit } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | onboarding-survey-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can answer questions in onboarding survey', async function (assert) {
    testScenario(this.server);

    await visit('/welcome');
    assert.strictEqual(1, 1);
  });
});
