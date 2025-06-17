import Service, { inject as service } from '@ember/service';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';

const GLOBAL_LEADERBOARD_ID = 'GLOBAL_LEADERBOARD_ID';

export default class LeaderboardTeamStorageService extends Service {
  static STORAGE_KEY = 'leaderboard-team-selection-v1';

  @service declare localStorage: LocalStorageService;

  get hasSelectedGlobalLeaderboard(): boolean {
    return this.selectedTeamId === GLOBAL_LEADERBOARD_ID;
  }

  get selectedTeamId(): string | null {
    return this.localStorage.getItem(LeaderboardTeamStorageService.STORAGE_KEY);
  }

  clear(): void {
    this.localStorage.removeItem(LeaderboardTeamStorageService.STORAGE_KEY);
  }

  setSelectedTeamId(teamId: string | null): void {
    this.localStorage.setItem(LeaderboardTeamStorageService.STORAGE_KEY, teamId || GLOBAL_LEADERBOARD_ID);
  }
}
