import Component from '@glimmer/component';
import type CompetitionQuizModel from 'codecrafters-frontend/models/competition-quiz';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    quiz: CompetitionQuizModel;
  };
}

export default class RetakePanel extends Component<Signature> {
  @tracked errorMessage: string | null = null;

  // Keyed on the server's timestamp, not the attribute being saved, so the panel only flips once the save lands.
  get hasSavedRetake(): boolean {
    return Boolean(this.args.quiz.retakeAllowedAt);
  }

  get isSaving(): boolean {
    return this.saveRetakeTask.isRunning || (this.args.quiz.isSaving as unknown as boolean);
  }

  saveRetakeTask = task({ drop: true }, async (isRetakeAllowed: boolean): Promise<void> => {
    const quiz = this.args.quiz;

    this.errorMessage = null;
    quiz.isRetakeAllowed = isRetakeAllowed;

    try {
      await quiz.save();
    } catch {
      quiz.rollbackAttributes();
      this.errorMessage = isRetakeAllowed ? "Couldn't allow the retake. Please try again." : "Couldn't undo the retake. Please try again.";
    }
  });

  @action
  handleAllowRetakeButtonClick(): void {
    this.saveRetakeTask.perform(true);
  }

  @action
  handleUndoButtonClick(): void {
    this.saveRetakeTask.perform(false);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::QuizPage::RetakePanel': typeof RetakePanel;
  }
}
