import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { inject as service } from '@ember/service';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    course: {
      slug: string;
      name: string;
      releaseStatusIsBeta: boolean;
    };
    repositories: unknown[];
    activeRepository: unknown;
  };

  Blocks: {
    default: [];
  };
}

export default class CoursePageSidebarComponent extends Component<Signature> {
  @service declare authenticator: unknown;
  @service declare coursePageState: CoursePageStateService;

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
}
