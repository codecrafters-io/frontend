import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    progressPercentage: number;
  };
}

export default class ConceptProgressComponent extends Component<Signature> {
  rules() {
    return fade;
  }

  get widthStyle(): string {
    return `width: ${this.args.progressPercentage}%`;
  }
}
