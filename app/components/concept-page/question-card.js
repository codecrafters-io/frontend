import Component from '@glimmer/component';
import showdown from 'showdown';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';

export default class QuestionCardComponent extends Component {
  @tracked selectedOptionIndex;
  @tracked hasSubmitted = false;
  transition = fade;

  @action
  handleSubmitClick() {
    this.hasSubmitted = true;
  }

  @action
  handleShowExplanationClick() {
    this.selectedOptionIndex = this.args.question.correctOptionIndex;
    this.hasSubmitted = true;
  }

  get explanationIsVisible() {
    return this.hasSubmitted;
  }

  get options() {
    return this.args.question.options.map((option, index) => {
      return {
        ...option,
        isSelected: index === this.selectedOptionIndex,
        html: new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(option.markdown),
        explanationHTML: new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(option.explanation_markdown),
      };
    });
  }

  get selectedOption() {
    return this.options[this.selectedOptionIndex];
  }

  get selectedOptionIsCorrect() {
    return this.selectedOption && this.selectedOption.is_correct;
  }
}
