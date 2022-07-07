import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class SubscriptionSettingsContainerComponent extends Component {
  @tracked isUninstallingSlackIntegration = false;
  @tracked currentOrPreviousSlackIntegration;

  constructor() {
    super(...arguments);

    this.currentOrPreviousSlackIntegration = this.args.team.slackIntegration;
  }

  @action
  async handleUninstallSlackIntegrationButtonClick() {
    if (window.confirm(`Are you sure you want to uninstall the Slack integration for the ${this.args.team.name} team?`)) {
      this.isUninstallingSlackIntegration = true;
      await this.currentOrPreviousSlackIntegration.destroyRecord();
      this.isUninstallingSlackIntegration = false;
      this.currentOrPreviousSlackIntegration = null;
    }
  }
}
