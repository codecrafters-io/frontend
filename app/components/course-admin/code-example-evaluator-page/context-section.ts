import Component from '@glimmer/component';
import { action } from '@ember/object';
import type CommunitySolutionEvaluatorModel from 'codecrafters-frontend/models/community-solution-evaluator';
import { task } from 'ember-concurrency';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    evaluator: CommunitySolutionEvaluatorModel;
  };
}

export default class ContextSection extends Component<Signature> {
  get isUsingHighlightedLines() {
    return this.args.evaluator.context === 'highlighted_lines';
  }

  @action
  handleToggle() {
    if (!this.args.evaluator.isDraft) {
      return;
    }

    this.args.evaluator.context = this.isUsingHighlightedLines ? 'highlighted_files' : 'highlighted_lines';
    this.updateContextTask.perform();
  }

  updateContextTask = task({ drop: true }, async (): Promise<void> => {
    await this.args.evaluator.save();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorPage::ContextSection': typeof ContextSection;
  }
}
