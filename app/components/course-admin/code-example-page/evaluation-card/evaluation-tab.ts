import { action } from '@ember/object';
import Component from '@glimmer/component';
import type CommunitySolutionEvaluationModel from 'codecrafters-frontend/models/community-solution-evaluation';
import { task, timeout } from 'ember-concurrency';
import { tracked } from 'tracked-built-ins';
import config from 'codecrafters-frontend/config/environment';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluation: CommunitySolutionEvaluationModel;
    onRegenerate: () => void;
  };
}

export default class EvaluationTabComponent extends Component<Signature> {
  @tracked wasRecentlyCopied = false;

  @action
  handleCopyToClipboardButtonClick() {
    this.copyToClipboardTask.perform();
  }

  @action
  handleRegenerateButtonClick() {
    this.regenerateTask.perform();
    this.args.onRegenerate();
  }

  copyToClipboardTask = task({ keepLatest: true }, async (): Promise<void> => {
    this.wasRecentlyCopied = true;
    navigator.clipboard.writeText(this.args.evaluation.logsFileContents!);
    await timeout(config.x.copyConfirmationTimeout);
    this.wasRecentlyCopied = false;
  });

  regenerateTask = task({ keepLatest: true }, async (): Promise<void> => {
    await this.args.evaluation.regenerate({});
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExamplePage::EvaluationCard::EvaluationTab': typeof EvaluationTabComponent;
  }
}
