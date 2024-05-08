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
    const optionIndexFromKey = this.getOptionIndexFromKey(event.key);

    if (optionIndexFromKey === null || optionIndexFromKey >= this.options.length) {
      return
    }

    this.handleOptionClick(optionIndexFromKey);
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
    } else if (/^[a-zA-Z]$/.test(key)) {
      return key.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    } else {
      return null;
    }
  }

}
