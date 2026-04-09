import Model, { attr, belongsTo } from '@ember-data/model';
import type TeamModel from './team';
import type UserModel from './user';

export default class TeamMembershipModel extends Model {
  @belongsTo('user', { async: false, inverse: 'teamMemberships' }) declare user: UserModel;
  @belongsTo('team', { async: false, inverse: 'memberships' }) declare team: TeamModel;

  @attr('date') declare createdAt: Date;
  @attr('boolean') declare isAdmin: boolean;
  @attr('number') declare numberOfStageAttempts: number;
  @attr('date') declare lastAttemptAt: Date | null;

  @attr('number') declare numberOfAttempts: number;
  @attr('number') declare numberOfStagesCompleted: number;
  @attr('number') declare numberOfAttempts3m: number;
  @attr('number') declare numberOfAttempts6m: number;
  @attr('number') declare numberOfAttempts1y: number;
  @attr('number') declare numberOfStagesCompleted3m: number;
  @attr('number') declare numberOfStagesCompleted6m: number;
  @attr('number') declare numberOfStagesCompleted1y: number;

  get isSoleAdmin(): boolean {
    return this.team.admins.length === 1 && this.isAdmin;
  }
}
