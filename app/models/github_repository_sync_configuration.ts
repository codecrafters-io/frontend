import Model, { attr, belongsTo } from '@ember-data/model';

import type RepositoryModel from 'codecrafters-frontend/models/repository';

export default class GithubRepositorySyncConfiguration extends Model {
  @attr('string') declare githubRepositoryId: string;
  @attr('string') declare githubRepositoryName: string;
  @attr('string') declare lastSyncStatus: string;
  @attr('date') declare lastSyncedAt: Date;

  @belongsTo('repository', { async: false, inverse: 'githubRepositorySyncConfigurations' }) declare repository: RepositoryModel;

  get lastSyncFailed() {
    return this.lastSyncStatus === 'failure';
  }
}
