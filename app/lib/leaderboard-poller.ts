import Poller from 'codecrafters-frontend/lib/poller';
import type CourseModel from 'codecrafters-frontend/models/course';
import type TeamModel from 'codecrafters-frontend/models/team';

export default class LeaderboardPoller extends Poller {
  team?: TeamModel;

  async doPoll() {
    // Avoid thundering herd by waiting for a random amount of time (up to 1 second)
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000)));

    if (this.team) {
      return await this.store.query('leaderboard-entry', {
        course_id: (this.model as CourseModel).id,
        team_id: this.team.id,
        include: 'language,current-course-stage,user',
      });
    } else {
      return await this.store.query('leaderboard-entry', {
        course_id: (this.model as CourseModel).id,
        include: 'language,current-course-stage,user',
      });
    }
  }
}
