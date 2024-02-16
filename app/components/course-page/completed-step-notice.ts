import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type { Step } from 'codecrafters-frontend/utils/course-page-step-list';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    step: Step;
    repository: RepositoryModel;
  };
};

export default class CompletedStepNoticeComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @tracked x = true; // TEMP for preview

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
