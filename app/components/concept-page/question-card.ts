import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type ConceptQuestionModel from 'codecrafters-frontend/models/concept-question';
import type { Option } from 'codecrafters-frontend/models/concept-question';
import { next } from '@ember/runloop';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    question: ConceptQuestionModel;
    onSubmit: () => void;
  };
};

export default class QuestionCardComponent extends Component<Signature> {
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
  handleDidInsertOptionsList(element: HTMLElement) {
    const firstOptionElement = element.children[0];

    if (firstOptionElement instanceof HTMLElement) {
      // focus() doesn't seem to work unless it's called after the current runloop
      next(() => {
        firstOptionElement && firstOptionElement.focus();
      });
    }
  }

  @action
  handleMoveDown() {
    const currentFocusedOption = document.activeElement as HTMLElement;
    const options = Array.from(document.querySelectorAll('[data-test-question-card-option]')) as HTMLElement[];
    const currentFocusedOptionIndex = options.indexOf(currentFocusedOption);

    if (currentFocusedOptionIndex < options.length - 1) {
      options[currentFocusedOptionIndex + 1]!.focus();
    } else {
      options[0]!.focus();
    }
  }

  @action
  handleMoveUp() {
    const currentFocusedOption = document.activeElement as HTMLElement;
    const options = Array.from(document.querySelectorAll('[data-test-question-card-option]')) as HTMLElement[];
    const currentFocusedOptionIndex = options.indexOf(currentFocusedOption);

    if (currentFocusedOptionIndex > 0) {
      options[currentFocusedOptionIndex - 1]!.focus();
    } else {
      options[options.length - 1]!.focus();
    }
  }

  @action
  handleOptionSelected(optionIndex: number) {
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
