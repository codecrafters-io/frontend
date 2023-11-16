import Component from '@glimmer/component';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { TemporaryCourseModel } from 'codecrafters-frontend/lib/temporary-types';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: TemporaryCourseModel;
    currentStep: Step;
    nextStep: Step | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepList;
  };
};

export default class DesktopHeaderComponent extends Component<Signature> {}
