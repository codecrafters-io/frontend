import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type ConfettiService from 'codecrafters-frontend/services/confetti';

export interface Signature {
  Element: HTMLButtonElement;

  Args: {
    option: {
      is_correct: boolean;
      isSelected: boolean;
      markdown: string;
      explanation_markdown: string;
    };
    isSubmitted: boolean;
    questionSlug: string;
    hasShownConfetti: boolean;
    onConfettiShown: () => void;
  };
}

export default class QuestionCardOptionComponent extends Component<Signature> {
  @service declare confetti: ConfettiService;

  get isCorrect() {
    return this.args.option.is_correct;
  }

  get isSelectedAndCorrect() {
    return this.args.isSubmitted && this.args.option.isSelected && this.args.option.is_correct;
  }

  get isSelectedAndUnsubmitted() {
    return !this.args.isSubmitted && this.args.option.isSelected;
  }

  get isSelectedAndWrong() {
    return this.args.isSubmitted && this.args.option.isSelected && !this.args.option.is_correct;
  }

  get isSubmitted() {
    return this.args.isSubmitted;
  }

  get isUnselected() {
    return !this.args.option.isSelected;
  }

  get isUnselectedAndCorrect() {
    return this.args.isSubmitted && !this.args.option.isSelected && this.args.option.is_correct;
  }

  @action
  async fireCorrectAnswerConfetti(element: HTMLElement) {
    console.log('fireCorrectAnswerConfetti', this.args.hasShownConfetti, this.isSelectedAndCorrect);

    if (this.args.hasShownConfetti || !this.isSelectedAndCorrect) {
      return;
    }

    this.args.onConfettiShown();

    await this.confetti.fireFromElement(element, {
      particleCount: 50,
      spread: 60,
      startVelocity: 20,
      colors: ['#22c55e', '#16a34a', '#15803d'], // green colors
      disableForReducedMotion: true,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::QuestionCardOption': typeof QuestionCardOptionComponent;
  }
}
