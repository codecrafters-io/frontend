import VoiceInterviewService, {
  type VoiceInterviewConversation,
  type VoiceInterviewConversationCallbacks,
  type VoiceInterviewMode,
  type VoiceInterviewSessionOptions,
} from 'codecrafters-frontend/services/voice-interview';

export default class FakeVoiceInterviewService extends VoiceInterviewService {
  contextualUpdates: string[] = [];
  lastSessionOptions: VoiceInterviewSessionOptions | null = null;
  mutedStates: boolean[] = [];

  #callbacks: VoiceInterviewConversationCallbacks | null = null;

  async checkMicrophone(): Promise<boolean> {
    this.microphoneStatus = 'ready';

    return true;
  }

  async createConversation(
    options: VoiceInterviewSessionOptions,
    callbacks: VoiceInterviewConversationCallbacks,
  ): Promise<VoiceInterviewConversation> {
    this.lastSessionOptions = options;
    this.#callbacks = callbacks;

    callbacks.onConnect('fake-conversation-id');

    return {
      endSession: async () => callbacks.onDisconnect('user'),
      getInputByteFrequencyData: () => new Uint8Array(64),
      getOutputByteFrequencyData: () => new Uint8Array(64),
      sendContextualUpdate: (text: string) => {
        this.contextualUpdates.push(text);
      },
      setMicMuted: (isMuted: boolean) => {
        this.mutedStates.push(isMuted);
      },
    };
  }

  #requireCallbacks(): VoiceInterviewConversationCallbacks {
    if (!this.#callbacks) {
      throw new Error('No voice interview session has been started');
    }

    return this.#callbacks;
  }

  simulateAgentEndedCall(): void {
    this.#requireCallbacks().onDisconnect('agent');
  }

  simulateAgentMessage(text: string): void {
    this.#requireCallbacks().onModeChange('speaking');
    this.#requireCallbacks().onMessage('agent', text);
  }

  simulateAgentSpeech(text: string, millisecondsPerCharacter: number): void {
    const chars = [...text];

    this.#requireCallbacks().onModeChange('speaking');

    this.#requireCallbacks().onAudioAlignment({
      chars,
      char_durations_ms: chars.map(() => millisecondsPerCharacter),
      char_start_times_ms: chars.map((_, index) => index * millisecondsPerCharacter),
    });

    this.#requireCallbacks().onMessage('agent', text);
  }

  simulateInterruption(): void {
    this.#requireCallbacks().onInterruption();
  }

  simulateModeChange(mode: VoiceInterviewMode): void {
    this.#requireCallbacks().onModeChange(mode);
  }

  simulateShowCode(parameters: { file_path: string; start_line: number; end_line: number }): string {
    return this.#requireCallbacks().showCode(parameters);
  }

  simulateUserMessage(text: string): void {
    this.#requireCallbacks().onModeChange('listening');
    this.#requireCallbacks().onMessage('user', text);
  }
}
