import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
    onViewLogsButtonClick: () => void;
  };
}

export default class RunTestsInstructionsComponent extends Component<Signature> {
  @tracked alternateClientInstructionsAreExpanded = false;

  get lastSubmission() {
    return this.args.currentStep.repository.lastSubmission;
  }

  get lastSubmissionWasForCurrentStage() {
    return this.lastSubmission?.courseStage === this.args.currentStep.courseStage;
  }

  get suggestedClientType() {
    if (this.args.currentStep.courseStage.isFirst) {
      return 'git';
    } else {
      return 'cli';
    }
  }

  get suggestedCommands() {
    return this.suggestedClientType === 'git' ? this.suggestedCommandsForGit : this.suggestedCommandsForCli;
  }

  get suggestedCommandsForAlternateClient() {
    return this.suggestedClientType === 'git' ? this.suggestedCommandsForCli : this.suggestedCommandsForGit;
  }

  get suggestedCommandsForCli() {
    return ['codecrafters test # Visit https://codecrafters.io/cli to install'];
  }

  get suggestedCommandsForGit() {
    return ['git add .', 'git commit --allow-empty -m "pass stage" # any message', 'git push origin master'];
  }

  @action
  toggleAlternateClientInstructions() {
    this.alternateClientInstructionsAreExpanded = !this.alternateClientInstructionsAreExpanded;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::RunTestsInstructions': typeof RunTestsInstructionsComponent;
  }
}
