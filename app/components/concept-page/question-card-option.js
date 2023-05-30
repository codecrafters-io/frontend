import Component from '@glimmer/component';
import showdown from 'showdown';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class QuestionCardOptionComponent extends Component {
  get isUnselected() {
    return !this.args.option.isSelected;
  }

  get isCorrect() {
    return this.args.option.is_correct;
  }

  get isSubmitted() {
    return this.args.isSubmitted;
  }

  get isSelectedAndUnsubmitted() {
    return !this.args.isSubmitted && this.args.option.isSelected;
  }

  get isSelectedAndCorrect() {
    return this.args.isSubmitted && this.args.option.isSelected && this.args.option.is_correct;
  }

  get isSelectedAndWrong() {
    return this.args.isSubmitted && this.args.option.isSelected && !this.args.option.is_correct;
  }

  get isUnselectedAndCorrect() {
    return this.args.isSubmitted && !this.args.option.isSelected && this.args.option.is_correct;
  }
}
