import Model, { attr, belongsTo } from '@ember-data/model';
import { memberAction } from 'ember-api-actions';

import type UserModel from 'codecrafters-frontend/models/user';

export default class GithubAppInstallation extends Model {
  @attr('string') declare githubConfigureUrl: string;
  @attr('string') declare status: string;

  @belongsTo('user', { async: false, inverse: 'githubAppInstallations' }) declare user: UserModel;

  get isBroken() {
    return this.status && this.status !== 'active';
  }

  get isUninstalled() {
    return this.status === 'uninstalled';
  }

  declare fetchAccessibleRepositories: (this: Model, payload: unknown) => Promise<{ id: string; fullName: string; createdAt: number }[]>;
}

GithubAppInstallation.prototype.fetchAccessibleRepositories = memberAction({
  path: 'accessible-repositories',
  type: 'get',

  after(response) {
    return response.map((repository: { id: string; full_name: string; created_at: string }) => {
      return {
        id: repository.id,
        fullName: repository.full_name,
        createdAt: Date.parse(repository.created_at),
      };
    });
  },
});
