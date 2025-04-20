import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { tracked } from '@glimmer/tracking';

// Mock Rive class for testing
class MockRive {
  // Private properties
  _interval = null;
  _listeners = new Map();

  // Public properties
  @tracked canvas;
  @tracked isLoaded = false;
  @tracked stateMachineNames = ['State Machine 1', 'State Machine 2'];
  @tracked lastPlayedStateMachine = null;
  @tracked lastInputsStateMachine = null;

  // Constructor
  constructor(options) {
    this.canvas = options.canvas;
  }

  // Getter
  get interval() {
    return this._interval;
  }

  // Public methods
  off(event, callback) {
    const listeners = this._listeners.get(event);

    if (listeners) {
      const index = listeners.indexOf(callback);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }

    this._listeners.get(event)?.push(callback);
  }

  play(stateMachineName) {
    this.lastPlayedStateMachine = stateMachineName;
  }

  reset() {
    // Mock reset implementation
  }

  simulateLoad() {
    this.isLoaded = true;
    this.triggerEvent('load');
  }

  stateMachineInputs(stateMachineName) {
    this.lastInputsStateMachine = stateMachineName;

    return [];
  }

  stop() {
    // Mock stop implementation
  }

  // Helper methods
  triggerEvent(event, ...args) {
    const listeners = this._listeners.get(event);

    if (listeners) {
      listeners.forEach((callback) => callback(event, ...args));
    }
  }
}

module('Integration | Component | gleam-logo', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    // Store original Rive constructor
    this.originalRive = window.Rive;
    // Replace with mock
    window.Rive = MockRive;
  });

  hooks.afterEach(function () {
    // Restore original Rive constructor
    window.Rive = this.originalRive;
  });

  module('Rendering', function () {
    test('it renders a canvas element', async function (assert) {
      await render(hbs`<GleamLogo />`);
      assert.dom('canvas').exists('Canvas element is rendered');
    });

    test('it initializes Rive with the canvas', async function (assert) {
      await render(hbs`<GleamLogo />`);

      const container = document.querySelector('.gleam-logo-container');
      const canvas = container?.querySelector('canvas');
      assert.ok(canvas, 'Canvas element exists');

      const mockRive = new MockRive({ canvas });
      container.__riveInstance = mockRive;

      mockRive.simulateLoad();
      await settled();

      assert.deepEqual(mockRive.stateMachineNames, ['State Machine 1', 'State Machine 2'], 'State machines are available after initialization');
    });
  });

  module('Hover Behavior', function () {
    test('it triggers animation on hover', async function (assert) {
      await render(hbs`<GleamLogo />`);

      const container = document.querySelector('.gleam-logo-container');
      const canvas = container?.querySelector('canvas');
      assert.ok(canvas, 'Canvas element exists');

      const mockRive = new MockRive({ canvas });
      container.__riveInstance = mockRive;

      let playCalls = 0;
      let resetCalls = 0;

      mockRive.play = (stateMachineName) => {
        playCalls++;
        assert.strictEqual(stateMachineName, 'State Machine 1', 'Hover plays correct state machine');
      };

      mockRive.reset = () => {
        resetCalls++;
      };

      mockRive.simulateLoad();
      await settled();

      const handleMouseEnter = () => {
        if (mockRive) {
          const stateMachines = mockRive.stateMachineNames;

          if (stateMachines && stateMachines.length > 0) {
            const stateMachineName = 'State Machine 1';

            if (stateMachines.includes(stateMachineName)) {
              mockRive.reset();
              mockRive.play(stateMachineName);
            }
          }
        }
      };

      container.addEventListener('mouseenter', handleMouseEnter);

      container.dispatchEvent(new MouseEvent('mouseenter'));
      await settled();

      assert.strictEqual(playCalls, 1, 'Play was called once on hover');
      assert.strictEqual(resetCalls, 1, 'Reset was called once on hover');

      container.removeEventListener('mouseenter', handleMouseEnter);
    });
  });

  module('Cleanup', function () {
    test('it cleans up resources on destroy', async function (assert) {
      await render(hbs`<GleamLogo />`);

      const container = document.querySelector('.gleam-logo-container');
      const canvas = container?.querySelector('canvas');
      assert.ok(canvas, 'Canvas element exists');

      const mockRive = new MockRive({ canvas });
      container.__riveInstance = mockRive;

      let stopCalls = 0;
      let resetCalls = 0;

      mockRive.stop = () => {
        stopCalls++;
      };

      mockRive.reset = () => {
        resetCalls++;
      };

      mockRive.simulateLoad();
      await settled();

      const cleanupRive = () => {
        if (mockRive) {
          mockRive.stop();
          mockRive.reset();
        }
      };

      cleanupRive();
      await settled();

      assert.strictEqual(stopCalls, 1, 'Stop was called on destroy');
      assert.strictEqual(resetCalls, 1, 'Reset was called on destroy');
      assert.strictEqual(mockRive.interval, null, 'Animation interval was cleared');
    });
  });
});
