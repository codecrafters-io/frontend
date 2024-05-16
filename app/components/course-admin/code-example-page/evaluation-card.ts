import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CommunitySolutionEvalutionModel from 'codecrafters-frontend/models/community-solution-evaluation';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvalutionModel;
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
