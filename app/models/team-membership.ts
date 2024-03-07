import Model, { attr, belongsTo } from '@ember-data/model';
import type TeamModel from './team';
import type UserModel from './user';

export default class TeamMembershipModel extends Model {
  @belongsTo('user', { async: false, inverse: 'teamMemberships' }) declare user: UserModel;
  @belongsTo('team', { async: false, inverse: 'memberships' }) declare team: TeamModel;

  @attr('date') declare createdAt: Date;
  @attr('boolean') declare isAdmin: boolean;

  get isSoleAdmin(): boolean {
    return this.team.admins.length === 1 && this.isAdmin;
  }
}
