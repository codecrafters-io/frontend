import { action } from '@ember/object';
import Component from '@glimmer/component';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
  };
}

export default class PromptTabComponent extends Component<Signature> {
  @action
  handleCopyPromptButtonClick() {
    if (this.args.evaluation.promptFileContents) {
      navigator.clipboard.writeText(this.args.evaluation.promptFileContents);
    } else {
      alert('Error, contact us at hello@codecrafters.io if this keeps happening!');
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::PromptTab': typeof PromptTabComponent;
  }
}
