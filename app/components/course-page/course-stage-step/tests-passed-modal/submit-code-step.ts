import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onActionButtonClick: (action: 'mark_stage_as_complete' | 'refactor_code') => void;
    onBackButtonClick: () => void;
    onViewInstructionsLinkClick: () => void;
    repository: RepositoryModel;
  };
}

export default class SubmitCodeStep extends Component<Signature> {
  @tracked selectedCommandVariant: CopyableTerminalCommandVariant;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.selectedCommandVariant = this.commandVariants[0]!;
  }

  get commandVariants(): CopyableTerminalCommandVariant[] {
    return [
      {
        label: 'codecrafters cli',
        commands: ['codecrafters submit'],
      },
      {
        label: 'git',
        commands: ['git add .', 'git commit --allow-empty -m "[any message]"', 'git push origin master'],
      },
    ];
  }

  @action
  handleVariantSelect(variant: CopyableTerminalCommandVariant) {
    this.selectedCommandVariant = variant;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::TestsPassedModal::SubmitCodeStep': typeof SubmitCodeStep;
  }
}
