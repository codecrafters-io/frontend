import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('boolean') isBetaParticipant;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('string') username;

  get githubProfileUrl() {
    return `https://github.com/${this.githubUsername}`;
  }
}
