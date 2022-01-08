import Poller from 'codecrafters-frontend/lib/poller';

export default class LeaderboardPoller extends Poller {
  team;

  async doPoll() {
    if (this.team) {
      return await this.store.query('leaderboard-entry', {
        course_id: this.model.id,
        team_id: this.team.id,
        include: 'language,current-course-stage,user',
      });
    } else {
      return await this.store.query('leaderboard-entry', {
        course_id: this.model.id,
        include: 'language,current-course-stage,user',
      });
    }
  }
}
