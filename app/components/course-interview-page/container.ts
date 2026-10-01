import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type Owner from '@ember/owner';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import type { ChallengeInterviewEndReason } from 'codecrafters-frontend/models/challenge-interview';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { waitForPromise } from '@ember/test-waiters';

const DEFAULT_MAX_DURATION_SECONDS = 480;
const POLL_INTERVAL_MS = config.environment === 'test' ? 0 : 2000;
const WRAP_UP_NOTICE = "Time is nearly up. Let them finish the answer they're giving, then thank them, say goodbye and end the call.";
const WRAP_UP_NOTICE_SECONDS = 90;

export type CourseInterviewPhase = 'lobby' | 'preparing' | 'live' | 'scoring' | 'report' | 'failed';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    initialInterview: ChallengeInterviewModel | null;
    milestone: InterviewMilestone;
    repository: RepositoryModel;
  };
}

function phaseForInterview(interview: ChallengeInterviewModel | null): CourseInterviewPhase {
  if (interview?.isScored) {
    return 'report';
  } else if (interview?.isScoring) {
    return 'scoring';
  } else if (interview?.isFailed) {
    return 'failed';
  } else {
    return 'lobby';
  }
}

export default class CourseInterviewPageContainer extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;
  @service declare voiceInterview: VoiceInterviewService;

  @tracked callDurationSeconds = DEFAULT_MAX_DURATION_SECONDS;
  @tracked failureMessage: string | null = null;
  @tracked interview: ChallengeInterviewModel | null;
  @tracked phase: CourseInterviewPhase;
  @tracked remainingSeconds = DEFAULT_MAX_DURATION_SECONDS;
  @tracked shouldShowCaptions = true;

  #countdownInterval: number | null = null;
  #hasSentWrapUpNotice = false;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.interview = args.initialInterview;
    this.phase = phaseForInterview(args.initialInterview);
    this.failureMessage = args.initialInterview?.errorMessage || null;
  }

  get agentVariables(): Record<string, string> {
    const currentUser = this.authenticator.currentUser;
    const firstName = currentUser?.name?.split(' ')[0] || currentUser?.username || 'there';

    return {
      call_minutes: String(Math.round(this.callDurationSeconds / 60)),
      challenge_name: this.args.repository.course.name,
      first_name: firstName,
      interview_brief: this.interview?.brief || '',
      interview_id: this.interview?.id || '',
      language_name: this.args.repository.language?.name || '',
      milestone_title: this.args.milestone.title,
    };
  }

  get codeFiles() {
    return this.interview?.codeFiles || [];
  }

  get phaseIsFailed(): boolean {
    return this.phase === 'failed';
  }

  get phaseIsLive(): boolean {
    return this.phase === 'live';
  }

  get phaseIsLobby(): boolean {
    return this.phase === 'lobby';
  }

  get phaseIsPreparing(): boolean {
    return this.phase === 'preparing';
  }

  get phaseIsReport(): boolean {
    return this.phase === 'report';
  }

  get phaseIsScoring(): boolean {
    return this.phase === 'scoring';
  }

  finishInterviewTask = task({ drop: true }, async (conversationId: string | null, endReason: ChallengeInterviewEndReason): Promise<void> => {
    this.#stopCountdown();

    const interview = this.interview;

    if (!interview) {
      return;
    }

    this.phase = 'scoring';

    try {
      await waitForPromise(interview.markAsEnded({ conversation_id: conversationId, end_reason: endReason }));
      await this.pollInterviewTask.perform(interview, 'scoring');
    } catch {
      this.#fail("We couldn't save your interview. Please try again.");

      return;
    }

    if (interview.isScored) {
      this.phase = 'report';
    } else {
      this.#fail(interview.errorMessage || "We couldn't score this interview.");
    }
  });

  pollInterviewTask = task(async (interview: ChallengeInterviewModel, whileStatus: 'generating' | 'scoring'): Promise<void> => {
    while (interview.status === whileStatus) {
      await timeout(POLL_INTERVAL_MS);
      await interview.reload();
    }
  });

  startInterviewTask = task({ drop: true }, async (): Promise<void> => {
    const hasMicrophoneAccess = await this.voiceInterview.checkMicrophone();

    if (!hasMicrophoneAccess) {
      return;
    }

    this.failureMessage = null;
    this.phase = 'preparing';

    const interview = this.store.createRecord('challenge-interview', {
      milestoneSlug: this.args.milestone.slug,
      repository: this.args.repository,
    });

    this.interview = interview;

    try {
      await interview.save();
      await this.pollInterviewTask.perform(interview, 'generating');
    } catch {
      if (interview.isNew) {
        interview.unloadRecord();
      }

      this.#fail("We couldn't reach the interview service. Please try again.");

      return;
    }

    if (!interview.isReady || !interview.conversationToken) {
      this.#fail(interview.errorMessage || "We couldn't prepare questions for your code.");

      return;
    }

    this.callDurationSeconds = interview.maxDurationSeconds || DEFAULT_MAX_DURATION_SECONDS;
    this.remainingSeconds = this.callDurationSeconds;
    this.#hasSentWrapUpNotice = false;
    this.phase = 'live';

    await this.voiceInterview.start({
      availableFilePaths: this.codeFiles.map((file) => file.path),
      conversationToken: interview.conversationToken,
      dynamicVariables: this.agentVariables,
      onEnded: this.handleVoiceInterviewEnded,
    });

    if (this.voiceInterview.status === 'failed') {
      this.#fail(this.voiceInterview.errorMessage || "We couldn't connect you to the interviewer.");

      return;
    }

    if (this.phase === 'live') {
      this.#startCountdown();
    }
  });

  #fail(message: string): void {
    this.#stopCountdown();
    this.failureMessage = message;
    this.phase = 'failed';
  }

  @action
  handleCaptionsToggle(): void {
    this.shouldShowCaptions = !this.shouldShowCaptions;
  }

  @action
  async handleDidInsert(): Promise<void> {
    if (this.phase === 'scoring' && this.interview) {
      await this.pollInterviewTask.perform(this.interview, 'scoring');
      this.phase = phaseForInterview(this.interview);
    }
  }

  @action
  handleEndInterviewButtonClick(): void {
    void this.voiceInterview.end('user_ended');
  }

  @action
  async handleRetakeButtonClick(): Promise<void> {
    this.interview = null;
    this.failureMessage = null;
    this.phase = 'lobby';

    if (this.args.initialInterview) {
      this.router.transitionTo('course-interview', this.args.repository.course.slug, this.args.milestone.slug, {
        queryParams: { interview: null, repo: this.args.repository.id },
      });
    }
  }

  @action
  handleStartInterviewButtonClick(): void {
    this.startInterviewTask.perform();
  }

  @action
  handleVoiceInterviewEnded(conversationId: string | null, endReason: ChallengeInterviewEndReason): void {
    if (this.isDestroying || this.isDestroyed) {
      void this.interview?.markAsEnded({ conversation_id: conversationId, end_reason: endReason }).catch(() => {});

      return;
    }

    this.finishInterviewTask.perform(conversationId, endReason);
  }

  // A native interval keeps the countdown out of the run loop, so test helpers don't wait on it.
  #startCountdown(): void {
    if (config.environment === 'test') {
      return;
    }

    this.#stopCountdown();
    this.#countdownInterval = window.setInterval(this.#tickCountdown, 1000);
  }

  #stopCountdown(): void {
    if (this.#countdownInterval !== null) {
      window.clearInterval(this.#countdownInterval);
      this.#countdownInterval = null;
    }
  }

  // Measured from the interviewer's first word, since background tabs delay interval callbacks.
  #tickCountdown = (): void => {
    const liveSince = this.voiceInterview.liveSince;

    if (liveSince === null) {
      return;
    }

    const elapsedSeconds = Math.floor((performance.now() - liveSince) / 1000);
    this.remainingSeconds = Math.max(0, this.callDurationSeconds - elapsedSeconds);

    if (this.remainingSeconds <= WRAP_UP_NOTICE_SECONDS && !this.#hasSentWrapUpNotice) {
      this.#hasSentWrapUpNotice = true;
      this.voiceInterview.sendContextualUpdate(WRAP_UP_NOTICE);
    }

    if (this.remainingSeconds === 0) {
      this.#stopCountdown();
      void this.voiceInterview.end('time_limit');
    }
  };

  willDestroy(): void {
    super.willDestroy();
    this.#stopCountdown();
    void this.voiceInterview.end('user_ended');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseInterviewPage::Container': typeof CourseInterviewPageContainer;
  }
}
