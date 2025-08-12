import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import { action } from '@ember/object';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { tracked } from '@glimmer/tracking';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeStep: StepDefinition;
    course: CourseModel;
    currentStep: StepDefinition;
    nextStep: StepDefinition | null;
    stepList: StepListDefinition;
  };
}

export default class StickySection extends Component<Signature> {
  @tracked scrollMarkerIsInViewport = true;

  get currentStepAsCourseStageStep() {
    return this.args.currentStep as CourseStageStep;
  }

  get isSticky() {
    return !this.scrollMarkerIsInViewport;
  }

  @action
  handleScrollMarkerInViewportDidChange(value: boolean) {
    this.scrollMarkerIsInViewport = value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::StickySection': typeof StickySection;
  }
}
