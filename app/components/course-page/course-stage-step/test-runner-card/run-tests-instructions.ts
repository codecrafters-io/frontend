import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
    onViewLogsButtonClick: () => void;
  };
}

export default class RunTestsInstructionsComponent extends Component<Signature> {
  @tracked selectedCommandVariant: CopyableTerminalCommandVariant;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.selectedCommandVariant = this.commandVariants[0]!;
  }

  get commandVariants(): CopyableTerminalCommandVariant[] {
    const cliVariant = {
      label: 'codecrafters cli',
      commands: ['codecrafters test # Visit https://codecrafters.io/cli to install'],
    };

    const gitVariant = {
      label: 'git',
      commands: ['git add .', 'git commit --allow-empty -m "pass stage" # any message', 'git push origin master'],
    };

    if (this.recommendedClientType === 'cli') {
      return [cliVariant, gitVariant];
    } else {
      return [gitVariant];
    }
  }

  get lastSubmission() {
    return this.args.currentStep.repository.lastSubmission;
  }

  get lastSubmissionWasForCurrentStage() {
    return this.lastSubmission?.courseStage === this.args.currentStep.courseStage;
  }

  get recommendedClientType() {
    if (this.args.currentStep.courseStage.isFirst) {
      return 'git';
    } else {
      return 'cli';
    }
  }

  @action
  handleVariantSelect(variant: CopyableTerminalCommandVariant) {
    this.selectedCommandVariant = variant;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::RunTestsInstructions': typeof RunTestsInstructionsComponent;
  }
}
