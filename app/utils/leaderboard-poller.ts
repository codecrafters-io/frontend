import Poller from 'codecrafters-frontend/utils/poller';
import type CourseModel from 'codecrafters-frontend/models/course';
import type TeamModel from 'codecrafters-frontend/models/team';
import config from 'codecrafters-frontend/config/environment';

export default class LeaderboardPoller extends Poller {
  team?: TeamModel;

  async doPoll() {
    // Avoid thundering herd by waiting for a random amount of time (up to 1 second)
    const maxJitterMs = 1000;
    const delayMs = Math.floor(Math.random() * maxJitterMs);

    // In tests, running this with a low value like 10ms doesn't work, it ends up waiting for ~300ms.
    if (config.environment !== 'test') {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

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
