import InterviewTurnTracker, { type InterviewTurnMode } from 'codecrafters-frontend/utils/interview-turn-tracker';
import Service from '@ember/service';
import type InterviewCaptionLine from 'codecrafters-frontend/utils/interview-caption-line';
import type { ChallengeInterviewEndReason } from 'codecrafters-frontend/models/challenge-interview';
import type { InterviewCaptionRole } from 'codecrafters-frontend/utils/interview-caption-line';
import type { SpeechAlignment } from 'codecrafters-frontend/utils/spoken-caption';
import { tracked } from '@glimmer/tracking';

export type VoiceInterviewCodeHighlight = {
  endLine: number;
  path: string;
  startLine: number;
};

export type VoiceInterviewDisconnectReason = 'agent' | 'user' | 'error';
export type VoiceInterviewMicrophoneStatus = 'unchecked' | 'checking' | 'ready' | 'blocked';
export type VoiceInterviewMode = InterviewTurnMode;
export type VoiceInterviewStatus = 'idle' | 'connecting' | 'live' | 'ended' | 'failed';

export interface VoiceInterviewConversation {
  endSession(): Promise<void>;
  getInputByteFrequencyData(): Uint8Array;
  getOutputByteFrequencyData(): Uint8Array;
  sendContextualUpdate(text: string): void;
  setMicMuted(isMuted: boolean): void;
}

export interface VoiceInterviewConversationCallbacks {
  onAudioAlignment(alignment: SpeechAlignment): void;
  onConnect(conversationId: string): void;
  onDisconnect(reason: VoiceInterviewDisconnectReason): void;
  onError(message: string): void;
  onInterruption(): void;
  onMessage(role: InterviewCaptionRole, text: string): void;
  onModeChange(mode: VoiceInterviewMode): void;
  showCode(parameters: unknown): string;
}

export interface VoiceInterviewSessionOptions {
  availableFilePaths: string[];
  conversationToken: string;
  dynamicVariables: Record<string, string | number | boolean>;
  onEnded: (conversationId: string | null, reason: ChallengeInterviewEndReason) => void;
}

type ShowCodeParameters = {
  end_line?: number | string;
  file_path?: string;
  start_line?: number | string;
};

export default class VoiceInterviewService extends Service {
  @tracked codeHighlight: VoiceInterviewCodeHighlight | null = null;
  @tracked conversationId: string | null = null;
  @tracked errorMessage: string | null = null;
  @tracked isMuted = false;
  @tracked microphoneStatus: VoiceInterviewMicrophoneStatus = 'unchecked';
  @tracked status: VoiceInterviewStatus = 'idle';
  @tracked turns = new InterviewTurnTracker();

  interviewerJoinTimeoutMs = 15_000;

  #availableFilePaths: string[] = [];
  #conversation: VoiceInterviewConversation | null = null;
  #interviewerJoinTimeout: number | null = null;
  #liveSince: number | null = null;
  #onEnded: VoiceInterviewSessionOptions['onEnded'] | null = null;
  #requestedEndReason: ChallengeInterviewEndReason | null = null;

  get captionLines(): InterviewCaptionLine[] {
    return this.turns.captionLines;
  }

  get isConnecting(): boolean {
    return this.status === 'connecting';
  }

  get isLive(): boolean {
    return this.status === 'live';
  }

  get liveSince(): number | null {
    return this.#liveSince;
  }

  get mode(): VoiceInterviewMode {
    return this.turns.mode;
  }

  #buildCallbacks(): VoiceInterviewConversationCallbacks {
    return {
      onAudioAlignment: (alignment) => {
        this.#markInterviewerJoined();
        this.turns.handleAudioAlignment(alignment);
      },
      onConnect: (conversationId) => {
        this.conversationId = conversationId;
      },
      onDisconnect: (reason) => this.#finish(reason),
      onError: (message) => {
        this.errorMessage = message;
      },
      onInterruption: () => this.turns.handleInterruption(),
      onMessage: (role, text) => {
        if (role === 'agent') {
          this.#markInterviewerJoined();
          this.turns.handleAgentMessage(text);
        } else {
          this.turns.handleUserMessage(text);
        }
      },
      onModeChange: (mode) => {
        if (mode === 'speaking') {
          this.#markInterviewerJoined();
        }

        this.turns.handleAgentAudioModeChange(mode);
      },
      showCode: (parameters) => this.#showCode(parameters as ShowCodeParameters),
    };
  }

  async checkMicrophone(): Promise<boolean> {
    this.microphoneStatus = 'checking';

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      this.microphoneStatus = 'ready';

      return true;
    } catch {
      this.microphoneStatus = 'blocked';

      return false;
    }
  }

  #clearInterviewerJoinTimeout(): void {
    if (this.#interviewerJoinTimeout !== null) {
      window.clearTimeout(this.#interviewerJoinTimeout);
      this.#interviewerJoinTimeout = null;
    }
  }

  // Overridden in tests so no real WebRTC session is opened.
  async createConversation(
    options: VoiceInterviewSessionOptions,
    callbacks: VoiceInterviewConversationCallbacks,
  ): Promise<VoiceInterviewConversation> {
    const { Conversation } = await import('@elevenlabs/client');

    let audioEventId = 0;
    let interruptedEventId = 0;

    return Conversation.startSession({
      clientTools: {
        show_code: (parameters: unknown) => callbacks.showCode(parameters),
      },
      connectionType: 'webrtc',
      conversationToken: options.conversationToken,
      dynamicVariables: options.dynamicVariables,
      // The SDK reports alignment before it drops audio from an interrupted reply.
      onAudioAlignment: (alignment) => {
        if (audioEventId >= interruptedEventId) {
          callbacks.onAudioAlignment(alignment);
        }
      },
      onConnect: ({ conversationId }) => callbacks.onConnect(conversationId),
      onDisconnect: (details) => callbacks.onDisconnect(details.reason),
      onError: (message) => callbacks.onError(message),
      onIncomingEvent: (event: { type?: string; audio_event?: { event_id?: number } }) => {
        if (event.type === 'audio') {
          audioEventId = event.audio_event?.event_id ?? audioEventId;
        }
      },
      onInterruption: ({ event_id }) => {
        interruptedEventId = event_id;
        callbacks.onInterruption();
      },
      onMessage: ({ message, role }) => callbacks.onMessage(role, message),
      onModeChange: ({ mode }) => callbacks.onModeChange(mode),
    });
  }

  async end(reason: ChallengeInterviewEndReason = 'user_ended'): Promise<void> {
    this.#requestedEndReason ||= reason;

    const conversation = this.#conversation;

    if (!conversation) {
      return;
    }

    this.#conversation = null;

    try {
      await conversation.endSession();
    } catch {
      this.#finish('user');
    }
  }

  #finish(reason: VoiceInterviewDisconnectReason): void {
    if (this.status === 'ended' || this.status === 'failed') {
      return;
    }

    this.#conversation = null;
    this.#clearInterviewerJoinTimeout();
    this.turns.stop();

    const onEnded = this.#onEnded;
    this.#onEnded = null;

    if (reason === 'error' && !this.conversationId) {
      this.errorMessage ||= 'The connection to the interviewer dropped.';
      this.status = 'failed';

      return;
    }

    const hasInterviewerSpoken = this.#liveSince !== null;
    let endReason: ChallengeInterviewEndReason = reason === 'agent' ? 'agent_ended' : 'user_ended';

    if (this.#requestedEndReason) {
      endReason = this.#requestedEndReason;
    } else if (reason === 'error' || !hasInterviewerSpoken) {
      endReason = 'connection_error';
    }

    this.status = 'ended';
    onEnded?.(hasInterviewerSpoken ? this.conversationId : null, endReason);
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.#conversation || !this.isLive) {
      return null;
    }

    return this.mode === 'speaking' ? this.#conversation.getOutputByteFrequencyData() : this.#conversation.getInputByteFrequencyData();
  }

  // Joining the room doesn't mean the agent is there: it can fail to start and never speak.
  #markInterviewerJoined(): void {
    if (this.status !== 'connecting') {
      return;
    }

    this.#clearInterviewerJoinTimeout();
    this.#liveSince = performance.now();
    this.status = 'live';
  }

  #reset(): void {
    this.#clearInterviewerJoinTimeout();
    this.#liveSince = null;
    this.turns.stop();
    this.turns = new InterviewTurnTracker();
    this.codeHighlight = null;
    this.conversationId = null;
    this.errorMessage = null;
    this.isMuted = false;
    this.#availableFilePaths = [];
    this.#conversation = null;
    this.#onEnded = null;
    this.#requestedEndReason = null;
  }

  sendContextualUpdate(text: string): void {
    this.#conversation?.sendContextualUpdate(text);
  }

  #showCode({ end_line, file_path, start_line }: ShowCodeParameters): string {
    const path =
      this.#availableFilePaths.find((item) => item === file_path) ||
      this.#availableFilePaths.find((item) => file_path?.endsWith(`/${item}`) || item.endsWith(`/${file_path}`));

    if (!path) {
      return `No file at "${file_path}". Available files: ${this.#availableFilePaths.join(', ')}`;
    }

    const startLine = Math.max(1, Number(start_line) || 1);
    const endLine = Math.max(startLine, Number(end_line) || startLine);

    this.codeHighlight = { endLine, path, startLine };

    return `Showing ${path} lines ${startLine}-${endLine} to the candidate.`;
  }

  async start(options: VoiceInterviewSessionOptions): Promise<void> {
    this.#reset();
    this.#availableFilePaths = options.availableFilePaths;
    this.#onEnded = options.onEnded;
    this.status = 'connecting';

    try {
      const conversation = await this.createConversation(options, this.#buildCallbacks());

      // The user can end the interview while the connection is still being set up.
      if (this.#requestedEndReason) {
        await conversation.endSession();

        return;
      }

      this.#conversation = conversation;

      if (this.status === 'connecting') {
        this.#interviewerJoinTimeout = window.setTimeout(() => void this.end('connection_error'), this.interviewerJoinTimeoutMs);
      }
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Could not connect to the interviewer.';
      this.status = 'failed';
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.#conversation?.setMicMuted(this.isMuted);
  }

  willDestroy(): void {
    super.willDestroy();
    this.#clearInterviewerJoinTimeout();
    this.turns.stop();
    void this.end();
  }
}

declare module '@ember/service' {
  interface Registry {
    'voice-interview': VoiceInterviewService;
  }
}
