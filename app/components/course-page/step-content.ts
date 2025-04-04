import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    step: Step;
    repository: RepositoryModel;
  };

  Blocks: {
    default: [];
  };
}

export default class StepContentComponent extends Component<Signature> {
  get shouldHideCompletionNotice(): boolean {
    return this.args.step.type === 'IntroductionStep' || this.args.step.type === 'SetupStep';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepContent': typeof StepContentComponent;
  }
}
