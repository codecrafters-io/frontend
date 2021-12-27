import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('boolean') isBetaParticipant;
  @attr('string') username;
  @hasMany('subscription', { async: false }) subscriptions;

  get hasActiveSubscription() {
    return this.subscriptions.isAny('isActive');
  }

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }
}
