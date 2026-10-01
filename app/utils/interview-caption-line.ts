import config from 'codecrafters-frontend/config/environment';
import SpokenCaption from 'codecrafters-frontend/utils/spoken-caption';
import { tracked } from '@glimmer/tracking';

// How long a reply's text waits for its audio timing before it's shown whole instead.
const UNTIMED_TEXT_DELAY_MS = config.environment === 'test' ? 0 : 800;

export type InterviewCaptionRole = 'agent' | 'user';

export default class InterviewCaptionLine {
  @tracked visibleText = '';

  readonly id: number;
  readonly role: InterviewCaptionRole;
  readonly speech = new SpokenCaption();

  #hasShownUntimedText = false;
  #isFinished = false;
  #text = '';
  #textReceivedAt = 0;

  constructor(id: number, role: InterviewCaptionRole) {
    this.id = id;
    this.role = role;
  }

  get hasText(): boolean {
    return this.#text !== '';
  }

  get isFinished(): boolean {
    return this.#isFinished;
  }

  appendText(text: string, receivedAt: number): void {
    if (!this.hasText) {
      this.#textReceivedAt = receivedAt;
    }

    this.#text = this.hasText ? `${this.#text} ${text}` : text;
  }

  finish(): void {
    this.#isFinished = true;
  }

  isRevealing(now: number): boolean {
    return !this.isFinished && this.#textAt(now) !== this.#textAt(Infinity);
  }

  refresh(now: number): void {
    const text = this.#textAt(now);

    if (!this.speech.hasSpeech && text !== '') {
      this.#hasShownUntimedText = true;
    }

    if (text !== this.visibleText) {
      this.visibleText = text;
    }
  }

  #textAt(now: number): string {
    if (this.speech.hasSpeech && !this.#hasShownUntimedText) {
      return this.isFinished ? this.speech.fullText : this.speech.textSpokenBy(now);
    }

    return this.isFinished || this.#hasShownUntimedText || now - this.#textReceivedAt >= UNTIMED_TEXT_DELAY_MS ? this.#text : '';
  }
}
