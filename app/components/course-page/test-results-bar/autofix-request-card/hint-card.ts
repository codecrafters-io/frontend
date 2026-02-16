import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type { AutofixHint } from 'codecrafters-frontend/models/autofix-request';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
    hint: AutofixHint;
    isExpanded: boolean;
    onExpand: () => void;
    onCollapse: () => void;
  };
}

export default class HintCard extends Component<Signature> {
  transition = fade;

  get isVerifying() {
    return this.args.autofixRequest.status === 'in_progress';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixRequestCard::HintCard': typeof HintCard;
  }
}
