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

  get hasSubmitted() {
    return this.selectedOptionIndex !== null;
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
  handleKeydown(event: KeyboardEvent) {
    event.preventDefault();

    const currentOption = document.activeElement as HTMLElement;
    const options = Array.from(document.querySelectorAll('[data-test-question-card-option]')) as HTMLElement[];
    const currentOptionIndex = options.indexOf(currentOption);

    if (event.key === 'k' || event.key === 'ArrowUp') {
      if (currentOptionIndex > 0) {
        options[currentOptionIndex - 1]!.focus();
      } else {
        options[options.length - 1]!.focus();
      }
    }

    if (event.key === 'j' || event.key === 'ArrowDown') {
      if (currentOptionIndex < options.length - 1) {
        options[currentOptionIndex + 1]!.focus();
      } else {
        options[0]!.focus();
      }
    }

    const optionIndexFromKey = this.getOptionIndexFromKey(event.key);

    if (optionIndexFromKey !== null && optionIndexFromKey < this.options.length) {
      this.handleOptionClick(optionIndexFromKey);
    }
  }

  @action
  handleOptionClick(optionIndex: number) {
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
    this.handleOptionClick(this.args.question.correctOptionIndex);
  }

  getOptionIndexFromKey(key: string) {
    if (!isNaN(parseInt(key))) {
      return parseInt(key) - 1;
    } else if (/^[a-iA-I]$/.test(key)) {
      return key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    } else {
      return null;
    }
  }

}
