import Component from '@glimmer/component';
import type { Step } from 'codecrafters-frontend/utils/course-page-step-list';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    step: Step;
  };
};

export default class CompletedStepNoticeComponent extends Component<Signature> {
  get instructionsMarkdown() {
    return this.args.step.completionNoticeMessage!;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CompletedStepNotice': typeof CompletedStepNoticeComponent;
  }
}
