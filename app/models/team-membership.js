import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamMembershipModel extends Model {
  @attr('date') createdAt;
  @attr('boolean') isAdmin;
  @belongsTo('user', { async: false }) user;
  @belongsTo('team', { async: false }) team;
}
