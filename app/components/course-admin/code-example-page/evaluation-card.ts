import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CodeExampleEvaluationModel from 'codecrafters-frontend/models/code-example-evaluation';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluation: CodeExampleEvaluationModel;
  };
};

export default class EvaluationCard extends Component<Signature> {
  @tracked isExpanded = false;

  get isCollapsed() {
    return !this.isExpanded;
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleExpandButtonClick() {
    next(() => {
      this.isExpanded = true;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard': typeof EvaluationCard;
  }
}
