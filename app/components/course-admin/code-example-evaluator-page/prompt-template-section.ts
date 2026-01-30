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

export default class PromptTemplateSection extends Component<Signature> {
  get hasUnsavedChanges() {
    return (this.args.evaluator.hasDirtyAttributes as unknown as boolean) && 'promptTemplate' in this.args.evaluator.changedAttributes();
  }

  @action
  handlePromptTemplateInput(event: Event) {
    this.args.evaluator.promptTemplate = (event.target as HTMLTextAreaElement).value;
  }

  updatePromptTemplateTask = task({ drop: true }, async (): Promise<void> => {
    if (!this.hasUnsavedChanges) {
      return;
    }

    await this.args.evaluator.save();
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseAdmin::CodeExampleEvaluatorPage::PromptTemplateSection': typeof PromptTemplateSection;
  }
}
