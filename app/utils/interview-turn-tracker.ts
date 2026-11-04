import InterviewCaptionLine, { type InterviewCaptionRole } from 'codecrafters-frontend/utils/interview-caption-line';
import config from 'codecrafters-frontend/config/environment';
import type { SpeechAlignment } from 'codecrafters-frontend/utils/spoken-caption';
import { tracked } from '@glimmer/tracking';

// The SDK reports "listening" at every pause between the agent's sentences over WebRTC.
const DEFAULT_AGENT_SILENCE_BEFORE_TURN_ENDS_MS = config.environment === 'test' ? 0 : 700;
const MAX_CAPTION_LINES = 50;

export type InterviewTurnMode = 'listening' | 'speaking';

export interface InterviewTurnClock {
  cancelFrame(id: number): void;
  now(): number;
  requestFrame(callback: () => void): number;
}

const browserClock: InterviewTurnClock = {
  cancelFrame: (id) => window.cancelAnimationFrame(id),
  now: () => performance.now(),
  requestFrame: (callback) => window.requestAnimationFrame(callback),
};

export default class InterviewTurnTracker {
  @tracked captionLines: InterviewCaptionLine[] = [];
  @tracked mode: InterviewTurnMode = 'listening';

  #agentAudioMode: InterviewTurnMode = 'listening';
  #agentSilenceBeforeTurnEndsMs: number;
  #agentWentQuietAt = 0;
  #clock: InterviewTurnClock;
  #frame: number | null = null;
  #nextLineId = 1;

  constructor(clock: InterviewTurnClock = browserClock, agentSilenceBeforeTurnEndsMs = DEFAULT_AGENT_SILENCE_BEFORE_TURN_ENDS_MS) {
    this.#clock = clock;
    this.#agentSilenceBeforeTurnEndsMs = agentSilenceBeforeTurnEndsMs;
  }

  get #openAgentLine(): InterviewCaptionLine | null {
    const line = this.captionLines.at(-1);

    return line?.role === 'agent' && !line.isFinished ? line : null;
  }

  #addLine(role: InterviewCaptionRole): InterviewCaptionLine {
    const line = new InterviewCaptionLine(this.#nextLineId++, role);
    this.captionLines = [...this.captionLines, line].slice(-MAX_CAPTION_LINES);

    return line;
  }

  #agentHasFinishedTurn(now: number): boolean {
    return (
      this.#agentAudioMode === 'listening' &&
      now - this.#agentWentQuietAt >= this.#agentSilenceBeforeTurnEndsMs &&
      now >= (this.#openAgentLine?.speech.endsAt || 0)
    );
  }

  handleAgentAudioModeChange(mode: InterviewTurnMode): void {
    this.#agentAudioMode = mode;

    if (mode === 'speaking') {
      this.mode = 'speaking';
    } else {
      this.#agentWentQuietAt = this.#clock.now();
    }

    this.#refresh();
  }

  handleAgentMessage(text: string): void {
    if (!text.trim()) {
      return;
    }

    const lastLine = this.captionLines.at(-1);
    const hasSpeechAwaitingText = lastLine?.role === 'agent' && lastLine.speech.hasSpeech && !lastLine.hasText;
    const line = this.#openAgentLine || (hasSpeechAwaitingText ? lastLine : this.#addLine('agent'));

    line.appendText(text.trim(), this.#clock.now());
    this.#refresh();
  }

  handleAudioAlignment(alignment: SpeechAlignment): void {
    const line = this.#openAgentLine || this.#addLine('agent');

    line.speech.schedule(alignment, this.#clock.now());
    this.mode = 'speaking';
    this.#refresh();
  }

  handleInterruption(): void {
    const now = this.#clock.now();
    const line = this.#openAgentLine;

    line?.speech.cutOffAt(now);
    line?.finish();
    this.#agentAudioMode = 'listening';
    this.#agentWentQuietAt = now;
    this.mode = 'listening';
    this.#refresh();
  }

  handleUserMessage(text: string): void {
    if (!text.trim()) {
      return;
    }

    this.#openAgentLine?.finish();

    const line = this.#addLine('user');
    line.appendText(text.trim(), this.#clock.now());
    line.finish();
    this.#refresh();
  }

  #refresh = (): void => {
    this.#frame = null;

    const now = this.#clock.now();

    if (this.mode === 'speaking' && this.#agentHasFinishedTurn(now)) {
      this.#openAgentLine?.finish();
      this.mode = 'listening';
    }

    this.captionLines.slice(-2).forEach((line) => line.refresh(now));

    const isWaitingForTurnToEnd = this.mode === 'speaking' && this.#agentAudioMode === 'listening';

    if ((isWaitingForTurnToEnd || this.#openAgentLine?.isRevealing(now)) && this.#frame === null) {
      this.#frame = this.#clock.requestFrame(this.#refresh);
    }
  };

  stop(): void {
    if (this.#frame !== null) {
      this.#clock.cancelFrame(this.#frame);
      this.#frame = null;
    }

    this.mode = 'listening';
  }
}
