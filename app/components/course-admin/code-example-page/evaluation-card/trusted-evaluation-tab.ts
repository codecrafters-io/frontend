import Component from '@glimmer/component';
import Store from '@ember-data/store';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import { action } from '@ember/object';
import { service } from '@ember/service';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
  };
};

export default class TrustedEvaluationTabComponent extends Component<Signature> {
  @service declare store: Store;

  get options(): { value: 'none' | 'pass' | 'fail'; isSelected: boolean; text: string }[] {
    return [
      {
        value: 'none',
        isSelected: !this.trustedEvaluation,
        text: 'None',
      },
      {
        value: 'pass',
        isSelected: this.trustedEvaluation?.result == 'pass',
        text: 'Pass',
      },
      {
        value: 'fail',
        isSelected: this.trustedEvaluation?.result == 'fail',
        text: 'Fail',
      },
    ];
  }

  get trustedEvaluation() {
    return this.args.evaluation.trustedEvaluation;
  }

  @action
  async handleSelect(value: 'none' | 'pass' | 'fail') {
    if (value == 'none') {
      this.trustedEvaluation?.destroyRecord();
    } else {
      let record = this.trustedEvaluation;

      if (!record) {
        record = this.store.createRecord('trusted-community-solution-evaluation', {
          communitySolution: this.args.evaluation.communitySolution,
          evaluator: this.args.evaluation.evaluator,
        });
      }

      record!.result = value;
      await record!.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::TrustedEvaluationTab': typeof TrustedEvaluationTabComponent;
  }
}
