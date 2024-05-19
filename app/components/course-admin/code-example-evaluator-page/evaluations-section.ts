import Component from '@glimmer/component';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluator: CommunitySolutionEvaluatorModel;
    evaluations: CommunitySolutionEvaluationModel[];
    resultFilter: CommunitySolutionEvaluationModel['result'];
  };
};

export default class EvaluationsSection extends Component<Signature> {
  get sortedEvaluations() {
    return this.args.evaluations.sortBy('createdAt').reverse();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorPage::EvaluationsSection': typeof EvaluationsSection;
  }
}
