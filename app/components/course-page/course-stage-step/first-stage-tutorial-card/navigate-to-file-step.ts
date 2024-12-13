import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    courseStage: CourseStageModel;
    isComplete: boolean;
    shouldShowStage1Help: boolean;
  };
}

export default class NavigateToFileStepComponent extends Component<Signature> {
  @tracked selectedCommandVariant: CopyableTerminalCommandVariant;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    this.selectedCommandVariant = this.commandVariants[0]!;
  }

  get commandVariants(): CopyableTerminalCommandVariant[] {
    return [
      {
        label: 'Windows',
        commands: ['start .'],
      },
      {
        label: 'macOS',
        commands: ['open .'],
      },
      {
        label: 'Linux',
        commands: ['ls'],
      },
    ];
  }

  get filename() {
    return this.solution?.changedFiles[0]?.filename;
  }

  get solution() {
    return this.args.courseStage.solutions.find((solution) => solution.language === this.args.repository.language);
  }

  @action
  handleVariantSelect(variant: CopyableTerminalCommandVariant) {
    this.selectedCommandVariant = variant;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::FirstStageTutorialCard::NavigateToFileStep': typeof NavigateToFileStepComponent;
  }
}
