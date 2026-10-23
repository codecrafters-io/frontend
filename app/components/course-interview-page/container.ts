import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import type ChallengeInterviewModel from 'codecrafters-frontend/models/challenge-interview';
import type InterviewMilestone from 'codecrafters-frontend/utils/interview-milestone';
import type Owner from '@ember/owner';
import type PartnerCompetitionModel from 'codecrafters-frontend/models/partner-competition';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type Transition from '@ember/routing/transition';
import type VoiceInterviewService from 'codecrafters-frontend/services/voice-interview';
import type { ChallengeInterviewEndReason } from 'codecrafters-frontend/models/challenge-interview';
import { action } from '@ember/object';
import { interviewServiceBusyMessage, interviewServiceRefusalMessage } from 'codecrafters-frontend/utils/interview-service-error';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { waitForPromise } from '@ember/test-waiters';

const DEFAULT_MAX_DURATION_SECONDS = 480;
const LEAVE_QUIZ_MESSAGE = 'Leaving ends the call and uses up this attempt. Leave anyway?';
const POLL_INTERVAL_MS = config.environment === 'test' ? 0 : 2000;
const WRAP_UP_NOTICE = "Time is nearly up. Let them finish the answer they're giving, then thank them, say goodbye and end the call.";
const WRAP_UP_NOTICE_SECONDS = 90;

export type CourseInterviewPhase = 'lobby' | 'preparing' | 'live' | 'scoring' | 'report' | 'submitted' | 'failed';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    competition?: PartnerCompetitionModel | null;
    initialInterview: ChallengeInterviewModel | null;
    milestone?: InterviewMilestone | null;
    repository: RepositoryModel;
  };
}

function phaseForInterview(interview: ChallengeInterviewModel | null, isQuiz: boolean): CourseInterviewPhase {
  if (isQuiz && interview?.isSubmitted) {
    return 'submitted';
  } else if (interview?.isScored) {
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
  @service declare router: RouterService;
  @service declare store: Store;
  @service declare voiceInterview: VoiceInterviewService;

  @tracked callDurationSeconds = DEFAULT_MAX_DURATION_SECONDS;
  @tracked canRetry = true;
  @tracked failureMessage: string | null = null;
  @tracked interview: ChallengeInterviewModel | null;
  @tracked phase: CourseInterviewPhase;
  @tracked remainingSeconds = DEFAULT_MAX_DURATION_SECONDS;
  @tracked shouldShowCaptions = true;

  #countdownInterval: number | null = null;
  #hasConfirmedLeaving = false;
  #hasSentWrapUpNotice = false;
  #pendingEnd: { conversationId: string | null; endReason: ChallengeInterviewEndReason } | null = null;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.interview = args.initialInterview;
    this.phase = phaseForInterview(args.initialInterview, this.isQuiz);
    this.failureMessage = args.initialInterview?.errorMessage || null;
  }

  get codeFiles() {
    return this.interview?.codeFiles || [];
  }

  get hasOpenInterview(): boolean {
    return !!this.interview?.isOpen;
  }

  get isQuiz(): boolean {
    return !!this.args.competition;
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

  get phaseIsSubmitted(): boolean {
    return this.phase === 'submitted';
  }

  get shouldConfirmLeaving(): boolean {
    return this.isQuiz && this.phaseIsLive;
  }

  get submittedDescription(): string {
    return `Thanks for taking part in ${this.args.competition?.name}. The organisers review every quiz after the competition ends and will be in touch about results.`;
  }

  get title(): string {
    return this.args.competition?.name || this.args.milestone?.title || '';
  }

  finishInterviewTask = task({ drop: true }, async (conversationId: string | null, endReason: ChallengeInterviewEndReason): Promise<void> => {
    this.#stopCountdown();

    const interview = this.interview;

    if (!interview) {
      return;
    }

    this.phase = 'scoring';
    this.#pendingEnd = { conversationId, endReason };

    try {
      await waitForPromise(interview.markAsEnded({ conversation_id: conversationId, end_reason: endReason }));
      this.#pendingEnd = null;

      if (!this.isQuiz) {
        await this.pollInterviewTask.perform(interview, 'scoring');
      }
    } catch {
      // A quiz call attached when the interviewer joined already counts, and gets scored without us.
      if (this.isQuiz && interview.isSubmitted) {
        this.#pendingEnd = null;
        this.phase = 'submitted';
      } else {
        this.#fail(this.isQuiz ? "We couldn't save your quiz. Please try again." : "We couldn't save your interview. Please try again.");
      }

      return;
    }

    if (this.isQuiz && interview.isSubmitted) {
      this.phase = 'submitted';
    } else if (interview.isScored) {
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

    const resumableInterview = this.interview?.isOpen ? this.interview : null;
    const interview = resumableInterview || this.#buildInterview();

    this.interview = interview;

    try {
      await (resumableInterview ? interview.reload() : interview.save());
      await this.pollInterviewTask.perform(interview, 'generating');

      // Starting can pick up an attempt that was already prepared, whose call token only comes with a reload.
      if (interview.isReady && !interview.conversationToken) {
        await interview.reload();
      }
    } catch (error) {
      if (!interview.id) {
        interview.unloadRecord();
      }

      const refusal = interviewServiceRefusalMessage(error);
      const message = refusal || interviewServiceBusyMessage(error) || "We couldn't reach the interview service. Please try again.";

      this.#fail(message, { canRetry: !refusal });

      return;
    }

    if (!interview.isReady || !interview.conversationToken || !interview.agentVariables) {
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
      dynamicVariables: interview.agentVariables,
      onEnded: this.handleVoiceInterviewEnded,
      onInterviewerJoined: this.isQuiz ? this.handleInterviewerJoined : undefined,
    });

    if (this.voiceInterview.status === 'failed') {
      // The questions went out with the token, so the server sets them aside and the retry prepares fresh ones.
      if (this.isQuiz) {
        void interview.markAsEnded({ conversation_id: null, end_reason: 'connection_error' }).catch(() => {});
      }

      this.#fail(this.voiceInterview.errorMessage || "We couldn't connect you to the interviewer.");

      return;
    }

    if (this.phase === 'live') {
      this.#startCountdown();
    }
  });

  #buildInterview(): ChallengeInterviewModel {
    return this.store.createRecord('challenge-interview', {
      competitionSlug: this.args.competition?.slug || null,
      milestoneSlug: this.args.milestone?.slug || null,
      repository: this.args.repository,
    });
  }

  #fail(message: string, { canRetry = true } = {}): void {
    this.#stopCountdown();
    this.canRetry = canRetry;
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
      this.phase = phaseForInterview(this.interview, this.isQuiz);
    }
  }

  @action
  handleEndInterviewButtonClick(): void {
    void this.voiceInterview.end('user_ended');
  }

  // Attaching the call once the interviewer joins makes the attempt count, even if this tab closes before the end.
  @action
  handleInterviewerJoined(conversationId: string): void {
    void this.interview?.markAsConnected({ conversation_id: conversationId }).catch(() => {});
  }

  @action
  async handleRetakeButtonClick(): Promise<void> {
    if (this.#pendingEnd) {
      const { conversationId, endReason } = this.#pendingEnd;
      await this.finishInterviewTask.perform(conversationId, endReason);

      return;
    }

    // An attempt that never got its call can be picked back up; any other starts afresh.
    if (!(this.interview?.isOpen && !this.interview.conversationToken)) {
      this.interview = null;
    }

    this.failureMessage = null;
    this.phase = 'lobby';

    if (this.args.initialInterview && this.args.milestone) {
      this.router.transitionTo('course-interview', this.args.repository.course.slug, this.args.milestone.slug, {
        queryParams: { interview: null, repo: this.args.repository.id },
      });
    }
  }

  // Leaving passes through a loading substate too, so one confirmation has to cover both transitions.
  @action
  handleRouteWillChange(transition: Transition): void {
    // @ts-expect-error queryParamsOnly is on router.js's Transition but missing from Ember's type
    if (!this.shouldConfirmLeaving || transition.queryParamsOnly || this.#hasConfirmedLeaving) {
      return;
    }

    if (window.confirm(LEAVE_QUIZ_MESSAGE)) {
      this.#hasConfirmedLeaving = true;
    } else {
      transition.abort();
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
