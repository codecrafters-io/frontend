import { attr, belongsTo } from '@ember-data/model';
import { collectionAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Model from '@ember-data/model';
import RouterService from '@ember/routing/router-service';

import type UserModel from 'codecrafters-frontend/models/user';

export default class SessionModel extends Model {
  @attr('date') declare expiresAt: Date;

  @belongsTo('user', { async: false, inverse: null }) declare user: UserModel;

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  declare logout: (this: Model, payload: unknown) => Promise<Promise<any>>;
}

SessionModel.prototype.logout = collectionAction({
  path: 'logout',
  type: 'post',
  // urlType: 'findRecord',

  async after(response) {
    // @ts-ignore authenticator is not recognized
    this.authenticator.logout();

    return response;
  },
});
