import Component from '@glimmer/component';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    currentStep: Step;
    nextStep: Step | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepList;
  };
};

export default class StickyHeaderComponent extends Component<Signature> {
  @tracked isSticky = false;

  handleStickyChange = (isSticky: boolean) => {
    next(() => {
      this.isSticky = isSticky;
    });
  };
}
