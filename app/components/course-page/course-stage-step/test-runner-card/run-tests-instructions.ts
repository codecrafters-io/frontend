import { action } from '@ember/object';
import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import { service } from '@ember/service';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
    onViewLogsButtonClick: () => void;
  };
}

export default class RunTestsInstructions extends Component<Signature> {
  @service declare featureFlags: FeatureFlagsService;

  @tracked selectedCommandVariant: CopyableTerminalCommandVariant;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.selectedCommandVariant = this.commandVariants[0]!;
  }

  get commandVariants(): CopyableTerminalCommandVariant[] {
    const cliVariant = {
      label: 'codecrafters cli',
      commands: ['codecrafters submit # Visit https://codecrafters.io/cli to install'],
    };

    const gitVariant = {
      label: 'git',
      commands: ['git add .', 'git commit --allow-empty -m "[any message]"', 'git push origin master'],
    };

    if (this.recommendedClientType === 'cli') {
      return [cliVariant, gitVariant];
    } else {
      return [gitVariant, cliVariant];
    }
  }

  get lastSubmission() {
    return this.args.currentStep.repository.lastSubmission;
  }

  get recommendedClientType() {
    if (this.featureFlags.canViewCLIPingFlow) {
      return 'cli';
    }

    if (this.args.currentStep.courseStage.isFirst || this.args.currentStep.courseStage.isSecond) {
      return 'git';
    } else {
      return 'cli';
    }
  }

  get userHasRunTestsForStageAtLeastOnce() {
    return !this.lastSubmission?.clientTypeIsSystem && this.lastSubmission?.courseStage === this.args.currentStep.courseStage;
  }

  @action
  handleVariantSelect(variant: CopyableTerminalCommandVariant) {
    this.selectedCommandVariant = variant;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestRunnerCard::RunTestsInstructions': typeof RunTestsInstructions;
  }
}
