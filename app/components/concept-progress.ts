import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    progressPercentage: number;
    remainingBlocksCount: number;
  };
}

export default class ConceptProgressComponent extends Component<Signature> {
  get widthStyle(): string {
    return `width: ${this.args.progressPercentage}%`;
  }

  rules() {
    return fade;
  }
}
