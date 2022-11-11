import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class GithubRepositorySyncConfiguration extends Model {
  @belongsTo('repository', { async: false }) repository;

  @attr('string') githubRepositoryId;
  @attr('string') githubRepositoryName;
  @attr('date') lastSyncedAt;
}
