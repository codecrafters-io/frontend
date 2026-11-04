import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import type CompetitionQuizModel from 'codecrafters-frontend/models/competition-quiz';
import type SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import transcriptToWebvtt from 'codecrafters-frontend/utils/transcript-to-webvtt';
import { tracked } from '@glimmer/tracking';
import { waitForPromise } from '@ember/test-waiters';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    quiz: CompetitionQuizModel;
  };
}

export default class RecordingPlayer extends Component<Signature> {
  @service declare sessionTokenStorage: SessionTokenStorageService;

  @tracked audioUrl: string | null = null;
  @tracked captionsUrl: string | null = null;
  @tracked errorMessage: string | null = null;

  // An <audio> request can't carry the session header, so the recording is fetched and played from a blob.
  loadRecordingTask = task({ drop: true }, async (): Promise<void> => {
    this.errorMessage = null;

    try {
      const blob = await waitForPromise(this.#fetchRecording());
      const captions = transcriptToWebvtt(this.args.quiz.transcript || []);

      this.captionsUrl = URL.createObjectURL(new Blob([captions], { type: 'text/vtt' }));
      this.audioUrl = URL.createObjectURL(blob);
    } catch {
      this.errorMessage = "Couldn't load the recording. Please try again.";
    }
  });

  async #fetchRecording(): Promise<Blob> {
    const token = this.sessionTokenStorage.currentToken;
    const response = await fetch(`${config.x.interviewServiceUrl}/api/competition-quizzes/${this.args.quiz.id}/audio`, {
      headers: token ? { 'x-session-token': token } : {},
    });

    if (!response.ok) {
      throw new Error(`Recording request failed with ${response.status}`);
    }

    return response.blob();
  }

  @action
  handleLoadRecordingButtonClick(): void {
    this.loadRecordingTask.perform();
  }

  willDestroy(): void {
    super.willDestroy();

    for (const url of [this.audioUrl, this.captionsUrl]) {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::QuizPage::RecordingPlayer': typeof RecordingPlayer;
  }
}
