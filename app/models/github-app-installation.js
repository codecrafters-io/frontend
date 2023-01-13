import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

export default class GithubAppInstallation extends Model {
  @belongsTo('user', { async: false }) user;

  @attr('string') githubConfigureUrl;
  @attr('string') status;

  get isUninstalled() {
    return this.status === 'uninstalled';
  }

  get isBroken() {
    return this.status && this.status !== 'active';
  }
}

GithubAppInstallation.prototype.fetchAccessibleRepositories = memberAction({
  path: 'accessible-repositories',
  type: 'get',

  after(response) {
    return response.map((repository) => {
      return {
        id: repository.id,
        fullName: repository.full_name,
        createdAt: Date.parse(repository.created_at),
      };
    });
  },
});
