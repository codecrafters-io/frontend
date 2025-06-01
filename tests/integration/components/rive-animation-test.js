import { module, test } from 'qunit';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { render, settled, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rive-animation', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders and initializes correctly', async function (assert) {
    await render(hbs`
      <div class="w-[200px] h-[200px]">
        <RiveAnimation @src="/assets/animations/gleam_logo_animation.riv" />
      </div>
    `);

    // Check that canvas is rendered with correct classes
    const canvas = this.element.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');
    assert.strictEqual(canvas?.className, 'w-full h-full block max-w-full', 'Canvas has correct classes');

    // Wait for the animation to load and render
    await settled();

    // Check that canvas has been initialized
    assert.ok(canvas.width > 0, 'Canvas has width');
    assert.ok(canvas.height > 0, 'Canvas has height');
    const context = canvas.getContext('2d');
    assert.ok(context, 'Canvas has 2D context');

    // Wait for the animation to render at least one frame
    await waitUntil(
      () => {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // Check if any pixel has non-zero alpha
        for (let i = 3; i < imageData.length; i += 4) {
          if (imageData[i] > 0) {
            return true;
          }
        }

        return false;
      },
      {
        timeout: 5000,
        timeoutMessage: 'Animation failed to render within 5 seconds',
      },
    );

    // Verify that the animation has rendered
    const finalImageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasVisiblePixels = false;

    for (let i = 3; i < finalImageData.length; i += 4) {
      if (finalImageData[i] > 0) {
        hasVisiblePixels = true;
        break;
      }
    }

    assert.ok(hasVisiblePixels, 'Animation has rendered visible pixels');
  });

  test('it works with different animation files', async function (assert) {
    await render(hbs`
      <div class="w-[200px] h-[200px]">
        <RiveAnimation @src="/assets/animations/pig_cuddly.riv" />
      </div>
    `);

    const canvas = this.element.querySelector('canvas');
    assert.ok(canvas, 'Canvas element exists');
    assert.strictEqual(canvas?.className, 'w-full h-full block max-w-full', 'Canvas has correct classes');

    // Wait for the animation to load and render
    await settled();

    // Check that canvas has been initialized
    assert.ok(canvas.width > 0, 'Canvas has width');
    assert.ok(canvas.height > 0, 'Canvas has height');
    const context = canvas.getContext('2d');
    assert.ok(context, 'Canvas has 2D context');

    // Wait for the animation to render at least one frame
    await waitUntil(
      () => {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

        // Check if any pixel has non-zero alpha
        for (let i = 3; i < imageData.length; i += 4) {
          if (imageData[i] > 0) {
            return true;
          }
        }

        return false;
      },
      {
        timeout: 5000,
        timeoutMessage: 'Animation failed to render within 5 seconds',
      },
    );

    // Verify that the animation has rendered
    const finalImageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let hasVisiblePixels = false;

    for (let i = 3; i < finalImageData.length; i += 4) {
      if (finalImageData[i] > 0) {
        hasVisiblePixels = true;
        break;
      }
    }

    assert.ok(hasVisiblePixels, 'Animation has rendered visible pixels');
  });
});
