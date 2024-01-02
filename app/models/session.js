import { attr, belongsTo } from '@ember-data/model';
import { collectionAction } from 'ember-api-actions';
import { inject as service } from '@ember/service';
import Model from '@ember-data/model';

export default class SessionModel extends Model {
  @service authenticator;
  @attr('date') expiresAt;
  @belongsTo('user', { async: false, inverse: null }) user;
}

SessionModel.prototype.logout = collectionAction({
  path: 'logout',
  type: 'post',
  // urlType: 'findRecord',

  after(response) {
    this.authenticator.logout();

    if (response.redirect_url) {
      window.location.href = response.redirect_url;
    } else {
      window.location.href = '/';
    }
  },
});
