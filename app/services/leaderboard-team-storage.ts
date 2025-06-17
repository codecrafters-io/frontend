import Service, { inject as service } from '@ember/service';
import LocalStorageService from 'codecrafters-frontend/services/local-storage';

const GLOBAL_LEADERBOARD_TEAM_ID = 'FAKE_GLOBAL_LEADERBOARD_TEAM_ID';

export default class LeaderboardTeamStorageService extends Service {
  static STORAGE_KEY = 'leaderboard-team-selection-v1';

  @service declare localStorage: LocalStorageService;

  get hasSavedTeam(): boolean {
    return this.savedTeamId !== null;
  }

  get savedTeamId(): string | null {
    return this.localStorage.getItem(LeaderboardTeamStorageService.STORAGE_KEY);
  }

  clear(): void {
    this.localStorage.removeItem(LeaderboardTeamStorageService.STORAGE_KEY);
  }

  setSavedTeamId(teamId: string | null): void {
    this.localStorage.setItem(LeaderboardTeamStorageService.STORAGE_KEY, teamId || GLOBAL_LEADERBOARD_TEAM_ID);
  }
}
