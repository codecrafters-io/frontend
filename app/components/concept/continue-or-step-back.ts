import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onContinueButtonClick: () => void;
    onStepBackButtonClick: () => void;
    shouldEnableKeyboardShortcuts: boolean;
    shouldHighlightKeyboardShortcuts: boolean;
    shouldShowStepBackButton: boolean;
    shouldShowContinueButton: boolean;
    continueButtonText: string;
  };
}

export default class ContinueOrStepBackComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Concept::ContinueOrStepBack': typeof ContinueOrStepBackComponent;
  }
}
