import Component from '@glimmer/component';

export default class FeaturesListComponent extends Component {
  get features() {
    return [
      {
        title: 'Private Leaderboard',
        description: 'Add in a dose of healthy competition with a private leaderboard for your team.',
        imageURL: `/assets/images/team-features/private-leaderboard.png`,
      },
      {
        title: 'Team Subscriptions',
        description: 'Pay for your whole team at once with both monthly & annual billing options. (Optional)',
        imageURL: `/assets/images/team-features/team-billing.png`,
      },
      {
        title: 'Slack Integration',
        description: `Subscribe to a real-time stream of your team's activity in your team's Slack workspace.`,
        imageURL: `/assets/images/team-features/slack-integration.png`,
      },
    ];
  }
}
