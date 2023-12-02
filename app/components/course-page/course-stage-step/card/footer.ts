import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
    repository: RepositoryModel;
  };
}

export default class CardFooterComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;

  @tracked logsAreExpanded = false;

  get currentStep(): CourseStageStep {
    return this.coursePageState.currentStep as CourseStageStep;
  }

  get shouldShowLogsButton() {
    const lastSubmission = this.args.repository.lastSubmission;

    return (
      lastSubmission && lastSubmission.courseStage === this.args.courseStage && (lastSubmission.statusIsSuccess || lastSubmission.statusIsFailure)
    );
  }

  get testResultsBarIsExpanded() {
    return this.coursePageState.testResultsBarIsExpanded;
  }

  @action
  handleLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = !this.coursePageState.testResultsBarIsExpanded;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::Card::Footer': typeof CardFooterComponent;
  }
}
