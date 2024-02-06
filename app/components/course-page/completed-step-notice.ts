import { service } from '@ember/service';
import Component from '@glimmer/component';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { Step } from 'codecrafters-frontend/utils/course-page-step-list';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    step: Step;
  };
};

export default class CompletedStepNoticeComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get activeStep() {
    return this.coursePageState.activeStep;
  }

  get instructionsMarkdown() {
    return this.args.step.completionNoticeMessage!;
  }

  get nextStep() {
    return this.coursePageState.nextStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CompletedStepNotice': typeof CompletedStepNoticeComponent;
  }
}
