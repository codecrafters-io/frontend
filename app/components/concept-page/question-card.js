import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class QuestionCardComponent extends Component {
  @tracked didLearnSomething = false;
  @tracked selectedOptionIndex;
  @tracked hasSubmitted = false;
  @tracked containerElement;

  @service questionCardTracker;

  constructor() {
    super(...arguments);
    this.questionCardTracker.registerComponent(this);

    if (this.questionCardTracker.isComponentLatest(this)) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

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
  }

  @action
  handleDidInsertShowExplanationButton(element) {
    element.focus();
  }

  @action
  handleILearnedSomethingButtonClick() {
    this.didLearnSomething = !this.didLearnSomething;
  }

  @action
  handleKeydown(event) {
    if (!this.questionCardTracker.isComponentLatest(this)) {
      return;
    }

    if (event.keyCode - 65 < 0 || event.keyCode - 65 >= this.options.length) {
      return;
    } else {
      this.selectedOptionIndex = event.keyCode - 65;
      document.querySelector('.submit-button').focus();
    }
  }

  @action
  handleShowExplanationClick() {
    this.showExplanation();
  }

  @action
  handleSubmitClick() {
    this.submit();
  }

  @action
  showExplanation() {
    this.selectedOptionIndex = this.args.question.correctOptionIndex;
    this.submit();
  }

  @action
  submit() {
    this.hasSubmitted = true;

    if (this.args.onSubmit) {
      this.args.onSubmit();
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.questionCardTracker.unregisterComponent(this);

    if (this.questionCardTracker.isComponentLatest(this)) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }
}
