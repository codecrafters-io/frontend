import Component from '@glimmer/component';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    onClick: () => void;
    isUninstallingSlackIntegration: boolean;
  };
}

export default class TeamPageUninstallSlackIntegrationButton extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::UninstallSlackIntegrationButton': typeof TeamPageUninstallSlackIntegrationButton;
  }
}
