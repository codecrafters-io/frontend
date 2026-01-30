import Component from '@glimmer/component';
import Store from '@ember-data/store';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
    onClose?: () => void;
  };
}

export default class TrustedEvaluationTab extends Component<Signature> {
  @service declare store: Store;

  get trustedEvaluation() {
    return this.args.evaluation.trustedEvaluation;
  }

  destroyTrustedEvaluationTask = task({ drop: true }, async (): Promise<void> => {
    await this.trustedEvaluation?.destroyRecord();
  });

  upsertTrustedEvaluationTask = task({ drop: true }, async (value: 'pass' | 'fail'): Promise<void> => {
    let record = this.trustedEvaluation;

    if (!record) {
      record = this.store.createRecord('trusted-community-solution-evaluation', {
        communitySolution: this.args.evaluation.communitySolution,
        evaluator: this.args.evaluation.evaluator,
      });
    }

    record!.result = value;
    await record!.save();

    this.args.onClose?.();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::TrustedEvaluationTab': typeof TrustedEvaluationTab;
  }
}
