import Poller from 'codecrafters-frontend/lib/poller';

export default class LeaderboardPoller extends Poller {
  async doPoll() {
    return await this.store.query('leaderboard-entry', {
      course_id: this.model.id,
      include: 'language,current-course-stage,user',
    });
  }
}
