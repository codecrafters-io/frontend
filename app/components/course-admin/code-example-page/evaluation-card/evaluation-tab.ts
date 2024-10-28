import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import type ClipboardService from 'codecrafters-frontend/services/clipboard';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
    onRegenerate: () => void;
  };
}

export default class EvaluationTabComponent extends Component<Signature> {
  @service declare clipboard: ClipboardService;

  @action
  handleRegenerateButtonClick() {
    this.regenerateTask.perform();
    this.args.onRegenerate();
  }

  regenerateTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.args.evaluation.regenerate({});
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::EvaluationTab': typeof EvaluationTabComponent;
  }
}
