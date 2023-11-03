import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onContinueButtonClick: () => void;
    onStepBackButtonClick: () => void;
    onStepBackEnterOrSpaceKeydown: () => void;
    shouldShowStepBackButton: boolean;
    continueButtonText: string;
  };
}

export default class ConceptProgressComponent extends Component<Signature> {
  @action
  handleDidInsert(element: HTMLElement) {
    element.focus();
  }

  rules() {
    return fade;
  }
}
