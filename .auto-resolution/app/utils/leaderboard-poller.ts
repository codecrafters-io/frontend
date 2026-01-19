import type CourseModel from 'codecrafters-frontend/models/course';
import type TeamModel from 'codecrafters-frontend/models/team';
import type CourseLeaderboardEntry from 'codecrafters-frontend/models/course-leaderboard-entry';

export default class LeaderboardPoller {
  declare course: CourseModel;
  team?: TeamModel;

  constructor(course: CourseModel, team?: TeamModel) {
    this.course = course;
    this.team = team;
  }

  async doPoll(): Promise<CourseLeaderboardEntry[]> {
    if (this.team) {
      return (await this.course.store.query('course-leaderboard-entry', {
        course_id: this.course.id,
        team_id: this.team.id,
        include: 'language,current-course-stage,user',
      })) as unknown as CourseLeaderboardEntry[];
    } else {
      return (await this.course.store.query('course-leaderboard-entry', {
        course_id: this.course.id,
        include: 'language,current-course-stage,user',
      })) as unknown as CourseLeaderboardEntry[];
    }
  }
}
