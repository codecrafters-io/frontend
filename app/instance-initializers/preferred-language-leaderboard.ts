import ApplicationInstance from '@ember/application/instance';
import type PreferredLanguageLeaderboardService from 'codecrafters-frontend/services/preferred-language-leaderboard';

export function initialize(applicationInstance: ApplicationInstance) {
  const service = applicationInstance.lookup('service:preferred-language-leaderboard') as PreferredLanguageLeaderboardService;
  service.onBoot();
}

export default {
  initialize,
};
