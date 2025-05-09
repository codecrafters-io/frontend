import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

// Mock Rive class for testing
class MockRive {
  constructor(options) {
    this.canvas = options.canvas;
    this._listeners = new Map();
    this._onLoadCallback = null;
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
    await render(hbs`<RiveAnimation @src="/assets/animations/gleam_logo_animation.riv" />`);

    // Check container dimensions
    const container = this.element.querySelector('div');
    assert.ok(container, 'Container element exists');
    assert.strictEqual(container?.style.height, '200px', 'Height is set correctly');
    assert.strictEqual(container?.style.width, '200px', 'Width is set correctly');

    // Check canvas dimensions and styles
    const canvas = this.element.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');
    assert.strictEqual(canvas?.width, 400, 'Canvas width is set to base size for quality');
    assert.strictEqual(canvas?.height, 400, 'Canvas height is set to base size for quality');
    assert.strictEqual(canvas?.style.width, '100%', 'Canvas width style is set correctly');
    assert.strictEqual(canvas?.style.height, '100%', 'Canvas height style is set correctly');
    assert.strictEqual(canvas?.style.display, 'block', 'Canvas display style is set correctly');
    assert.strictEqual(canvas?.style.maxWidth, '100%', 'Canvas max-width style is set correctly');
  });

  test('it handles hover state correctly', async function (assert) {
    await render(hbs`<RiveAnimation @src="/assets/animations/gleam_logo_animation.riv" />`);

    const container = this.element.querySelector('div');
    assert.ok(container, 'Container exists');

    // Create and attach mock Rive instance
    const mockRive = new MockRive({ canvas: container.querySelector('canvas') });
    container.__riveInstance = mockRive;
    assert.ok(mockRive, 'Rive instance exists');

    // Simulate Rive load event
    mockRive.simulateLoad();
    await settled();

    const inputs = mockRive.stateMachineInputs();
    assert.ok(inputs, 'State machine inputs exist');

    const hoverInput = inputs.find((input) => input.name.toLowerCase().includes('hover'));
    assert.ok(hoverInput, 'Hover input exists');

    // Verify initial hover state
    assert.false(hoverInput.value, 'Hover input is initially false');

    // Wait for hover out timeout
    await settled();
    assert.false(hoverInput.value, 'Hover input is set to false after timeout');
  });
});
