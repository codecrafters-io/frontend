import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { TemporaryCourseModel } from 'codecrafters-frontend/models/temporary-types';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: TemporaryCourseModel;
    repositories: unknown[];
    activeRepository: TemporaryRepositoryModel;
  };

  Blocks: {
    default: [];
  };
}

export default class CoursePageSidebarComponent extends Component<Signature> {
  @service declare authenticator: unknown;
  @service declare coursePageState: CoursePageStateService;

  @tracked configureExtensionsModalIsOpen = false;

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get currentUser() {
    // @ts-ignore
    return this.authenticator.currentUser;
  }

  get stepList() {
    return this.coursePageState.stepList as StepList;
  }

  configureExtensionsButtonIsDisabled() {
    return this.args.activeRepository.isNew;
  }

  @action
  handleConfigureExtensionsButtonClick() {
    if (this.configureExtensionsButtonIsDisabled()) {
      return;
    }

    this.configureExtensionsModalIsOpen = true;
  }
}
