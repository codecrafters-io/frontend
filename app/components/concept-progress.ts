import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    progressPercentage: number;
  };
}

export default class ConceptProgressComponent extends Component<Signature> {}
