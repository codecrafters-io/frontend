import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import isExperimentUnavailableError from 'codecrafters-frontend/utils/is-experiment-unavailable-error';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type CourseStageChatMessageModel from 'codecrafters-frontend/models/course-stage-chat-message';
import type CourseStageChatModel from 'codecrafters-frontend/models/course-stage-chat';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class CourseStageChatPanel extends Component<Signature> {
  rippleSpinnerImage = rippleSpinnerImage;

  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  @tracked body = '';
  @tracked chat: CourseStageChatModel | null = null;
  @tracked isAvailable = false;
  @tracked isExpanded = false;
  @tracked submitError: string | null = null;

  messagesElement: HTMLElement | null = null;

  get canSubmit(): boolean {
    return this.body.trim().length > 0 && !this.sendMessageTask.isRunning;
  }

  get courseStage(): CourseStageModel | null {
    if (this.coursePageState.currentStep?.type !== 'CourseStageStep') {
      return null;
    }

    return this.coursePageState.currentStepAsCourseStageStep.courseStage;
  }

  get courseStageId(): string | null {
    return this.courseStage?.id ?? null;
  }

  get displayedMessages(): CourseStageChatMessageModel[] {
    if (!this.chat) {
      return [];
    }

    return this.chat.messages.slice().sort(fieldComparator('createdAt'));
  }

  get isEmpty(): boolean {
    return this.displayedMessages.length === 0;
  }

  get latestMessageBody(): string | null {
    return this.displayedMessages.at(-1)?.body ?? null;
  }

  get latestMessageId(): string | null {
    return this.displayedMessages.at(-1)?.id ?? null;
  }

  get latestMessageStatus(): string | null {
    return this.displayedMessages.at(-1)?.status ?? null;
  }

  get shouldAttemptLoad(): boolean {
    return !!this.args.repository.id && !!this.courseStage;
  }

  get shouldShow(): boolean {
    return this.shouldAttemptLoad && this.isAvailable;
  }

  doScrollMessagesToBottom(): void {
    if (!this.messagesElement?.isConnected) {
      return;
    }

    this.messagesElement.scrollTop = this.messagesElement.scrollHeight;
  }

  @action
  async handleDidInsert(): Promise<void> {
    await this.loadChatTask.perform();
  }

  @action
  handleDidInsertMessages(element: HTMLElement): void {
    this.messagesElement = element;
    this.scrollMessagesToBottom();
  }

  @action
  async handleDidUpdate(): Promise<void> {
    await this.loadChatTask.perform();
  }

  @action
  handleDidUpdateMessages(): void {
    this.scrollMessagesToBottom();
  }

  @action
  handleInputKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || !(event.metaKey || event.ctrlKey)) {
      return;
    }

    event.preventDefault();

    if (!this.canSubmit) {
      return;
    }

    this.sendMessageTask.perform();
  }

  @action
  async handleRatingClick(message: CourseStageChatMessageModel, rating: 'up' | 'down'): Promise<void> {
    const nextRating = message.rating === rating ? null : rating;

    message.rating = nextRating;

    try {
      await message.save();
    } catch (error) {
      if (isExperimentUnavailableError(error)) {
        this.hidePanel();

        return;
      }

      message.rollbackAttributes();
    }
  }

  @action
  handleSubmit(event: Event): void {
    event.preventDefault();
    this.sendMessageTask.perform();
  }

  @action
  handleToggleClick(): void {
    this.isExpanded = !this.isExpanded;
  }

  hidePanel(): void {
    this.isAvailable = false;
    this.isExpanded = false;
    this.chat = null;
    this.messagesElement = null;
    this.submitError = null;
  }

  scrollMessagesToBottom(): void {
    scheduleOnce('afterRender', this, this.doScrollMessagesToBottom);
  }

  loadChatTask = task({ restartable: true }, async (): Promise<void> => {
    this.submitError = null;

    if (!this.shouldAttemptLoad) {
      this.hidePanel();

      return;
    }

    try {
      const chats = (await this.store.query('course-stage-chat', {
        'filter[repository]': this.args.repository.id,
        'filter[course-stage]': this.courseStage!.id,
        include: 'messages',
      })) as unknown as CourseStageChatModel[];

      this.isAvailable = true;
      this.chat = chats[0] || null;
    } catch (error) {
      if (isExperimentUnavailableError(error)) {
        this.hidePanel();

        return;
      }

      throw error;
    }
  });

  sendMessageTask = task({ drop: true }, async (): Promise<void> => {
    if (!this.courseStage || this.body.trim().length === 0) {
      return;
    }

    this.submitError = null;

    const message = this.store.createRecord('course-stage-chat-message', {
      body: this.body.trim(),
      courseStage: this.courseStage,
      inputMode: 'text',
      repository: this.args.repository,
    });

    try {
      await message.save();
    } catch (error) {
      message.unloadRecord();

      if (isExperimentUnavailableError(error)) {
        this.hidePanel();

        return;
      }

      this.submitError = this.submitErrorMessageFor(error);

      return;
    }

    this.body = '';

    if (message.chat) {
      this.chat = message.chat;
    }

    await this.pollUntilCompleteTask.perform(message);
  });

  pollUntilCompleteTask = task({ restartable: true }, async (userMessage: CourseStageChatMessageModel): Promise<void> => {
    const pollInterval = config.environment === 'test' ? 0 : 1000;
    const maxAttempts = config.environment === 'test' ? 50 : 30;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (userMessage.status === 'complete') {
        return;
      }

      try {
        const chats = (await this.store.query('course-stage-chat', {
          'filter[repository]': this.args.repository.id,
          'filter[course-stage]': this.courseStage!.id,
          include: 'messages',
        })) as unknown as CourseStageChatModel[];

        this.chat = chats[0] || this.chat;

        const refreshedMessage = this.store.peekRecord('course-stage-chat-message', userMessage.id);

        if (refreshedMessage?.status === 'complete') {
          return;
        }
      } catch (error) {
        if (isExperimentUnavailableError(error)) {
          this.hidePanel();

          return;
        }

        throw error;
      }

      await timeout(pollInterval);
    }

    this.submitError = 'Still working — try sending again in a moment.';
  });

  submitErrorMessageFor(error: unknown): string {
    if (!error || typeof error !== 'object') {
      return 'Could not send message.';
    }

    const adapterError = error as { isAdapterError?: boolean; errors?: { detail?: unknown; title?: unknown }[] };

    if (!adapterError.isAdapterError) {
      return 'Could not send message.';
    }

    const detail = adapterError.errors?.[0]?.detail;

    if (typeof detail === 'string' && detail.length > 0) {
      return detail;
    }

    return 'Could not send message.';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageChatPanel': typeof CourseStageChatPanel;
  }
}
