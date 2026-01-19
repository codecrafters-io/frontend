import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from 'codecrafters-frontend/models/user';

export default class ViewModel extends Model {
  @belongsTo('user', { async: false, inverse: null }) declare viewer?: UserModel;
  @belongsTo('viewable', { async: false, inverse: null, polymorphic: true }) declare resource: unknown;
  @attr({}) declare metadata: Record<string, unknown>;
}
