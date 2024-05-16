import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Signature as TabsComponentSignature } from 'codecrafters-frontend/components/tabs';
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

  get tabs(): TabsComponentSignature['Args']['tabs'] {
    return [
      {
        slug: 'evaluation',
        title: 'Evaluation',
        icon: 'academic-cap',
      },
      {
        slug: 'prompt',
        title: 'Prompt',
        icon: 'document-text',
      },
    ];
  }

  @action
  handleCollapseButtonClick() {
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleExpandButtonClick() {
    this.args.evaluation.fetchLogsFileContentsIfNeeded();
    this.args.evaluation.fetchPromptFileContentsIfNeeded();

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
