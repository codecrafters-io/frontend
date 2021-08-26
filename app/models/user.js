import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') avatarUrl;
  @attr('date') createdAt;
  @attr('string') githubUsername;
  @attr('string') username;
}
