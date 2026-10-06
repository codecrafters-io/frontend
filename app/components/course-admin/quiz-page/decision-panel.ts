import Component from '@glimmer/component';
import type CompetitionQuizModel from 'codecrafters-frontend/models/competition-quiz';
import type Owner from '@ember/owner';
import type { CompetitionQuizReviewDecision } from 'codecrafters-frontend/models/competition-quiz';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    quiz: CompetitionQuizModel;
  };
}

export default class DecisionPanel extends Component<Signature> {
  @tracked errorMessage: string | null = null;
  @tracked note: string;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.note = args.quiz.reviewNote || '';
  }

  get isSaving(): boolean {
    return this.saveDecisionTask.isRunning || (this.args.quiz.isSaving as unknown as boolean);
  }

  saveDecisionTask = task({ drop: true }, async (decision: CompetitionQuizReviewDecision | null): Promise<void> => {
    const quiz = this.args.quiz;

    this.errorMessage = null;
    quiz.reviewDecision = decision;
    quiz.reviewNote = this.note.trim() || null;

    try {
      await quiz.save();
    } catch {
      quiz.rollbackAttributes();
      this.errorMessage = "Couldn't save your decision. Please try again.";
    }
  });

  @action
  handleDecisionButtonClick(decision: CompetitionQuizReviewDecision | null): void {
    this.saveDecisionTask.perform(decision);
  }

  @action
  handleNoteInput(event: Event): void {
    this.note = (event.target as HTMLTextAreaElement).value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::QuizPage::DecisionPanel': typeof DecisionPanel;
  }
}
