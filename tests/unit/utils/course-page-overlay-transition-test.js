import coursePageOverlayTransition from 'codecrafters-frontend/utils/course-page-overlay-transition';
import Motion from 'ember-animated/-private/motion';
import { module, test } from 'qunit';

module('Unit | Utility | course-page-overlay-transition', function (hooks) {
  hooks.beforeEach(function () {
    this.originalMotionRun = Motion.prototype.run;
    Motion.prototype.run = () => null;
  });

  hooks.afterEach(function () {
    Motion.prototype.run = this.originalMotionRun;
  });

  test('it applies enter, keep and leave operations to sprites', function (assert) {
    let insertedSpriteApplyStylesCalls = 0;
    let insertedSpriteStartTranslatedByCalls = 0;
    let removedSpriteApplyStylesCalls = 0;
    let removedSpriteEndTranslatedByCalls = 0;

    const insertedSprite = {
      applyStyles() {
        insertedSpriteApplyStylesCalls += 1;
      },
      element: {},
      startTranslatedBy() {
        insertedSpriteStartTranslatedByCalls += 1;
      },
    };

    const keptSprite = { element: {} };

    const removedSprite = {
      applyStyles() {
        removedSpriteApplyStylesCalls += 1;
      },
      element: {},
      endTranslatedBy() {
        removedSpriteEndTranslatedByCalls += 1;
      },
    };

    const transitionIterator = coursePageOverlayTransition({
      insertedSprites: [insertedSprite],
      keptSprites: [keptSprite],
      removedSprites: [removedSprite],
    });
    const transitionResult = transitionIterator.next();

    assert.true(transitionResult.done, 'transition runs synchronously');
    assert.strictEqual(insertedSpriteApplyStylesCalls, 1, 'inserted sprites receive overlay styles');
    assert.strictEqual(insertedSpriteStartTranslatedByCalls, 1, 'inserted sprites get starting translation');
    assert.strictEqual(removedSpriteApplyStylesCalls, 1, 'removed sprites receive overlay styles');
    assert.strictEqual(removedSpriteEndTranslatedByCalls, 1, 'removed sprites get ending translation');
  });
});
