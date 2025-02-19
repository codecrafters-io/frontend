import Component from '@glimmer/component';
import type { Option } from 'codecrafters-frontend/models/concept-question';

export interface Signature {
  Element: HTMLButtonElement;

  Args: {
    option: Option & {
      isSelected: boolean;
    };
    isSubmitted: boolean;
  };
}

export default class QuestionCardOptionComponent extends Component<Signature> {
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ConceptPage::QuestionCardOption': typeof QuestionCardOptionComponent;
  }
}
