import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    repositories: unknown[];
    activeRepository: RepositoryModel;
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Sidebar': typeof CoursePageSidebarComponent;
  }
}
