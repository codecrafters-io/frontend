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
  // @ts-ignore
  @service authenticator;

  @service declare coursePageState: CoursePageStateService;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentStep() {
    return this.coursePageState.currentStep;
  }

  get stepList() {
    return this.coursePageState.stepList as StepList;
  }
}
