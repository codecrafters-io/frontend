import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Tab } from 'codecrafters-frontend/components/tabs';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluator: CommunitySolutionEvaluatorModel;
    passEvaluations: CommunitySolutionEvaluationModel[];
    failEvaluations: CommunitySolutionEvaluationModel[];
    unsureEvaluations: CommunitySolutionEvaluationModel[];
  };
};

export default class EvaluationsSection extends Component<Signature> {
  @tracked activeTabSlug: 'fail' | 'pass' | 'unsure' = 'fail';

  get filteredEvaluations() {
    if (this.activeTabSlug === 'fail') {
      return this.args.failEvaluations;
    } else if (this.activeTabSlug === 'pass') {
      return this.args.passEvaluations;
    } else if (this.activeTabSlug === 'unsure') {
      return this.args.unsureEvaluations;
    } else {
      throw new Error(`Invalid tab: ${this.activeTabSlug}`);
    }
  }

  get sortedEvaluations() {
    return this.filteredEvaluations.sortBy('updatedAt').reverse();
  }

  get tabs() {
    return [
      {
        slug: 'fail',
        title: `Fail`,
        icon: 'x',
      },
      {
        slug: 'pass',
        title: `Pass`,
        icon: 'check',
      },
      {
        slug: 'unsure',
        title: `Unsure`,
        icon: 'question-mark-circle',
      },
    ];
  }

  @action
  handleTabChange(tab: Tab) {
    this.activeTabSlug = tab.slug as 'fail' | 'pass' | 'unsure';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorPage::EvaluationsSection': typeof EvaluationsSection;
  }
}
