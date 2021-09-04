import fakeTimers from '@sinonjs/fake-timers';

export default function setupClock(hooks) {
  hooks.beforeEach(function () {
    this.clock = fakeTimers.install({ shouldAdvanceTime: true });
  });

  hooks.afterEach(function () {
    this.clock.uninstall();
  });
}
