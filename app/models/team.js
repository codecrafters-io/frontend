import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamModel extends Model {
  @attr('string') inviteCode;
  @hasMany('team-membership', { async: false }) memberships;
  @attr('string') name;
  @attr('string') slackAppInstallationUrl;
  @hasMany('team-subscription', { async: false }) subscriptions;

  get activeSubscription() {
    return this.subscriptions.findBy('isActive');
  }

  get admins() {
    return this.memberships.filterBy('isAdmin', true).mapBy('user');
  }

  get hasActiveSubscription() {
    return !!this.activeSubscription;
  }

  get inviteUrl() {
    return `${window.location.origin}/join_team?invite_code=${this.inviteCode}`;
  }

  get members() {
    return this.memberships.mapBy('user');
  }
}
