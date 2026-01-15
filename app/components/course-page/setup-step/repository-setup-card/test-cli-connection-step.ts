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

const POWERSHELL_VARIANT: CopyableTerminalCommandVariant = {
  label: 'PowerShell',
  commands: ['irm https://codecrafters.io/install.ps1 | iex', 'codecrafters ping'],
};

const POSIX_VARIANT: CopyableTerminalCommandVariant = {
  label: 'Linux / macOS',
  commands: ['curl https://codecrafters.io/install.sh | sh', 'codecrafters ping'],
};

export default class TestCliConnectionStep extends Component<Signature> {
  @service declare userAgent: UserAgentService;

  get commandVariants(): CopyableTerminalCommandVariant[] {
    if (this.userAgent.isWindows) {
      return [POWERSHELL_VARIANT, POSIX_VARIANT];
    }

    return [POSIX_VARIANT, POWERSHELL_VARIANT];
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::TestCliConnectionStep': typeof TestCliConnectionStep;
  }
}
