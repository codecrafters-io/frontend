import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type ConfettiService from 'codecrafters-frontend/services/confetti';

interface QuestionOption {
  is_correct: boolean;
  isSelected: boolean;
}

interface QuestionCardOptionArgs {
  option: QuestionOption;
  isSubmitted: boolean;
}

export default class QuestionCardOptionComponent extends Component<QuestionCardOptionArgs> {
  @service declare confetti: ConfettiService;
  @tracked hasShownConfetti = false;

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
    if (this.hasShownConfetti || !this.args.isSubmitted || !this.isCorrect) {
      return;
    }

    this.hasShownConfetti = true;
    await this.confetti.fireFromElement(element, {
      particleCount: 50,
      spread: 60,
      startVelocity: 20,
      colors: ['#22c55e', '#16a34a', '#15803d'], // green colors
      disableForReducedMotion: true
    });
  }
}
