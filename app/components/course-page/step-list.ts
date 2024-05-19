import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { StepList } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeRepository: RepositoryModel;
    course: CourseModel;
    onConfigureExtensionsButtonClick: () => void;
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

  get shouldShowConfigureExtensionsButtonBelowBaseStages() {
    // get('isNew') works around type error
    if (this.args.activeRepository.get('isNew')) {
      return false;
    }

    return this.args.course.hasExtensions && this.args.activeRepository.extensionActivations.length < this.args.course.extensions.length;
  }

  get toggleButtonTooltipCopy() {
    if (this.args.activeRepository.get('isNew')) {
      return 'Complete repository setup to configure extensions';
    } else {
      return 'Click here to configure extensions';
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::StepList': typeof StepListComponent;
  }
}
