import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/utils/course-page-step-list';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: CourseModel;
    currentStep: Step;
    nextStep: Step | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepList;
  };
};

export default class MainSectionComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::MainSection': typeof MainSectionComponent;
  }
}
