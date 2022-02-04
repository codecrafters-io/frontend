import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamModel extends Model {
  @attr('string') inviteCode;
  @hasMany('team-membership', { async: false }) memberships;
  @attr('string') name;

  get inviteUrl() {
    return `${window.location.origin}/join_team?invite_code=${this.inviteCode}`;
  }

  get isArrenda() {
    return this.name === 'Arrenda';
  }
}
