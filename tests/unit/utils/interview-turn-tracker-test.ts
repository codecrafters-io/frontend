import InterviewTurnTracker, { type InterviewTurnClock } from 'codecrafters-frontend/utils/interview-turn-tracker';
import type { SpeechAlignment } from 'codecrafters-frontend/utils/spoken-caption';
import { module, test } from 'qunit';

class FakeClock implements InterviewTurnClock {
  time = 0;

  #frames = new Map<number, () => void>();
  #nextFrameId = 1;

  advanceTo(time: number): void {
    this.time = time;

    const frames = [...this.#frames.values()];
    this.#frames.clear();
    frames.forEach((frame) => frame());
  }

  cancelFrame(id: number): void {
    this.#frames.delete(id);
  }

  now(): number {
    return this.time;
  }

  requestFrame(callback: () => void): number {
    const id = this.#nextFrameId++;
    this.#frames.set(id, callback);

    return id;
  }
}

function alignmentFor(text: string, millisecondsPerCharacter: number): SpeechAlignment {
  const chars = [...text];

  return {
    chars,
    char_durations_ms: chars.map(() => millisecondsPerCharacter),
    char_start_times_ms: chars.map((_, index) => index * millisecondsPerCharacter),
  };
}

function visibleTexts(tracker: InterviewTurnTracker): string[] {
  return tracker.captionLines.map((line) => `${line.role}: ${line.visibleText}`);
}

module('Unit | Utility | interview-turn-tracker', function () {
  test('a short pause does not end the interviewer turn', function (assert) {
    const clock = new FakeClock();
    const tracker = new InterviewTurnTracker(clock, 700);

    tracker.handleAgentAudioModeChange('speaking');
    tracker.handleAgentMessage('Walk me through your event loop.');
    clock.advanceTo(1000);
    tracker.handleAgentAudioModeChange('listening');
    clock.advanceTo(1300);

    assert.strictEqual(tracker.mode, 'speaking', 'a 300ms pause is still the interviewer speaking');

    tracker.handleAgentAudioModeChange('speaking');
    clock.advanceTo(2500);

    assert.strictEqual(tracker.mode, 'speaking');

    tracker.handleAgentAudioModeChange('listening');
    clock.advanceTo(3199);

    assert.strictEqual(tracker.mode, 'speaking');

    clock.advanceTo(3200);

    assert.strictEqual(tracker.mode, 'listening', 'the turn ends after 700ms of silence');
  });

  test('the turn stays with the interviewer until their scheduled speech has played', function (assert) {
    const clock = new FakeClock();
    const tracker = new InterviewTurnTracker(clock, 700);

    tracker.handleAudioAlignment(alignmentFor('Tell me about your parser', 100));
    tracker.handleAgentAudioModeChange('listening');
    clock.advanceTo(900);

    assert.strictEqual(tracker.mode, 'speaking', 'speech is still scheduled after the SDK reports silence');
    assert.deepEqual(visibleTexts(tracker), ['agent: Tell me about']);

    clock.advanceTo(2500);

    assert.strictEqual(tracker.mode, 'listening');
    assert.deepEqual(visibleTexts(tracker), ['agent: Tell me about your parser']);
  });

  test('an interruption ends the turn immediately and keeps only what was said', function (assert) {
    const clock = new FakeClock();
    const tracker = new InterviewTurnTracker(clock, 700);

    tracker.handleAudioAlignment(alignmentFor('Tell me about your parser', 100));
    tracker.handleAgentMessage('Tell me about your parser');
    clock.advanceTo(500);
    tracker.handleInterruption();

    assert.strictEqual(tracker.mode, 'listening');
    assert.deepEqual(visibleTexts(tracker), ['agent: Tell me']);

    tracker.handleAudioAlignment(alignmentFor('Sure.', 100));

    assert.deepEqual(visibleTexts(tracker), ['agent: Tell me', 'agent: Sure.'], 'the next reply starts a new line');
  });

  test('text for speech that already finished joins that speech instead of repeating it', function (assert) {
    const clock = new FakeClock();
    const tracker = new InterviewTurnTracker(clock, 0);

    tracker.handleAudioAlignment(alignmentFor('Hello there.', 10));
    tracker.handleAgentAudioModeChange('listening');
    clock.advanceTo(1000);
    tracker.handleAgentMessage('Hello there.');

    assert.deepEqual(visibleTexts(tracker), ['agent: Hello there.']);
  });

  test('each speaker gets their own line', function (assert) {
    const clock = new FakeClock();
    const tracker = new InterviewTurnTracker(clock, 0);

    tracker.handleAgentMessage('What does your parser return?');
    tracker.handleUserMessage('A list of arguments.');
    tracker.handleAgentMessage('And for a partial read?');

    assert.deepEqual(visibleTexts(tracker), ['agent: What does your parser return?', 'user: A list of arguments.', 'agent: And for a partial read?']);
  });

  test('stopping cancels pending work and hands the turn back', function (assert) {
    const clock = new FakeClock();
    const tracker = new InterviewTurnTracker(clock, 700);

    tracker.handleAudioAlignment(alignmentFor('Tell me about your parser', 100));
    tracker.stop();
    clock.advanceTo(900);

    assert.strictEqual(tracker.mode, 'listening');
    assert.deepEqual(visibleTexts(tracker), ['agent: Tell'], 'captions stop advancing');
  });
});
