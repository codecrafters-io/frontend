import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class JoinReferralProgramContainerComponent extends Component {
  @service store;
  @service('current-user') currentUserService;
  @tracked isCreatingReferralLink = false;

  get features() {
    return [
      {
        title: 'Easy to share',
        description: 'Add in a dose of healthy competition with a private leaderboard for your team.',
        image: 'private-leaderboard',
      },
      {
        title: 'Easy to claim',
        description: 'Pay for your whole team at once with annual seat-based billing. (Optional)',
        image: 'team-billing',
      },
      {
        title: '60% for life',
        description: `Subscribe to a real-time stream of your team's activity in your team's Slack workspace.`,
        image: 'slack-integration',
      },
    ];
  }

  @action
  async handleGetStartedButtonClick() {
    const referralLink = this.store.createRecord('referral-link', {
      user: this.currentUserService.record,
      slug: this.currentUserService.record.username,
    });

    this.isCreatingReferralLink = true;
    await referralLink.save();
    this.isCreatingReferralLink = false;
  }
}
