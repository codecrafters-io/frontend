import {
  setupApplicationTest as upstreamSetupApplicationTest,
  setupRenderingTest as upstreamSetupRenderingTest,
  setupTest as upstreamSetupTest,
} from 'ember-qunit';

import { setupMirage } from 'ember-cli-mirage/test-support';
import setupFullscreenTest from './setup-fullscreen-test';

function setupApplicationTest(hooks, options) {
  upstreamSetupApplicationTest(hooks, options);
  setupFullscreenTest(hooks);
  setupMirage(hooks);
}

function setupRenderingTest(hooks, options) {
  upstreamSetupRenderingTest(hooks, options);

  // Additional setup for rendering tests can be done here.
}

function setupTest(hooks, options) {
  upstreamSetupTest(hooks, options);

  // Additional setup for unit tests can be done here.
}

export { setupApplicationTest, setupRenderingTest, setupTest };
