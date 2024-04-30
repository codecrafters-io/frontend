import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    currentStep: CourseStageStep;
  };
}

export default class RefactorCodeInstructionsComponent extends Component<Signature> {
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
      commands: ['git add .', 'git commit --allow-empty -m "run tests" # any message', 'git push origin master'],
    };

    if (this.recommendedClientType === 'cli') {
      return [cliVariant, gitVariant];
    } else {
      return [gitVariant];
    }
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
    'CoursePage::CourseStageStep::TestRunnerCard::RefactorCodeInstructions': typeof RefactorCodeInstructionsComponent;
  }
}
