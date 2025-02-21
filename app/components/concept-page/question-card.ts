import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';
import type { Option } from 'codecrafters-frontend/models/concept-question';
import { next } from '@ember/runloop';
import { service } from '@ember/service';
import ConfettiService from 'codecrafters-frontend/services/confetti';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isCurrentBlock: boolean;
    question: ConceptQuestionModel;
    onSubmit: () => void;
  };
}

export default class QuestionCardComponent extends Component<Signature> {
  @service declare confetti: ConfettiService;

  @tracked hasFiredConfetti = false;
  @tracked selectedOptionIndex: number | null = null;

  get digitKeys() {
    return '1 2 3 4 5 6 7 8 9'.split(' ');
  }

  get hasSubmitted() {
    return this.selectedOptionIndex !== null;
  }

  get letterKeys() {
    return 'a b c d e f g h i'.split(' ');
  }

  get options() {
    return this.args.question.options.map((option, index) => {
      return {
        ...option,
        isSelected: index === this.selectedOptionIndex,
      };
    });
  }

  get selectedOption(): Option | null {
    if (this.selectedOptionIndex === null) {
      return null;
    }

    return this.options[this.selectedOptionIndex] as Option;
  }

  get selectedOptionIsCorrect() {
    return this.selectedOption && this.selectedOption.is_correct;
  }

  @action
  async handleDidInsertCorrectAnswerEmoji(element: HTMLElement) {
    if (this.hasFiredConfetti || !this.selectedOptionIsCorrect) {
      return;
    }

    this.hasFiredConfetti = true;

    await this.confetti.fireFromElement(element, {
      particleCount: 50,
      spread: 60,
      startVelocity: 20,
      colors: ['#22c55e', '#16a34a', '#15803d'], // green colors
      disableForReducedMotion: true,
    });
  }

  @action
  handleDidInsertOptionsList(element: HTMLElement) {
    const firstOptionElement = element.children[0];

    if (firstOptionElement instanceof HTMLElement) {
      // focus() doesn't seem to work unless it's called after the current runloop
      next(() => {
        firstOptionElement?.focus({ preventScroll: true });
      });
    }
  }

  @action
  handleMoveDown(event: KeyboardEvent) {
    if (this.selectedOptionIndex !== null) {
      return;
    }

    event.preventDefault();

    const currentFocusedOption = document.activeElement;
    const questionCards = document.querySelectorAll('[data-test-question-card]');

    if (!(currentFocusedOption instanceof HTMLElement) || !(questionCards.length > 0)) {
      return;
    }

    const latestQuestionCard = questionCards[questionCards.length - 1] as HTMLElement;
    const options = Array.from(latestQuestionCard.querySelectorAll('[data-test-question-card-option]')) as HTMLElement[];
    const currentFocusedOptionIndex = options.indexOf(currentFocusedOption);

    if (currentFocusedOptionIndex < options.length - 1) {
      options[currentFocusedOptionIndex + 1]!.focus({ preventScroll: true });
    } else {
      options[0]!.focus({ preventScroll: true });
    }
  }

  @action
  handleMoveUp(event: KeyboardEvent) {
    if (this.selectedOptionIndex !== null) {
      return;
    }

    event.preventDefault();

    const currentFocusedOption = document.activeElement;
    const questionCards = document.querySelectorAll('[data-test-question-card]');

    if (!(currentFocusedOption instanceof HTMLElement) || !(questionCards.length > 0)) {
      return;
    }

    const latestQuestionCard = questionCards[questionCards.length - 1] as HTMLElement;
    const options = Array.from(latestQuestionCard.querySelectorAll('[data-test-question-card-option]')) as HTMLElement[];
    const currentFocusedOptionIndex = options.indexOf(currentFocusedOption);

    if (currentFocusedOptionIndex > 0) {
      options[currentFocusedOptionIndex - 1]!.focus({ preventScroll: true });
    } else {
      options[options.length - 1]!.focus({ preventScroll: true });
    }
  }

  @action
  handleOptionSelected(optionIndex: number) {
    if (optionIndex >= this.args.question.options.length) {
      return;
    }

    const selectedOptionIndexWasNull = this.selectedOptionIndex === null;

    this.selectedOptionIndex = optionIndex;

    if (selectedOptionIndexWasNull && this.args.onSubmit) {
      next(() => {
        this.args.onSubmit();
      });
    }
  }

  @action
  handleShowExplanationClick() {
    this.handleOptionSelected(this.args.question.correctOptionIndex);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::QuestionCard': typeof QuestionCardComponent;
  }
}
