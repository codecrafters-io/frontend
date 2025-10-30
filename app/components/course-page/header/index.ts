import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import CourseModel from 'codecrafters-frontend/models/course';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeRepository: RepositoryModel;
    activeStep: StepDefinition;
    course: CourseModel;
    currentStep: StepDefinition;
    nextStep: StepDefinition | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepListDefinition;
    track: string | undefined;
  };
}

export default class Header extends Component<Signature> {
  @tracked scrollMarkerIsInViewport = true;

  get currentStepAsCourseStageStep(): CourseStageStep {
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
    'CoursePage::Header': typeof Header;
  }
}
