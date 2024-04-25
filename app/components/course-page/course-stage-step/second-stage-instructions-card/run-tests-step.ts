import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
  };
}

export default class RunTestsStepComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::SecondStageInstructionsCard::RunTestsStep': typeof RunTestsStepComponent;
  }
}
