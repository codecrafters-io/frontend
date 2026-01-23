import { action } from '@ember/object';
import type Owner from '@ember/owner';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';
import type TeamModel from 'codecrafters-frontend/models/team';
import type SlackIntegrationModel from 'codecrafters-frontend/models/slack-integration';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    team: TeamModel;
  };
}

export default class TeamPageSlackIntegrationSettingsContainer extends Component<Signature> {
  @tracked isUninstallingSlackIntegration = false;
  @tracked currentOrPreviousSlackIntegration: SlackIntegrationModel | null | undefined;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    this.currentOrPreviousSlackIntegration = this.args.team.slackIntegration;
  }

  @action
  async handleUninstallSlackIntegrationButtonClick() {
    if (window.confirm(`Are you sure you want to uninstall the Slack integration for the ${this.args.team.name} team?`)) {
      this.isUninstallingSlackIntegration = true;
      await this.currentOrPreviousSlackIntegration!.destroyRecord();
      this.isUninstallingSlackIntegration = false;
      this.currentOrPreviousSlackIntegration = null;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TeamPage::SlackIntegrationSettingsContainer': typeof TeamPageSlackIntegrationSettingsContainer;
  }
}
