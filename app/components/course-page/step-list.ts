import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { StepList } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    stepList: StepList;
  };
}

export default class StepListComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get activeStep() {
    return this.coursePageState.activeStep;
  }

  get baseStagesStepGroup() {
    return this.args.stepList.stepGroups.find((group) => group.type === 'BaseStagesStepGroup');
  }

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get otherStepGroups() {
    return this.args.stepList.stepGroups.filter((group) => group.type !== 'BaseStagesStepGroup');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepList': typeof StepListComponent;
  }
}
