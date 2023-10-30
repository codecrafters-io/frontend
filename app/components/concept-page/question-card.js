import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class QuestionCardComponent extends Component {
  @tracked didLearnSomething = false;
  @tracked selectedOptionIndex;
  @tracked hasSubmitted = false;
  @tracked containerElement;

  get options() {
    return this.args.question.options.map((option, index) => {
      return {
        ...option,
        isSelected: index === this.selectedOptionIndex,
      };
    });
  }

  get selectedOption() {
    return this.options[this.selectedOptionIndex];
  }

  get selectedOptionIsCorrect() {
    return this.selectedOption && this.selectedOption.is_correct;
  }

  @action
  handleContinueButtonInserted() {
    if (this.containerElement) {
      this.containerElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  @action
  handleDidInsertContainer(element) {
    this.containerElement = element;
    element.focus();
  }

  @action
  handleILearnedSomethingButtonClick() {
    this.didLearnSomething = !this.didLearnSomething;
  }

  @action
  handleKeydown(event) {
    if (event.key === ' ' || event.key === 'Enter') {
      this.submit();
    } else if (event.keyCode - 65 > this.options.length - 1) {
      return;
    } else {
      this.selectedOptionIndex = event.keyCode - 65;
    }
  }

  @action
  handleShowExplanationClick() {
    this.selectedOptionIndex = this.args.question.correctOptionIndex;
    this.handleSubmitClick();
  }

  @action
  handleSubmitClick() {
    this.submit();
  }

  @action
  submit() {
    this.hasSubmitted = true;

    if (this.args.onSubmit) {
      this.args.onSubmit();
    }
  }
}
