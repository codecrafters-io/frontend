import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onBackButtonClick: () => void;
    onViewInstructionsLinkClick: () => void;
  };
}

export default class SubmitCodeStepComponent extends Component<Signature> {
  @tracked selectedCommandVariant: CopyableTerminalCommandVariant;

  constructor(owner: unknown, args: Signature['Args']) {
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
    'CoursePage::CourseStageStep::TestsPassedModal::SubmitCodeStep': typeof SubmitCodeStepComponent;
  }
}
