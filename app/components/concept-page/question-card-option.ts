import Component from '@glimmer/component';

interface QuestionOption {
  is_correct: boolean;
  isSelected: boolean;
}

interface QuestionCardOptionArgs {
  option: QuestionOption;
  isSubmitted: boolean;
}

export default class QuestionCardOptionComponent extends Component<QuestionCardOptionArgs> {
  @service declare confetti: ConfettiService;
  @tracked hasShownConfetti = false;

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
