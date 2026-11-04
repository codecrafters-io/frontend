export type SpeechAlignment = {
  chars: string[];
  char_durations_ms: number[];
  char_start_times_ms: number[];
};

type TimedCharacter = {
  character: string;
  startsAt: number;
};

// A chunk arriving this long after the last one ended is a new utterance, e.g. after a tool call.
const UTTERANCE_GAP_MS = 250;
const WHITESPACE = /\s/;

export default class SpokenCaption {
  #characters: TimedCharacter[] = [];
  #endsAt = 0;

  get endsAt(): number {
    return this.#endsAt;
  }

  get fullText(): string {
    return this.#textThrough(this.#characters.length);
  }

  get hasSpeech(): boolean {
    return this.#characters.length > 0;
  }

  #countStartedBy(time: number): number {
    const firstUnstartedIndex = this.#characters.findIndex((character) => character.startsAt > time);

    return firstUnstartedIndex === -1 ? this.#characters.length : firstUnstartedIndex;
  }

  cutOffAt(time: number): void {
    this.#characters = this.#characters.slice(0, this.#endOfWordAt(this.#countStartedBy(time)));
    this.#endsAt = Math.min(this.#endsAt, time);
  }

  #endOfWordAt(count: number): number {
    let end = count;

    while (end > 0 && end < this.#characters.length && !this.#isWhitespaceAt(end - 1) && !this.#isWhitespaceAt(end)) {
      end++;
    }

    return end;
  }

  #isNewUtterance(receivedAt: number): boolean {
    return this.hasSpeech && receivedAt - this.#endsAt > UTTERANCE_GAP_MS;
  }

  #isWhitespaceAt(index: number): boolean {
    return WHITESPACE.test(this.#characters[index]?.character || '');
  }

  schedule({ chars, char_durations_ms, char_start_times_ms }: SpeechAlignment, receivedAt: number): void {
    if (chars.length === 0) {
      return;
    }

    const chunkStartsAt = Math.max(this.#endsAt, receivedAt);
    const firstStartTime = char_start_times_ms[0] || 0;

    if (this.#isNewUtterance(receivedAt) && !this.#isWhitespaceAt(this.#characters.length - 1) && !WHITESPACE.test(chars[0]!)) {
      this.#characters.push({ character: ' ', startsAt: chunkStartsAt });
    }

    chars.forEach((character, index) => {
      this.#characters.push({ character, startsAt: chunkStartsAt + (char_start_times_ms[index] || 0) - firstStartTime });
    });

    const lastIndex = chars.length - 1;
    this.#endsAt = chunkStartsAt + (char_start_times_ms[lastIndex] || 0) - firstStartTime + (char_durations_ms[lastIndex] || 0);
  }

  textSpokenBy(time: number): string {
    return this.#textThrough(this.#endOfWordAt(this.#countStartedBy(time)));
  }

  #textThrough(count: number): string {
    return this.#characters
      .slice(0, count)
      .map((character) => character.character)
      .join('')
      .trim();
  }
}
