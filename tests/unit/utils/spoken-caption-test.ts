import SpokenCaption, { type SpeechAlignment } from 'codecrafters-frontend/utils/spoken-caption';
import { module, test } from 'qunit';

function alignmentFor(text: string, millisecondsPerCharacter: number, firstStartTime = 0): SpeechAlignment {
  const chars = [...text];

  return {
    chars,
    char_durations_ms: chars.map(() => millisecondsPerCharacter),
    char_start_times_ms: chars.map((_, index) => firstStartTime + index * millisecondsPerCharacter),
  };
}

module('Unit | Utility | spoken-caption', function () {
  test('it is empty before any speech is scheduled', function (assert) {
    const caption = new SpokenCaption();

    caption.schedule(alignmentFor('', 100), 0);

    assert.false(caption.hasSpeech);
    assert.strictEqual(caption.textSpokenBy(10_000), '');
    assert.strictEqual(caption.endsAt, 0);
  });

  test('it reveals whole words as each one starts being spoken', function (assert) {
    const caption = new SpokenCaption();

    caption.schedule(alignmentFor('Hello there world', 100), 1000);

    assert.strictEqual(caption.textSpokenBy(999), '', 'nothing before the first word');
    assert.strictEqual(caption.textSpokenBy(1000), 'Hello', 'the first word appears whole as soon as it starts');
    assert.strictEqual(caption.textSpokenBy(1550), 'Hello', 'the space after a word does not reveal the next word');
    assert.strictEqual(caption.textSpokenBy(1600), 'Hello there');
    assert.strictEqual(caption.textSpokenBy(99_999), 'Hello there world');
    assert.strictEqual(caption.endsAt, 1000 + 1700);
  });

  test('it queues chunks that arrive faster than they are spoken', function (assert) {
    const caption = new SpokenCaption();

    caption.schedule(alignmentFor('One two ', 100), 0);
    caption.schedule(alignmentFor('three', 100), 50);

    assert.strictEqual(caption.textSpokenBy(799), 'One two', 'the second chunk waits for the first to finish');
    assert.strictEqual(caption.textSpokenBy(800), 'One two three');
    assert.strictEqual(caption.endsAt, 1300);
  });

  test('it starts a chunk that arrives after a pause when it arrives, with a space between utterances', function (assert) {
    const caption = new SpokenCaption();

    caption.schedule(alignmentFor('Let me show you.', 50), 0);
    caption.schedule(alignmentFor('Here it is.', 50), 3000);

    assert.strictEqual(caption.textSpokenBy(2999), 'Let me show you.');
    assert.strictEqual(caption.textSpokenBy(3000), 'Let me show you. Here');
    assert.strictEqual(caption.fullText, 'Let me show you. Here it is.');
  });

  test('it treats timestamps as relative to the start of each chunk', function (assert) {
    const caption = new SpokenCaption();

    caption.schedule(alignmentFor('Hi', 100, 5000), 0);

    assert.strictEqual(caption.textSpokenBy(0), 'Hi');
    assert.strictEqual(caption.endsAt, 200);
  });

  test('it drops the words that were never spoken when cut off', function (assert) {
    const caption = new SpokenCaption();

    caption.schedule(alignmentFor('I was about to say more', 100), 0);
    caption.cutOffAt(650);

    assert.strictEqual(caption.fullText, 'I was about', 'keeps the word that was being spoken');
    assert.strictEqual(caption.textSpokenBy(99_999), 'I was about');
    assert.strictEqual(caption.endsAt, 650);
  });
});
