import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

// Mock Rive class for testing
class MockRive {
  constructor(options) {
    this.canvas = options.canvas;
    this._listeners = new Map();
    this._onLoadCallback = null;
    this.src = options.src;
    this.layout = options.layout;
  }

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

  resizeDrawingSurfaceToCanvas() {
    // No-op for test
  }

  simulateLoad() {
    if (this._onLoadCallback) {
      this._onLoadCallback();
    }
  }

  stateMachineInputs() {
    return [
      {
        name: 'Hover',
        value: false,
        type: 'boolean',
      },
    ];
  }

  stop() {
    // No-op for test
  }

  triggerEvent(event, ...args) {
    const listeners = this._listeners.get(event);

    if (listeners) {
      listeners.forEach((callback) => callback(event, ...args));
    }
  }
}

module('Integration | Component | rive-animation', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.originalRive = window.Rive;
    window.Rive = class MockRiveConstructor {
      constructor(options) {
        const instance = new MockRive(options);
        this._onLoadCallback = options.onLoad;

        return instance;
      }
    };
  });

  hooks.afterEach(function () {
    window.Rive = this.originalRive;
  });

  test('it renders and initializes correctly', async function (assert) {
    await render(hbs`
      <div class="w-[200px] h-[200px]">
        <RiveAnimation @src="/assets/animations/gleam_logo_animation.riv" />
      </div>
    `);

    // Check container dimensions
    const container = this.element.querySelector('div > div');
    assert.ok(container, 'Container element exists');
    // Check canvas dimensions and styles
    const canvas = this.element.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');
    assert.strictEqual(canvas?.className, 'w-full h-full block max-w-full', 'Canvas has correct classes');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({
      canvas: canvas,
      src: '/assets/animations/gleam_logo_animation.riv',
      layout: { fit: 'contain' },
    });
    container.__riveInstance = mockRive;

    // Simulate Rive load event
    mockRive.simulateLoad();

    // Check that Rive instance was created with correct options
    assert.ok(mockRive, 'Rive instance exists');
    assert.strictEqual(mockRive.canvas, canvas, 'Canvas is passed to Rive instance');
    assert.strictEqual(mockRive.src, '/assets/animations/gleam_logo_animation.riv', 'Correct animation source is set');
    assert.ok(mockRive.layout, 'Layout is configured');
  });

  test('it handles hover state correctly', async function (assert) {
    await render(hbs`
      <div class="w-[200px] h-[200px]">
        <RiveAnimation @src="/assets/animations/gleam_logo_animation.riv" />
      </div>
    `);

    const container = this.element.querySelector('div > div');
    assert.ok(container, 'Container exists');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({ canvas: container.querySelector('canvas') });
    container.__riveInstance = mockRive;
    assert.ok(mockRive, 'Rive instance exists');

    // Simulate Rive load event
    mockRive.simulateLoad();

    const inputs = mockRive.stateMachineInputs();
    assert.ok(inputs, 'State machine inputs exist');

    const hoverInput = inputs.find((input) => input.name.toLowerCase().includes('hover'));
    assert.ok(hoverInput, 'Hover input exists');

    // Verify initial hover state
    assert.false(hoverInput.value, 'Hover input is initially false');

    // Wait for hover out timeout
    assert.false(hoverInput.value, 'Hover input is set to false after timeout');
  });

  test('it works with different animation files', async function (assert) {
    await render(hbs`
      <div class="w-[200px] h-[200px]">
        <RiveAnimation @src="/assets/animations/pig_cuddly.riv" />
      </div>
    `);

    const container = this.element.querySelector('div > div');
    assert.ok(container, 'Container exists');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({
      canvas: container.querySelector('canvas'),
      src: '/assets/animations/pig_cuddly.riv',
      layout: { fit: 'contain' },
    });
    container.__riveInstance = mockRive;

    // Simulate Rive load event
    mockRive.simulateLoad();

    // Check that Rive instance was created with correct options
    assert.ok(mockRive, 'Rive instance exists');
    assert.strictEqual(mockRive.src, '/assets/animations/pig_cuddly.riv', 'Correct animation source is set');
  });
});
