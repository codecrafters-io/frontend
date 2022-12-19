import { animationsSettled, setupAnimationTest as originalSetupAnimationTest } from 'ember-animated/test-support';

function setupAnimationTest(hooks) {
  originalSetupAnimationTest(hooks);

  hooks.afterEach(async function () {
    await animationsSettled();
  });
}

export { setupAnimationTest };
