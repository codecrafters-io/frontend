import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
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
  };
}

export default class QuestionCardOptionComponent extends Component<Signature> {
  @service declare confetti: ConfettiService;
  @tracked hasShownConfetti = false;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.hasShownConfetti = localStorage.getItem(this.storageKey) === 'true';
  }

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

  get storageKey() {
    return `confetti-shown-question-${this.args.questionSlug}`;
  }

  @action
  async fireCorrectAnswerConfetti(element: HTMLElement) {
    if (this.hasShownConfetti || !this.isSelectedAndCorrect) {
      return;
    }

    this.hasShownConfetti = true;
    localStorage.setItem(this.storageKey, 'true');
    await this.confetti.fireFromMousePositionOrElement(element, {
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
