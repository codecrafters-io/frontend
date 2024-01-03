import Poller from 'codecrafters-frontend/utils/poller';
import type CourseModel from 'codecrafters-frontend/models/course';
import type TeamModel from 'codecrafters-frontend/models/team';
import config from 'codecrafters-frontend/config/environment';

export default class LeaderboardPoller extends Poller {
  team?: TeamModel;

  async doPoll() {
    // Avoid thundering herd by waiting for a random amount of time (up to 1 second)
    const maxJitterMs = config.environment === 'test' ? 10 : 1000;
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * maxJitterMs)));

    if (this.team) {
      return await this.store.query('course-leaderboard-entry', {
        course_id: (this.model as CourseModel).id,
        team_id: this.team.id,
        include: 'language,current-course-stage,user',
      });
    } else {
      return await this.store.query('course-leaderboard-entry', {
        course_id: (this.model as CourseModel).id,
        include: 'language,current-course-stage,user',
      });
    }
  }
}
