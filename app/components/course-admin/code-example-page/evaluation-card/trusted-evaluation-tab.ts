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

  get trustedEvaluation() {
    // There can't be more than one trusted evaluation per solution
    return this.args.evaluation.communitySolution.trustedEvaluations[0];
  }

  @action
  async handleSelect(event: Event) {
    const selectedValue = (event.target! as HTMLSelectElement).value;

    if (selectedValue == 'none') {
      this.trustedEvaluation?.destroyRecord();
    } else {
      let record = this.trustedEvaluation;

      if (!record) {
        record = this.store.createRecord('trusted-community-solution-evaluation', {
          communitySolution: this.args.evaluation.communitySolution,
          evaluator: this.args.evaluation.evaluator,
        });
      }

      record!.result = selectedValue as 'pass' | 'fail';
      await record!.save();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::TrustedEvaluationTab': typeof TrustedEvaluationTabComponent;
  }
}
