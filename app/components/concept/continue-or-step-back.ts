import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    continueButtonText: string;
    onContinueButtonClick: () => void;
    onStepBackButtonClick: () => void;
    shouldHighlightKeyboardShortcuts: boolean;
    shouldShowContinueButton: boolean;
    shouldShowStepBackButton: boolean;
  };
}

export default class ContinueOrStepBack extends Component<Signature> {
  @tracked continueButtonElement: HTMLButtonElement | null = null;

  @action
  handleDidInsertContinueButtonElement(element: HTMLButtonElement): void {
    this.continueButtonElement = element;

    if (this.args.shouldHighlightKeyboardShortcuts) {
      element.setAttribute('data-focused', 'true');

      element.addEventListener('blur', () => element.removeAttribute('data-focused'));
      element.addEventListener('focus', () => element.setAttribute('data-focused', 'true'));
    }
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
    'Concept::ContinueOrStepBack': typeof ContinueOrStepBack;
  }
}
