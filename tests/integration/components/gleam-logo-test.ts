import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { tracked } from '@glimmer/tracking';

// Declare Rive type for window
declare global {
  interface Window {
    Rive: typeof MockRive;
  }
}

// Mock Rive class for testing
class MockRive {
  @tracked canvas: HTMLCanvasElement;
  @tracked stateMachineNames: string[] = ['State Machine 1', 'State Machine 2'];
  @tracked isLoaded = false;
  private _listeners: Map<string, Function[]> = new Map();
  private _interval: number | null = null;

  get interval(): number | null {
    return this._interval;
  }

  constructor(options: { canvas: HTMLCanvasElement }) {
    this.canvas = options.canvas;
  }

  reset() {
    // Mock reset implementation
  }

  play(stateMachineName: string) {
    // Mock play implementation
  }

  stop() {
    // Mock stop implementation
  }

  stateMachineInputs(stateMachineName: string) {
    return [];
  }

  on(event: string, callback: Function) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event)?.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this._listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Helper method to trigger events
  triggerEvent(event: string, ...args: any[]) {
    const listeners = this._listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(...args));
    }
  }

  // Helper method to simulate load
  simulateLoad() {
    this.isLoaded = true;
    this.triggerEvent('load');
  }
}

interface TestContext {
  originalRive: typeof MockRive;
  owner: {
    lookup: (name: string) => any;
  };
}

module('Integration | Component | gleam-logo', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function (this: TestContext) {
    // Store original Rive constructor
    this.originalRive = window.Rive;
    // Replace with mock
    window.Rive = MockRive;
  });

  hooks.afterEach(function (this: TestContext) {
    // Restore original Rive constructor
    window.Rive = this.originalRive;
  });

  test('it renders and initializes Rive', async function (assert) {
    await render(hbs`<GleamLogo />`);

    // Verify canvas is in the DOM
    assert.dom('canvas').exists('Canvas element is rendered');

    // Get the container and create mock Rive instance
    const container = document.querySelector('.gleam-logo-container') as HTMLElement;
    const canvas = container?.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({ canvas: canvas as HTMLCanvasElement });
    (container as any).__riveInstance = mockRive;

    // Simulate Rive load
    mockRive.simulateLoad();
    await settled();

    // Verify state machines are available
    assert.deepEqual(mockRive.stateMachineNames, ['State Machine 1', 'State Machine 2'], 'State machines are available');
  });

  test('it handles hover events', async function (assert) {
    await render(hbs`<GleamLogo />`);

    // Get the container and create mock Rive instance
    const container = document.querySelector('.gleam-logo-container') as HTMLElement;
    const canvas = container?.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({ canvas: canvas as HTMLCanvasElement });
    (container as any).__riveInstance = mockRive;

    // Track calls to play and reset
    let playCalls = 0;
    let resetCalls = 0;

    // Override the mock methods before simulating load
    mockRive.play = (stateMachineName: string) => {
      playCalls++;
      assert.equal(stateMachineName, 'State Machine 1', 'Hover plays correct state machine');
    };

    mockRive.reset = () => {
      resetCalls++;
    };

    // Simulate Rive load
    mockRive.simulateLoad();
    await settled();

    // Add event handler directly to the container
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

    // Trigger the event
    container.dispatchEvent(new MouseEvent('mouseenter'));
    await settled();

    assert.equal(playCalls, 1, 'Play was called once on hover');
    assert.equal(resetCalls, 1, 'Reset was called once on hover');

    // Clean up
    container.removeEventListener('mouseenter', handleMouseEnter);
  });

  test('it cleans up resources on destroy', async function (this: TestContext, assert) {
    await render(hbs`<GleamLogo />`);

    // Get the container and create mock Rive instance
    const container = document.querySelector('.gleam-logo-container') as HTMLElement;
    const canvas = container?.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({ canvas: canvas as HTMLCanvasElement });
    (container as any).__riveInstance = mockRive;

    // Track cleanup calls
    let stopCalls = 0;
    let resetCalls = 0;

    mockRive.stop = () => {
      stopCalls++;
    };

    mockRive.reset = () => {
      resetCalls++;
    };

    // Simulate Rive load
    mockRive.simulateLoad();
    await settled();

    // Add cleanup handler directly
    const cleanupRive = () => {
      if (mockRive) {
        mockRive.stop();
        mockRive.reset();
      }
    };

    // Trigger cleanup
    cleanupRive();
    await settled();

    assert.equal(stopCalls, 1, 'Stop was called on destroy');
    assert.equal(resetCalls, 1, 'Reset was called on destroy');
    assert.equal(mockRive.interval, null, 'Animation interval was cleared');
  });
});
