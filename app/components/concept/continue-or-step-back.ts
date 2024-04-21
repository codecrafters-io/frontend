import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onContinueButtonClick: () => void;
    onStepBackButtonClick: () => void;
    shouldHighlightKeyboardShortcuts: boolean;
    shouldShowStepBackButton: boolean;
    shouldShowContinueButton: boolean;
    continueButtonText: string;
  };
}

export default class ContinueOrStepBackComponent extends Component<Signature> {
  @tracked continueButtonElement: HTMLButtonElement | null = null;

  @action
  handleDidInsertContinueButtonElement(element: HTMLButtonElement): void {
    this.continueButtonElement = element;
  }

  @action
  handleEnterKeyPress(event: KeyboardEvent): void {
    if (event.target === this.continueButtonElement) {
      return; // Continue button already has a click handler
    }

    this.args.onContinueButtonClick();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Concept::ContinueOrStepBack': typeof ContinueOrStepBackComponent;
  }
}
