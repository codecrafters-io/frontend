import Component from '@glimmer/component';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    currentStep: CourseStageStep;
  };
}

export default class TestsPassedModalComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal': typeof TestsPassedModalComponent;
  }
}
