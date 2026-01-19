import Component from '@glimmer/component';
import { service } from '@ember/service';
import type { CopyableTerminalCommandVariant } from 'codecrafters-frontend/components/copyable-terminal-command-with-variants';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type UserAgentService from 'codecrafters-frontend/services/user-agent';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onTroubleshootingLinkClick: () => void;
  };
}

export default class TestCliConnectionStep extends Component<Signature> {
  @service declare userAgent: UserAgentService;

  get commandVariants(): CopyableTerminalCommandVariant[] {
    const linuxMacOSVariant = {
      label: 'Linux / macOS',
      commands: ['curl -fsSL https://codecrafters.io/install.sh | bash', 'codecrafters ping'],
    };

    const powershellVariant = {
      label: 'PowerShell',
      commands: ['irm https://codecrafters.io/install.ps1 | iex', 'codecrafters ping'],
    };

    if (this.userAgent.isWindows) {
      return [powershellVariant, linuxMacOSVariant];
    }

    return [linuxMacOSVariant, powershellVariant];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::TestCliConnectionStep': typeof TestCliConnectionStep;
  }
}
