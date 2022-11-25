import Controller from '@ember/controller';

export default class ReferController extends Controller {
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
        title: '25% for life',
        description: `Subscribe to a real-time stream of your team's activity in your team's Slack workspace.`,
        image: 'slack-integration',
      },
    ];
  }
}
