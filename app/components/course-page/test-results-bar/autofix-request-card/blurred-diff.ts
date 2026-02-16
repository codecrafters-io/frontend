import Component from '@glimmer/component';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
    isBlurred: boolean;
    onReveal: () => void;
  };
}

export default class BlurredDiff extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixRequestCard::BlurredDiff': typeof BlurredDiff;
  }
}
