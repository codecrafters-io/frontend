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

export default class TestCliConnectionStep extends Component<Signature> {
  @tracked commandVariants: CopyableTerminalCommandVariant[] = [];
  @tracked selectedCommandVariant: CopyableTerminalCommandVariant | null = null;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);
    this.loadCommandVariants();
  }

  @action
  handleVariantSelect(variant: CopyableTerminalCommandVariant) {
    this.selectedCommandVariant = variant;
  }

  async loadCommandVariants() {
    const powershellVariant: CopyableTerminalCommandVariant = {
      label: 'PowerShell',
      commands: ['irm https://codecrafters.io/install.ps1 | iex', 'codecrafters ping'],
    };

    const posixVariant: CopyableTerminalCommandVariant = {
      label: 'Shell',
      commands: ['curl https://codecrafters.io/install.sh | sh', 'codecrafters ping'],
    };

    if ((await detectOperatingSystem()) === 'Windows') {
      this.commandVariants = [powershellVariant, posixVariant];
    } else {
      this.commandVariants = [posixVariant, powershellVariant];
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::TestCliConnectionStep': typeof TestCliConnectionStep;
  }
}
