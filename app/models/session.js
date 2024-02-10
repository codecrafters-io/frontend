import { attr, belongsTo } from '@ember-data/model';
import { collectionAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import Model from '@ember-data/model';

export default class SessionModel extends Model {
  @service authenticator;
  @service router;
  @attr('date') expiresAt;
  @belongsTo('user', { async: false, inverse: null }) user;
}

SessionModel.prototype.logout = collectionAction({
  path: 'logout',
  type: 'post',
  // urlType: 'findRecord',

  async after(response) {
    this.authenticator.logout();

    return response;
  },
});
