import config from 'codecrafters-frontend/config/environment';

// Scroll tests don't work with the container docked to the side. Let's make
// the container full screen for the duration of the test instead.
export default function setupFullscreenTest(hooks: NestedHooks) {
  const url = new URL(window.location.href);
  const urlParams = new URLSearchParams(url.search);
  const shouldRun = config.x.isCI || urlParams.has('devmode');

  hooks.beforeEach(() => {
    if (!shouldRun) {
      return;
    }

    const testContainer = document.getElementById('ember-testing-container');
    testContainer!.classList.add('ember-testing-container-full-screen');
  });

  hooks.afterEach(() => {
    if (!shouldRun) {
      return;
    }

    const testContainer = document.getElementById('ember-testing-container');
    testContainer!.classList.remove('ember-testing-container-full-screen');
  });
}
