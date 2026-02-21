import type { Sprite } from 'ember-animated';
import { easeIn, easeOut } from 'ember-animated/easings/cosine';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

interface Signature {
  insertedSprites: Sprite[];
  keptSprites: Sprite[];
  removedSprites: Sprite[];
}

// eslint-disable-next-line require-yield
export default function* coursePageOverlayTransition({ insertedSprites, keptSprites, removedSprites }: Signature) {
  insertedSprites.forEach((sprite) => {
    fadeIn(sprite);
    sprite.startTranslatedBy(0, -50);
    sprite.applyStyles({ 'z-index': '1' });
    move(sprite, { easing: easeOut });
  });

  keptSprites.forEach((sprite) => {
    move(sprite);
  });

  removedSprites.forEach((sprite) => {
    fadeOut(sprite);
    sprite.applyStyles({ 'z-index': '1' });
    sprite.endTranslatedBy(0, -50);
    move(sprite, { easing: easeIn });
  });
}
