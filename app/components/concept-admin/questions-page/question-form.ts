import Component from '@glimmer/component';
import ConceptQuestionModel, { type Option } from 'codecrafters-frontend/models/concept-question';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    question: ConceptQuestionModel;
  };
}

export default class QuestionFormComponent extends Component<Signature> {
  get options() {
    return this.args.question.options;
  }

  @action
  async handleCorrectOptionToggled(optionIndex: number) {
    const option = this.args.question.options[optionIndex]!;
    const optionWasCorrect = option.is_correct;

    this.args.question.options = this.args.question.options.map((option, currentOptionIndex) => {
      if (optionWasCorrect) {
        return { ...option, is_correct: false };
      } else {
        return { ...option, is_correct: currentOptionIndex === optionIndex ? true : false };
      }
    });
  }

  @action
  async handleOptionAdded() {
    this.args.question.options = [...this.args.question.options, { markdown: '', is_correct: false, explanation_markdown: '' }];
  }

  @action
  async handleOptionChanged() {
    this.args.question.set('options', [...this.args.question.options]); // Force dirty-tracking to run
  }

  @action
  async handleOptionDeleted(optionIndex: number) {
    this.args.question.options = this.args.question.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex);
  }

  @action
  moveOptionDown(optionIndex: number) {
    const options = this.options.slice();

    if (optionIndex >= options.length - 1) {
      return;
    }

    [options[optionIndex + 1], options[optionIndex]] = [options[optionIndex] as Option, options[optionIndex + 1] as Option];
    this.args.question.options = [...options];
  }

  @action
  moveOptionUp(optionIndex: number) {
    const options = this.options.slice();

    if (optionIndex <= 0) {
      return;
    }

    [options[optionIndex - 1], options[optionIndex]] = [options[optionIndex] as Option, options[optionIndex - 1] as Option];
    this.args.question.options = [...options];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::QuestionsPage::QuestionForm': typeof QuestionFormComponent;
  }
}
