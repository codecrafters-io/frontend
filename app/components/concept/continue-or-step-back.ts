import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onContinueButtonClick: () => void;
    onStepBackButtonClick: () => void;
    shouldShowStepBackButton: boolean;
    continueButtonText: string;
  };
}

export default class ConceptProgressComponent extends Component<Signature> {
  rules() {
    return fade;
  }
}
