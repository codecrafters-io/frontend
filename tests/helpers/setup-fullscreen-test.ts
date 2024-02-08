// Scroll tests don't work with the container docked to the side. Let's make
// the container full screen for the duration of the test instead.
export default function setupFullscreenTest(hooks: NestedHooks) {
  hooks.beforeEach(() => {
    const testContainer = document.getElementById('ember-testing-container');
    testContainer!.classList.add('ember-testing-container-full-screen');
  });

  hooks.afterEach(() => {
    const testContainer = document.getElementById('ember-testing-container');
    testContainer!.classList.remove('ember-testing-container-full-screen');
  });
}
