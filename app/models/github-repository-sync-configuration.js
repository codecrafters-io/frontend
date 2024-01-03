import Model, { attr, belongsTo } from '@ember-data/model';

export default class GithubRepositorySyncConfiguration extends Model {
  @belongsTo('repository', { async: false, inverse: 'githubRepositorySyncConfigurations' }) repository;

  @attr('string') githubRepositoryId;
  @attr('string') githubRepositoryName;
  @attr('string') lastSyncStatus;
  @attr('date') lastSyncedAt;

  get lastSyncFailed() {
    return this.lastSyncStatus === 'failure';
  }
}
