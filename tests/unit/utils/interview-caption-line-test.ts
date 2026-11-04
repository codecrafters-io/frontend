import InterviewCaptionLine from 'codecrafters-frontend/utils/interview-caption-line';
import type { SpeechAlignment } from 'codecrafters-frontend/utils/spoken-caption';
import { module, test } from 'qunit';

function alignmentFor(text: string, millisecondsPerCharacter: number): SpeechAlignment {
  const chars = [...text];

  return {
    chars,
    char_durations_ms: chars.map(() => millisecondsPerCharacter),
    char_start_times_ms: chars.map((_, index) => index * millisecondsPerCharacter),
  };
}

module('Unit | Utility | interview-caption-line', function () {
  test('it follows the audio timing when the text and timing both arrive', function (assert) {
    const line = new InterviewCaptionLine(1, 'agent');

    line.speech.schedule(alignmentFor('Tell me about your parser', 100), 0);
    line.appendText('Tell me about your parser', 0);
    line.refresh(800);

    assert.strictEqual(line.visibleText, 'Tell me about', 'shows only the words spoken so far');
    assert.true(line.isRevealing(800));

    line.refresh(10_000);

    assert.strictEqual(line.visibleText, 'Tell me about your parser');
    assert.false(line.isRevealing(10_000));
  });

  test('it never takes back text that was already shown whole', function (assert) {
    const line = new InterviewCaptionLine(1, 'agent');

    line.appendText('Tell me about your parser', 0);
    line.refresh(0);

    assert.strictEqual(line.visibleText, 'Tell me about your parser', 'text without audio timing is shown whole');

    line.speech.schedule(alignmentFor('Tell me about your parser', 100), 10);
    line.refresh(10);

    assert.strictEqual(line.visibleText, 'Tell me about your parser', 'late audio timing does not shrink the caption');
    assert.false(line.isRevealing(10));
  });

  test('it shows everything that was spoken once finished', function (assert) {
    const line = new InterviewCaptionLine(1, 'agent');

    line.speech.schedule(alignmentFor('Tell me about your parser', 100), 0);
    line.finish();
    line.refresh(0);

    assert.strictEqual(line.visibleText, 'Tell me about your parser');
  });
});
