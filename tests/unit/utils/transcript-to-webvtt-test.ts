import transcriptToWebvtt from 'codecrafters-frontend/utils/transcript-to-webvtt';
import { module, test } from 'qunit';

module('Unit | Utility | transcript-to-webvtt', function () {
  test('each turn becomes a cue that lasts until the next turn starts', function (assert) {
    const webvtt = transcriptToWebvtt([
      { role: 'agent', text: 'How did you handle quoting?', timeInCallSec: 3 },
      { role: 'user', text: 'I track whether I am inside double quotes.', timeInCallSec: 3725.5 },
    ]);

    assert.strictEqual(
      webvtt,
      [
        'WEBVTT',
        '00:00:03.000 --> 01:02:05.500\nInterviewer: How did you handle quoting?',
        '01:02:05.500 --> 01:02:15.500\nParticipant: I track whether I am inside double quotes.',
      ].join('\n\n'),
    );
  });

  test('turns at the same moment still get a visible cue', function (assert) {
    const webvtt = transcriptToWebvtt([
      { role: 'agent', text: 'Hi', timeInCallSec: 0 },
      { role: 'user', text: 'Hello', timeInCallSec: 0 },
    ]);

    assert.true(webvtt.includes('00:00:00.000 --> 00:00:01.000\nInterviewer: Hi'));
  });

  test('an empty transcript is a valid empty file', function (assert) {
    assert.strictEqual(transcriptToWebvtt([]), 'WEBVTT');
  });
});
