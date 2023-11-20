import Poller from 'codecrafters-frontend/lib/poller';
import type CourseModel from 'codecrafters-frontend/models/course';
import type TeamModel from 'codecrafters-frontend/models/team';

export default class LeaderboardPoller extends Poller {
  team: TeamModel | null = null;

  async doPoll() {
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
