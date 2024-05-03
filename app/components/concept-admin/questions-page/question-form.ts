import Component from '@glimmer/component';
import ConceptQuestionModel, { type Option } from 'codecrafters-frontend/models/concept-question';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    question: ConceptQuestionModel;
  };
}

export default class QuestionFormComponent extends Component<Signature> {
  @tracked options = this.args.question.options;

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
    if (optionIndex < this.options.length - 1) {
      let temp = this.options[optionIndex + 1];
      this.options[optionIndex + 1] = this.options[optionIndex] as Option;
      this.options[optionIndex] = temp as Option;
      this.args.question.options = [...this.options];
    }
  }

  @action
  moveOptionUp(optionIndex: number) {
    if (optionIndex > 0) {
      let temp = this.options[optionIndex - 1];
      this.options[optionIndex - 1] = this.options[optionIndex] as Option;
      this.options[optionIndex] = temp as Option;
      this.args.question.options = [...this.options];
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptAdmin::QuestionsPage::QuestionForm': typeof QuestionFormComponent;
  }
}
