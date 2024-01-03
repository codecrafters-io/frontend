import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamMembershipModel extends Model {
  @attr('date') createdAt;
  @attr('boolean') isAdmin;
  @belongsTo('user', { async: false, inverse: 'teamMemberships' }) user;
  @belongsTo('team', { async: false, inverse: 'memberships' }) team;

  get isSoleAdmin() {
    return this.team.admins.length === 1 && this.isAdmin;
  }
}
