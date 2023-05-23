import Component from '@glimmer/component';
import privateLeaderboardImage from '/assets/images/team-features/private-leaderboard.png';
import slackIntegrationImage from '/assets/images/team-features/slack-integration.png';
import teamBillingImage from '/assets/images/team-features/team-billing.png';

export default class FeaturesListComponent extends Component {
  get features() {
    return [
      {
        title: 'Private Leaderboard',
        description: 'Add in a dose of healthy competition with a private leaderboard for your team.',
        image: privateLeaderboardImage,
      },
      {
        title: 'Team Subscriptions',
        description: 'Pay for your whole team at once with annual seat-based billing. (Optional)',
        image: teamBillingImage,
      },
      {
        title: 'Slack Integration',
        description: `Subscribe to a real-time stream of your team's activity in your team's Slack workspace.`,
        image: slackIntegrationImage,
      },
    ];
  }
}
