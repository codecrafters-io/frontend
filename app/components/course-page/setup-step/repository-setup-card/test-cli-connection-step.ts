import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type Owner from '@ember/owner';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import detectOperatingSystem from 'codecrafters-frontend/utils/detect-operating-system';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onTroubleshootingLinkClick: () => void;
  };
}

const POWERSHELL_VARIANT: CopyableTerminalCommandVariant = {
  label: 'PowerShell',
  commands: ['irm https://codecrafters.io/install.ps1 | iex', 'codecrafters ping'],
};

const POSIX_VARIANT: CopyableTerminalCommandVariant = {
  label: 'POSIX',
  commands: ['curl https://codecrafters.io/install.sh | sh', 'codecrafters ping'],
};

export default class TestCliConnectionStep extends Component<Signature> {
  // Default to Shell first; reordered after OS detection completes
  @tracked commandVariants: CopyableTerminalCommandVariant[] = [POSIX_VARIANT, POWERSHELL_VARIANT];
  @tracked selectedCommandVariant: CopyableTerminalCommandVariant | null = null;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);
    this.reorderVariantsForOS();
  }

  @action
  handleVariantSelect(variant: CopyableTerminalCommandVariant) {
    this.selectedCommandVariant = variant;
  }

  async reorderVariantsForOS() {
    if ((await detectOperatingSystem()) === 'Windows') {
      this.commandVariants = [POWERSHELL_VARIANT, POSIX_VARIANT];
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::TestCliConnectionStep': typeof TestCliConnectionStep;
  }
}
