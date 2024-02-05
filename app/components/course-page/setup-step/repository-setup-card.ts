import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
};

export default class RepositorySetupCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  get isComplete() {
    return this.coursePageState.currentStep.status === 'complete';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard': typeof RepositorySetupCardComponent;
  }
}
