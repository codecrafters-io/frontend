import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type { StepDefinition } from 'codecrafters-frontend/components/step-list';
import { action } from '@ember/object';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };
}

class BaseStep {
  isComplete: boolean;
  repository: RepositoryModel;

  constructor(repository: RepositoryModel, isComplete: boolean) {
    this.isComplete = isComplete;
    this.repository = repository;
  }
}

class UncommentCodeStep extends BaseStep implements StepDefinition {
  id = 'uncomment-code';

  get titleMarkdown() {
    const filename = this.repository.firstStageSolution?.changedFiles[0]?.filename;

    if (filename) {
      return `Uncomment code in ${filename}`;
    } else {
      return 'Uncomment code';
    }
  }
}

class SubmitCodeStep extends BaseStep implements StepDefinition {
  id = 'submit-code';

  get titleMarkdown() {
    return 'Git push to submit your changes';
  }
}

export default class FirstStageYourTaskCard extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;

  get filename() {
    const solution = this.args.currentStep.courseStage.solutions.find((solution) => solution.language === this.args.currentStep.repository.language);

    return solution?.changedFiles[0]?.filename;
  }

  get hasPassedTests() {
    return this.args.currentStep.testsStatus === 'passed' || this.args.currentStep.status === 'complete';
  }

  get instructionsMarkdown() {
    return this.args.currentStep.courseStage.buildInstructionsMarkdownFor(this.args.currentStep.repository);
  }

  get steps() {
    return [
      new UncommentCodeStep(this.args.currentStep.repository, this.stepsAreComplete),
      new SubmitCodeStep(this.args.currentStep.repository, this.stepsAreComplete),
    ];
  }

  get stepsAreComplete() {
    return (
      this.args.currentStep.repository.stageIsComplete(this.args.currentStep.courseStage) ||
      (this.args.currentStep.repository.lastSubmission?.courseStage === this.args.currentStep.courseStage &&
        this.args.currentStep.repository.lastSubmissionHasSuccessStatus)
    );
  }

  get videoEmbedHtml() {
    if (this.args.currentStep.courseStage.course.isShell) {
      return `
           <div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;"><iframe
          src="https://www.loom.com/embed/63531adfeb6242eeaff9171bc1211947?hide_title=true&hideEmbedTopBar=true&hide_owner=true"
          style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;"
          allowfullscreen
          scrolling="no"
          allow="encrypted-media *;"
        ></iframe></div>`;
    } else {
      return null;
    }
  }

  @action
  handleViewLogsButtonClick() {
    this.coursePageState.testResultsBarIsExpanded = true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageYourTaskCard': typeof FirstStageYourTaskCard;
  }
}
