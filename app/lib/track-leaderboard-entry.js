
// Same as the ember model, used to avoid creating fake models
export default class TrackLeaderboardEntry {
  completedStagesCount;
  language;
  user;

  constructor({ completedStagesCount, language, user }) {
    this.completedStagesCount = completedStagesCount;
    this.language = language;
    this.user = user;
  }

  get userId() {
    return this.user.id;
  }
}
